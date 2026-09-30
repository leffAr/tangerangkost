import re
import os

files_to_fix = [
    'apps/web/src/app/page.tsx',
    'apps/web/src/app/search/page.tsx',
    'apps/web/src/app/kos/[slug]/page.tsx',
    'apps/web/src/app/owner/kos/[id]/edit/page.tsx'
]

# Patterns to match:
# src={`https://tangerangkost.onrender.com${kos.kosImages[0].url}`}
# src={`https://tangerangkost.onrender.com${activeImage}`}
# src={`https://tangerangkost.onrender.com${mainImage}`}
# src={`https://tangerangkost.onrender.com${img.url}`}

for filepath in files_to_fix:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match anything like `https://tangerangkost.onrender.com${variable}` inside src={...}
    # We want to replace src={`https://tangerangkost.onrender.com${VAR}`} with src={VAR.startsWith('http') ? VAR : `https://tangerangkost.onrender.com${VAR}`}
    
    def replacer(match):
        var_name = match.group(1)
        return f"{{{var_name}.startsWith('http') ? {var_name} : `https://tangerangkost.onrender.com${{{var_name}}}`}}"

    content = re.sub(r'\{`https://tangerangkost\.onrender\.com\$\{([^}]+)\}`\}', replacer, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
