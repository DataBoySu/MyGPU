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

# 1. Config and Argument Parsing

# NEW: Language-Specific Prompt Injection
lang_guidance = ""
scripts_dir = "scripts"
guidance_file = os.path.join(scripts_dir, f"{args.lang}.txt")

if os.path.exists(guidance_file):
    with open(guidance_file, "r", encoding="utf-8") as f:
        lang_guidance = f.read().strip()
    print(f"[INFO] Injected language-specific guidance from {guidance_file}")
else:
    print(f"[INFO] No specific guidance found for '{args.lang}', using global defaults.")



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
    i = 0
    while i < len(chunks):
        ctype, ctext = chunks[i]
        
        if ctype == "prose" and (ctext.startswith('#') or len(ctext) < 50) and i + 1 < len(chunks):
            next_ctype, next_ctext = chunks[i+1]
            combined_text = ctext + "\n\n" + next_ctext
            
            # If we swallowed a struct, call it a hybrid
            new_type = "hybrid" if next_ctype == "struct" else "prose"
            merged.append((new_type, combined_text))
            i += 2 
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


FORBIDDEN = [
    # English
    "This section", "In this", "In this section", "means", "explains",

    # Chinese (Simplified)
    "以下", "说明", "本节", "在这里", "意味着", "解释",

    # German
    "Dieser Abschnitt", "In diesem", "In diesem Abschnitt", "bedeutet", "erklärt",

    # French
    "Cette section", "Dans cette", "Dans cette section", "signifie", "explique",

    # Spanish
    "Esta sección", "En esta", "En esta sección", "significa", "explica",

    # Japanese
    "このセクション", "この中で", "このセクションでは", "意味する", "説明する",

    # Russian
    "Этот раздел", "В этом", "В этом разделе", "означает", "объясняет",

    # Portuguese
    "Esta seção", "Nesta seção", "significa", "explica",

    # Korean
    "이 섹션", "이 안에서", "이 섹션에서는", "의미한다", "설명한다",

    # Hindi
    "यह अनुभाग", "इसमें", "इस अनुभाग में", "का अर्थ है", "समझाता है",
]

# 3. Prompt
SYSTEM_HEADER = (
    f"You are a technical translation filter for {target_lang_name}.\n"
    "STRICT RULES:\n"
    "- The input is a single section header. Translate it 1:1.\n"
    "- DO NOT generate any content, lists, or descriptions under the header.\n"
    "- Preserve the '#' symbols exactly.\n"
    "- Output ONLY the translated header."
)

SYSTEM_PROSE = (
    f"You are a professional technical translation engine. "
    f"Your task: Translate the input into {target_lang_name}.\n"
    "STRICT RULES:\n"
    "- Output ONLY the final translated text. No intros, no 'Here is the translation'.\n"
    "- Translate human text inside HTML tags (e.g., <summary>Source</summary> -> <summary>Translation</summary>).\n"
    "- NEVER modify HTML tags, attributes (href, src), or CSS styles.\n"
    "- Keep technical terms (GPU, VRAM, CLI, Docker, GEMM, PIDs, NVLink) in English.\n"
    "- Preserve all Markdown symbols (#, **, `, -, [link](url)) exactly."
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
        if ctype == "struct":
            final_output.append(ctext + "\n\n")
            continue

        # Check if the chunk is just a header (Starts with # and has no newlines)
        is_lone_header = ctext.strip().startswith('#') and "\n" not in ctext.strip()

        # Select the prompt based on context
        current_system_prompt = SYSTEM_HEADER if is_lone_header else SYSTEM_PROSE
        
        if lang_guidance and not is_lone_header:
            current_system_prompt = f"{SYSTEM_PROSE}\n\nADDITIONAL GUIDANCE:\n{lang_guidance}"

        # Logging the logic
        print(f"[{i+1}/{len(chunks)}] Mode: {'HEADER-ONLY' if is_lone_header else 'PROSE'} -> ", end="")

        response = client.chat.completions.create(
            model="aya-expanse-8b",
            messages=[
                {"role": "system", "content": current_system_prompt}, 
                {"role": "user", "content": ctext}
            ],
            temperature=0, # Keeps the model from getting 'creative'
            stream=True
        )

        translated = ""
        aborted = False

        for part in response:
            delta = part.choices[0].delta.content
            if not delta:
                continue

            translated += delta

            # Dynamic length check
            # Adjust multiplier for Japanese "Nyan" expansion
            multiplier = 5.5 if args.lang in ["ja", "hi"] else 2.5

            if len(translated) > multiplier * len(ctext):
                print(f"\n[WARN] Output too long ({len(translated)} chars) — aborting.")
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
