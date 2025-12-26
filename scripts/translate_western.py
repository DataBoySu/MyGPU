import os
import re
import argparse
from llama_cpp import Llama

# 1. Setup Maps
LANG_MAP = {
    "de": "German", "fr": "French", "es": "Spanish", "ja": "Japanese", 
    "zh": "Chinese(Simplified)", "ru": "Russian", "pt": "Portuguese", 
    "ko": "Korean", "hi": "Hindi"
}

parser = argparse.ArgumentParser()
parser.add_argument("--lang", type=str, required=True)
args = parser.parse_args()
target_lang_name = LANG_MAP.get(args.lang, "English")

# 2. Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
README_PATH = os.path.join(BASE_DIR, "README.md")
OUTPUT_PATH = os.path.join(BASE_DIR, "locales", f"README.{args.lang}.md")
MODEL_PATH = os.path.join(BASE_DIR, "models", "aya-expanse-8b-q4_k_s.gguf")

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
llm = Llama(model_path=MODEL_PATH, n_ctx=6144, n_threads=2, verbose=False)

with open(README_PATH, "r", encoding="utf-8") as f:
    original_text = f.read()

# --- PRE-PROCESSING: Universal Agnostic Protection ---
protected_blocks = []

def protect_match(match):
    placeholder = f"[[PROTECT_{len(protected_blocks)}]]"
    protected_blocks.append(match.group(0))
    return placeholder

text_to_translate = original_text

# Protect all Code Blocks (Triple Backticks)
text_to_translate = re.sub(r'(```.*?```)', protect_match, text_to_translate, flags=re.DOTALL)
# Protect all HTML tags (catches navbars, logo divs, and custom formatting)
text_to_translate = re.sub(r'(<[^>]+>)', protect_match, text_to_translate)
# Protect all Markdown Images/Badges
text_to_translate = re.sub(r'(!\[[^\]]*\]\([^\)]+\))', protect_match, text_to_translate)

# 3. Translation
prompt = f"""<|START_OF_TURN_TOKEN|><|SYSTEM_TOKEN|>
You are a technical translator. Translate the README into {target_lang_name}.
RULES:
1. **Tags**: Return any text like [[PROTECT_X]] exactly as is. Do not translate them.
2. **Context**: Preserve technical terms (GPU, VRAM, CLI, Docker) in English.
3. **Output**: ONLY the translated Markdown. No talk, no fences.<|END_OF_TURN_TOKEN|>
<|START_OF_TURN_TOKEN|><|USER_TOKEN|>
{text_to_translate}<|END_OF_TURN_TOKEN|>
<|START_OF_TURN_TOKEN|><|CHATBOT_TOKEN|>"""

response = llm(prompt, max_tokens=6144, temperature=0, stop=["<|END_OF_TURN_TOKEN|>"])
translated_content = response['choices'][0]['text'].strip()

# --- POST-PROCESSING: Robust Fuzzy Restoration ---
for i, block in enumerate(protected_blocks):
    # Regex to catch the tag even if the LLM added spaces: [[ PROTECT_0 ]]
    tag_pattern = rf"\[\s*\[\s*PROTECT_{i}\s*\]\s*\]"
    
    # Check if the tag exists. If the LLM translated it (e.g. [[ PROTÉGER_0 ]]), 
    # this fuzzy regex finds the unique index number to recover it.
    if not re.search(tag_pattern, translated_content):
        tag_pattern = rf"\[\s*\[\s*[^\]]*_{i}\s*\]\s*\]"
    
    translated_content = re.sub(tag_pattern, block, translated_content)

# 4. Path Correction (Repository Agnostic)
# Prepend ../ to links if they aren't external, absolute, or already corrected.
translated_content = re.sub(r'(\[.*?\]\()(?!(?:http|/|#|\.\./))', r'\1../', translated_content)
translated_content = re.sub(r'((?:src|href)=["\'])(?!(?:http|/|#|\.\./))', r'\1../', translated_content)

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    f.write(translated_content)