import os
import re
import argparse
from llama_cpp import Llama

LANG_MAP = {
    "de": "German", 
    "fr": "French", 
    "es": "Spanish",
    "ja": "Japanese", 
    "zh": "Chinese(Simplified)",
    "ru": "Russian", 
    "pt": "Portuguese", 
    "ko": "Korean",
}

parser = argparse.ArgumentParser()
parser.add_argument("--lang", type=str, required=True)
args = parser.parse_args()
target_lang_name = LANG_MAP.get(args.lang, "English")

# Path Configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
README_PATH = os.path.join(BASE_DIR, "README.md")
OUTPUT_DIR = os.path.join(BASE_DIR, "locales")
OUTPUT_PATH = os.path.join(OUTPUT_DIR, f"README.{args.lang}.md")
MODEL_PATH = os.path.join(BASE_DIR, "models", "aya-expanse-8b-q4_k_s.gguf")

os.makedirs(OUTPUT_DIR, exist_ok=True)
llm = Llama(model_path=MODEL_PATH, n_ctx=6144, n_threads=2, verbose=False)

with open(README_PATH, "r", encoding="utf-8") as f:
    original_text = f.read()

# --- PRE-PROCESSING: Protect Sensitive Blocks ---
# We replace complex blocks with placeholders so the LLM cannot mangle them.
protected_blocks = []

def protect_match(match):
    placeholder = f"[PROTECTED_BLOCK_{len(protected_blocks)}]"
    protected_blocks.append(match.group(0))
    return placeholder

text_to_translate = original_text

# 1. Protect Navigation Bar (<div align="center">...</div>)
text_to_translate = re.sub(r'(<div align="center">.*?</div>)', protect_match, text_to_translate, flags=re.DOTALL)
# 2. Protect Logo Block (<div style="text-align:center...>)
text_to_translate = re.sub(r'(<div style="text-align:center; margin:18px 0;">.*?</div>)', protect_match, text_to_translate, flags=re.DOTALL)
# 3. Protect Badges (![...](https://img.shields.io/...)) - Prevents URL translation
text_to_translate = re.sub(r'(!\[.*?\]\(https://img\.shields\.io/.*?\))', protect_match, text_to_translate)

# Refined Prompt for CJK and Technical Nuance
prompt = f"""<|START_OF_TURN_TOKEN|><|SYSTEM_TOKEN|>
You are a professional technical translator. Translate this GitHub README into {target_lang_name}.
CRITICAL RULES:
1. **Badges**: Do NOT translate text inside `![...]` or `(...)` for image badges.
2. **Standard Terms**: Keep terms like GPU, VRAM, CLI, API, CUDA, and Docker in English.
3. **Context**: 
   - 'Enforcement' = Policy restriction/application (JA: 制限/強制, ZH: 强制执行).
   - 'Headless' = Servers without a display (JA: ヘッドレス, ZH: 无头).
   - 'Agnostic' = Independence (JA: 非依存, ZH: 无关性).
4. **Placeholders**: Return any text like '[PROTECTED_BLOCK_X]' exactly as is.
5. **Output**: ONLY the translation. No conversational filler.<|END_OF_TURN_TOKEN|>
<|START_OF_TURN_TOKEN|><|USER_TOKEN|>
{text_to_translate}<|END_OF_TURN_TOKEN|>
<|START_OF_TURN_TOKEN|><|CHATBOT_TOKEN|>"""

response = llm(prompt, max_tokens=6144, temperature=0, stop=["<|END_OF_TURN_TOKEN|>"])
translated_content = response['choices'][0]['text'].strip()

# --- POST-PROCESSING ---

# 1. Restore Protected Blocks
for i, block in enumerate(protected_blocks):
    translated_content = translated_content.replace(f"[PROTECTED_BLOCK_{i}]", block)

# 2. Path Correction (Support single and double quotes)
translated_content = re.sub(r'(\[.*?\]\()(?!(?:http|/|#|\.\./|locales/))', r'\1../', translated_content)
translated_content = re.sub(r'((?:src|href)=["\'])(?!(?:http|/|#|\.\./|locales/))', r'\1../', translated_content)
translated_content = re.sub(r'(\[.*?\]\()locales/', r'\1', translated_content)
translated_content = re.sub(r'((?:src|href)=["\'])locales/', r'\1', translated_content)

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    f.write(translated_content)