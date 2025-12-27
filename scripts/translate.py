import os
import re
import argparse
import sys
from llama_cpp import Llama

# 1. Config
LANG_MAP = {
    "de": "German", "fr": "French", "es": "Spanish", "ja": "Japanese",
    "zh": "Chinese(Simplified)", 
    "ru": "Russian", "pt": "Portuguese", "ko": "Korean", "hi": "Hindi",
    # Extended support (not in default matrix)
    "ar": "Arabic", "cs": "Czech", "nl": "Dutch", "en": "English",
    "el": "Greek", "he": "Hebrew", "id": "Indonesian", "it": "Italian",
    "fa": "Persian", "pl": "Polish", "ro": "Romanian", "tr": "Turkish",
    "uk": "Ukrainian", "vi": "Vietnamese", "zh-tw": "Chinese(Traditional)",
}

parser = argparse.ArgumentParser()
parser.add_argument("--lang", type=str, required=True)
args = parser.parse_args()
target_lang_name = LANG_MAP.get(args.lang, "English")

# Path adjustments for running from scripts/ folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
README_PATH = os.path.join(BASE_DIR, "README.md")
OUTPUT_DIR = os.path.join(BASE_DIR, "locales")
OUTPUT_PATH = os.path.join(OUTPUT_DIR, f"README.{args.lang}.md")
MODEL_PATH = os.path.join(BASE_DIR, "models", "aya-expanse-8b-Q4_K_M.gguf")

# Language-specific guidance
lang_guidance = ""
scripts_dir = os.path.dirname(os.path.abspath(__file__))
guidance_file = os.path.join(scripts_dir, f"{args.lang}.txt")

if os.path.exists(guidance_file):
    with open(guidance_file, "r", encoding="utf-8") as f:
        lang_guidance = f.read().strip()
    print(f"[INFO] Injected language-specific guidance from {guidance_file}")
else:
    print(f"[INFO] No specific guidance found for '{args.lang}', using global defaults.")

# Initialize LLM
os.makedirs(OUTPUT_DIR, exist_ok=True)
llm = Llama(model_path=MODEL_PATH, n_ctx=8192, n_threads=2, verbose=False)

# 2. Smart Chunking Functions

def get_smart_chunks(text):
    """Split README into structural elements and prose"""
    pattern = r'(' \
              r'```[\s\S]*?```|' \
              r'<div\b[^>]*>[\s\S]*?<\/div>|' \
              r'<details\b[^>]*>[\s\S]*?<\/details>|' \
              r'<section\b[^>]*>[\s\S]*?<\/section>|' \
              r'<table\b[^>]*>[\s\S]*?<\/table>|' \
              r'^#{1,6} .*' \
              r')'

    raw_parts = re.split(pattern, text, flags=re.MULTILINE | re.IGNORECASE)
    chunks = []

    for part in raw_parts:
        if not part or not part.strip():
            continue

        p = part.strip()

        # Classify as structural or prose
        if (
            p.startswith(('<div', '<details', '<section', '<table', '```')) or
            p.startswith('<!--') or p.endswith('-->') or
            re.match(r'!\[.*?\]\(.*?\)', p) or
            re.match(r'\[.*?\]\(.*?\)', p)
        ):
            chunks.append(("struct", p))
        else:
            chunks.append(("prose", p))

    return chunks


def merge_small_chunks(chunks, min_chars=400):
    """Merge small prose chunks to prevent fragmentation"""
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


# 3. Quality Control

