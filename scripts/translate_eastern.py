import os
import re
import argparse
from llama_cpp import Llama

LANG_MAP = {
    "ja": "Japanese", 
    "zh": "Chinese(Simplified)",
    "ko": "Korean",
    "hi": "Hindi",
}

parser = argparse.ArgumentParser()
parser.add_argument("--lang", type=str, required=True)
args = parser.parse_args()
target_lang_name = LANG_MAP.get(args.lang, "English")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
README_PATH = os.path.join(BASE_DIR, "README.md")
OUTPUT_DIR = os.path.join(BASE_DIR, "locales")
OUTPUT_PATH = os.path.join(OUTPUT_DIR, f"README.{args.lang}.md")
MODEL_PATH = os.path.join(BASE_DIR, "models", "aya-expanse-8b-q4_k_s.gguf")

os.makedirs(OUTPUT_DIR, exist_ok=True)
llm = Llama(model_path=MODEL_PATH, n_ctx=6144, n_threads=2, verbose=False)

with open(README_PATH, "r", encoding="utf-8") as f:
    original_text = f.read()

# --- PRE-PROCESSING ---
protected_blocks = []

def protect_match(match):
    placeholder = f"__PB_{len(protected_blocks)}__" 
    protected_blocks.append(match.group(0))
    return placeholder

text_to_translate = original_text

# 1. Protect Navigation Bar (Whole Block)
text_to_translate = re.sub(r'(<div\s+align=["\']center["\']\s*>.*?</div>)', protect_match, text_to_translate, flags=re.DOTALL | re.IGNORECASE)
# 2. Protect Logo (Whole Block)
text_to_translate = re.sub(r'(<div\s+style=["\'][^"]*text-align:center[^"]*["\']\s*>.*?</div>)', protect_match, text_to_translate, flags=re.DOTALL | re.IGNORECASE)
# 3. Protect Markdown Images (Badges, Screenshots)
text_to_translate = re.sub(r'(!\[[^\]\r\n]*\]\([^)\r\n]+\))', protect_match, text_to_translate)
# 4. Protect HTML Tags (Preserves Gallery structure <details>, <summary>, <img> but exposes text)
text_to_translate = re.sub(r'(<[^>]+>)', protect_match, text_to_translate)

# Specialized Prompt for CJK/Eastern Languages
prompt = f"""<|START_OF_TURN_TOKEN|><|SYSTEM_TOKEN|>
You are a professional technical {target_lang_name} translator. Translate the provided GitHub README into {target_lang_name}.

CRITICAL RULES:
1. **Placeholders**: You will see tags like __PB_0__, __PB_1__. 
   - DO NOT translate them.
   - DO NOT remove them.
   - DO NOT convert underscores (_) to full-width characters. Keep them as it is.
2. **Formatting**: Preserve all Markdown structure exactly.
3. **Terminology**: Keep English technical terms (GPU, CLI, VRAM, Docker, CUDA) in English.
4. **Context**: 
   - 'Enforcement' = Policy restriction (e.g., JA: 制限/強制).
   - 'Headless' = Server without display.
5. **Output**: ONLY the translated text. No explanations.
<|END_OF_TURN_TOKEN|>
<|START_OF_TURN_TOKEN|><|USER_TOKEN|>
{text_to_translate}<|END_OF_TURN_TOKEN|>
<|START_OF_TURN_TOKEN|><|CHATBOT_TOKEN|>"""

response = llm(prompt, max_tokens=6144, temperature=0, stop=["<|END_OF_TURN_TOKEN|>"])
translated_content = response['choices'][0]['text'].strip()

# --- POST-PROCESSING: Chain Restoration ---

for i, block in enumerate(protected_blocks):
    placeholder = f"__PB_{i}__"
    
    # 1. Direct replacement
    if placeholder in translated_content:
        translated_content = translated_content.replace(placeholder, block)
        continue
    
    # 2. Loose Regex Fallback (Handles CJK full-width issues like ＿PB＿0＿)
    # Matches __PB_0__, ＿PB_0＿, [PB_0], etc.
    loose_pattern = re.compile(rf"[\[［]?\s*[__＿]+\s*PB_{i}\s*[__＿]+\s*[\]］]?", re.IGNORECASE)
    if loose_pattern.search(translated_content):
        translated_content = loose_pattern.sub(lambda m: block, translated_content)
        continue

    # 3. CRITICAL FALLBACK: Chain Insertion
    if i == 0: 
        translated_content = block + "\n\n" + translated_content
    else:
        prev_block = protected_blocks[i-1]
        if prev_block in translated_content:
            # Insert current block immediately after the previous one
            translated_content = translated_content.replace(prev_block, prev_block + "\n" + block, 1)
        else:
            translated_content = block + "\n\n" + translated_content

# 4. Path Correction
# Prepend ../ to relative paths
translated_content = re.sub(r'(\[.*?\]\()(?!(?:http|/|#|\.\./))', r'\1../', translated_content)
translated_content = re.sub(r'((?:src|href)=["\'])(?!(?:http|/|#|\.\./))', r'\1../', translated_content)

# 5. Cleanup
translated_content = re.sub(r'^<!--\s*|(?:\s*)?-->$', '', translated_content).strip()
if translated_content.startswith("```"):
    lines = translated_content.splitlines()
    if lines[0].startswith("```"): lines = lines[1:]
    if lines and lines[-1].strip().startswith("```"): lines = lines[:-1]
    translated_content = "\n".join(lines).strip()

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    f.write(translated_content)