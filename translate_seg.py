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
    """
    Prevents 'naked headers' by ensuring short prose blocks are 
    bundled with the following structural or prose content.
    """
    merged = []
    i = 0
    while i < len(chunks):
        ctype, ctext = chunks[i]
        
        # Lookahead Logic: If current is a header or very short prose
        # and there is a subsequent block available
        if ctype == "prose" and (ctext.startswith('#') or len(ctext) < 50) and i + 1 < len(chunks):
            next_ctype, next_ctext = chunks[i+1]
            
            # Bundle them together to provide context to the LLM
            # We treat the merged block as 'prose' so the LLM processes the internal tags
            combined_text = ctext + "\n\n" + next_ctext
            merged.append(("prose", combined_text))
            i += 2 # Skip the next block since it's now bundled
        else:
            merged.append((ctype, ctext))
            i += 1
            
    return merged


def fix_relative_paths(text):
    # Matches Markdown links [text](path)
    # Ignores http, /, #, and already existing ../
    text = re.sub(r'(\[.*?\]\()(?!(?:http|/|#|\.\./))', r'\1../', text) 
    
    # Matches HTML attributes src="path" or href="path"
    text = re.sub(r'((?:src|href)=["\'])(?!(?:http|/|#|\.\./))', r'\1../', text)
    
    return text

# The regex used to capture complex "tree" structures (div/details) as single chunks
pattern = r'(' \
          r'```[\s\S]*?```|' \
          r'<(div|details|section|table)\b[^>]*>[\s\S]*?<\/\2>|' \
          r'^#{1,6} .*' \
          r')'


FORBIDDEN = ["This section", "In this", "means", "explains", "以下", "说明"]

# 3. Prompt

SYSTEM_PROSE = (
    f"You are a robotic technical translation engine for {target_lang_name}.\n"
    "STRICT RULES:\n"
    "- Translate human text inside tags (e.g., <summary>Text</summary> -> <summary>翻译</summary>).\n"
    "- NEVER translate HTML tag names or attributes (keep <div>, <summary>, <strong> as is).\n"
    "- Preserve Markdown syntax (#, **, `) exactly.\n"
    "- Keep technical terms (GPU, VRAM, CLI, Docker, GEMM) in English.\n"
    "- Output ONLY the translated result. No explanations or intro."
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

    # Fix markdown links: [text](path)
    full_text = re.sub(r'(\[.*?\]\()(?!(?:http|/|#|\.\./))', r'\1../', full_text) 

    # Fix HTML attributes: src="path" or href="path"
    full_text = re.sub(r'((?:src|href)=["\'])(?!(?:http|/|#|\.\./))', r'\1../', full_text)

    os.makedirs("locales", exist_ok=True)
    with open(f"locales/README.{args.lang}.md", "w", encoding="utf-8") as f:
        f.write(full_text)


if __name__ == "__main__":
    main()