# Forbidden phrases that indicate hallucination
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
    "Этот раздел", "В этом", "В этом разделе", "означает", "объясняет", "ниже",
    # Arabic
    "هذا القسم", "في هذا", "في هذا القسم", "يعني", "يشرح",
    # Czech
    "Tato sekce", "V tomto", "V této sekci", "znamená", "vysvětluje",
    # Dutch
    "Deze sectie", "In dit", "In deze sectie", "betekent", "verklaart",
    # Greek
    "Αυτό το τμήμα", "Σε αυτό", "Σε αυτό το τμήμα", "σημαίνει", "εξηγεί",
    # Hebrew
    "סעיף זה", "בזה", "בסעיף זה", "משמעותו", "מסביר",
    # Indonesian
    "Bagian ini", "Dalam ini", "Di bagian ini", "berarti", "menjelaskan",
    # Italian
    "Questa sezione", "In questo", "In questa sezione", "significa", "spiega",
    # Persian (Farsi)
    "این بخش", "در این", "در این بخش", "معنی می‌دهد", "توضیح می‌دهد",
    # Polish
    "Ta sekcja", "W tym", "W tej sekcji", "oznacza", "wyjaśnia",
    # Romanian
    "Această secțiune", "În acest", "În această secțiune", "înseamnă", "explică",
    # Turkish
    "Bu bölüm", "Bunda", "Bu bölümde", "anlamına gelir", "açıklar",
    # Ukrainian
    "Цей розділ", "У цьому", "У цьому розділі", "означає", "пояснює",
    # Vietnamese
    "Phần này", "Trong này", "Trong phần này", "có nghĩa là", "giải thích",
    # Traditional Chinese
    "以下", "說明", "本節", "在這裡", "意味著", "解釋",
    # Portuguese
    "Esta seção", "Nesta seção", "significa", "explica",
    # Korean
    "이 섹션", "이 안에서", "이 섹션에서는", "의미한다", "설명한다",
    # Hindi
    "यह अनुभाग", "इसमें", "इस अनुभाग में", "का अर्थ है", "समझाता है",
]

# Language-specific expansion multipliers for length validation
HIGH_MULTIPLIER_MAP = {
    "ja": 5.5,  # Japanese can expand significantly
    "hi": 5.5,  # Hindi often requires more tokens
    "ar": 4.0,  # Arabic expands moderately
    "he": 4.0,  # Hebrew
    "fa": 4.0,  # Persian (Farsi)
    "ru": 3.5,  # Russian
    "uk": 3.5,  # Ukrainian
    "pl": 3.5,  # Polish
}

# 4. Prompts

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

# 5. Translation Function

def translate_chunk(text, is_lone_header=False):
    """Translate a single chunk using llama-cpp-python"""
    # Select prompt based on context
    current_system_prompt = SYSTEM_HEADER if is_lone_header else SYSTEM_PROSE
    if lang_guidance and not is_lone_header:
        current_system_prompt = f"{SYSTEM_PROSE}\n\nADDITIONAL GUIDANCE:\n{lang_guidance}"

    # Build Aya Expanse-style prompt
    prompt = f"""<|START_OF_TURN_TOKEN|><|SYSTEM_TOKEN|>
{current_system_prompt}
<|END_OF_TURN_TOKEN|>
<|START_OF_TURN_TOKEN|><|USER_TOKEN|>
{text}<|END_OF_TURN_TOKEN|>
<|START_OF_TURN_TOKEN|><|CHATBOT_TOKEN|>"""

    response = llm(prompt, max_tokens=8192, temperature=0, stop=["<|END_OF_TURN_TOKEN|>"])
    translated = response['choices'][0]['text'].strip()

    # Cleanup: Remove markdown code fences if LLM added them
    if translated.startswith("```"):
        lines = translated.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip().startswith("```"):
            lines = lines[:-1]
        translated = "\n".join(lines).strip()

    return translated


# 6. Main Translation Pipeline

def main():
    print(f"[INFO] Starting translation to {target_lang_name} ({args.lang})")
    
    with open(README_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    chunks = merge_small_chunks(get_smart_chunks(content))
    print(f"[INFO] Processing {len(chunks)} chunks...")

    final_output = []
    multiplier = HIGH_MULTIPLIER_MAP.get(args.lang, 2.5)

    for i, (ctype, ctext) in enumerate(chunks):
        # Skip translation for structural elements
        if ctype == "struct":
            final_output.append(ctext + "\n\n")
            continue

        # Check if chunk is a lone header
        is_lone_header = ctext.strip().startswith('#') and "\n" not in ctext.strip()

        # Translate
        translated = translate_chunk(ctext, is_lone_header)

        # Quality validation: length check and forbidden phrase detection
        if len(translated) > multiplier * len(ctext) or any(f in translated for f in FORBIDDEN):
            print(f"[WARN] Chunk {i+1} failed validation, using original text")
            translated = ctext

        final_output.append(translated.rstrip() + "\n\n")

    full_text = "".join(final_output)

    # Post-processing: Fix relative paths
    # Markdown links: [text](path) -> [text](../path)
    full_text = re.sub(r'(\[.*?\]\()(?!(?:http|/|#|\.\./))', r'\1../', full_text)
    
    # HTML attributes: src="path" or href="path" -> src="../path"
    full_text = re.sub(r'((?:src|href)=["\'])(?!(?:http|/|#|\.\./))', r'\1../', full_text)

    # Write output
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(full_text)

    print(f"[SUCCESS] Translation complete: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
