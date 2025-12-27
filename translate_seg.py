import os
import re
import argparse
import sys
from openai import OpenAI

# 1. Config
LANG_MAP = {
    "de": "German", "fr": "French", "es": "Spanish", "ja": "Japanese",
    "zh": "Chinese(Simplified)", "ru": "Russian", "pt": "Portuguese",
    "ko": "Korean", "hi": "Hindi"
}

parser = argparse.ArgumentParser()
parser.add_argument("--lang", type=str, required=True)
args = parser.parse_args()
target_lang_name = LANG_MAP.get(args.lang, "English")

client = OpenAI(base_url="http://localhost:5432/v1", api_key="lm-studio")

# 2. Chunking

def get_smart_chunks(text):
    pattern = r'(' \
              r'```[\s\S]*?```|' \
              r'<div\b[^>]*>[\s\S]*?<\/div>|' \
              r'<details\b[^>]*>[\s\S]*?<\/details>|' \
              r'^#{1,6} .*' \
              r')'

    raw_parts = re.split(pattern, text, flags=re.MULTILINE | re.IGNORECASE)
    chunks = []

    for part in raw_parts:
        if not part or not part.strip():
            continue

        p = part.strip()

        if (
            p.startswith(('<div', '<details', '```')) or
            p.startswith('<!--') or p.endswith('-->') or
            re.match(r'!\[.*?\]\(.*?\)', p) or
            re.match(r'\[.*?\]\(.*?\)', p)
        ):
            chunks.append(("struct", p))
        else:
            chunks.append(("prose", p))

    return chunks


def merge_small_chunks(chunks, min_chars=400):
    merged = []
    buffer = ""

    for ctype, ctext in chunks:
        if ctype == "prose":
            buffer += "\n\n" + ctext.strip()
        else:
            if buffer:
                merged.append(("prose", buffer.strip()))
                buffer = ""
            merged.append((ctype, ctext))

    if buffer:
        merged.append(("prose", buffer.strip()))

    return merged


FORBIDDEN = ["This section", "In this", "means", "explains", "以下", "说明"]

# 3. Prompt

SYSTEM_PROSE = (
    f"You are a literal translation engine. Translate into {target_lang_name}.\n"
    "Rules:\n"
    "- Output ONLY the translation.\n"
    "- Do NOT explain or add content.\n"
    "- Preserve formatting and symbols.\n"
    "- If input is not meaningful language, return it unchanged.\n"
)

# 4. Main

def main():
    with open("README.md", "r", encoding="utf-8") as f:
        content = f.read()

    chunks = merge_small_chunks(get_smart_chunks(content))

    print("\n--- Chunk Preview ---")
    for i, (ctype, ctext) in enumerate(chunks):
        preview = ctext.replace("\n", " ")[:120]
        print(f"[{i+1:02d}] {ctype.upper():6} | {len(ctext):4} chars | {preview}...")
    print("--- End Preview ---\n")

    input("Press Enter to start translation...")

    final_output = []

    for i, (ctype, ctext) in enumerate(chunks):
        print(f"\n[{i+1}/{len(chunks)}] {ctype.upper()} ({len(ctext)} chars)")
        print("-" * 60)
        print(ctext[:300])
        print("-" * 60)

        if ctype == "struct":
            final_output.append(ctext + "\n\n")
            continue

        response = client.chat.completions.create(
            model="aya-expanse-8b",
            messages=[{"role": "system", "content": SYSTEM_PROSE}, {"role": "user", "content": ctext}],
            temperature=0,
            stream=True
        )

        translated = ""
        aborted = False

        for part in response:
            delta = part.choices[0].delta.content
            if not delta:
                continue

            translated += delta

            if len(translated) > 2.5 * len(ctext):
                print("\n[WARN] Output too long — aborting.")
                aborted = True
                break

            if any(f in translated for f in FORBIDDEN):
                print("\n[WARN] Forbidden phrase — aborting.")
                aborted = True
                break

            sys.stdout.write(delta)
            sys.stdout.flush()

        if aborted:
            translated = ctext

        final_output.append(translated.rstrip() + "\n\n")

    full_text = "".join(final_output)

    # Fix only markdown relative links, not HTML
    full_text = re.sub(r'(\[.*?\]\()(?!(?:http|/|#|\.\./))', r'\1../', full_text) 
    full_text = re.sub(r'((?:src|href)=["\'])(?!(?:http|/|#|\.\./))', r'\1../', full_text)

    os.makedirs("locales", exist_ok=True)
    with open(f"locales/README.{args.lang}.md", "w", encoding="utf-8") as f:
        f.write(full_text)


if __name__ == "__main__":
    main()
