import os
import re

directory = 'apps/web/src'

# The regex matches expressions like:
# src={kos.kosImages[0].url.startsWith('http') ? kos.kosImages[0].url : `https://tangerangkost.onrender.com${kos.kosImages[0].url}`}
# and also area.imageUrl
pattern1 = r"src=\{([a-zA-Z0-9_\[\]\.\?]+)\.startsWith\('http'\)\s*\?\s*\1\s*:\s*`https://tangerangkost\.onrender\.com\$\{\1\}`\}"
# Wait, some places use startsWith('/') ? \`...\` : ...
pattern2 = r"src=\{([a-zA-Z0-9_\[\]\.\?]+)\.startsWith\('/'\)\s*\?\s*`https://tangerangkost\.onrender\.com\$\{\1\}`\s*:\s*\1\}"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    content = re.sub(pattern1, r"src={getImageUrl(\1)}", content)
    content = re.sub(pattern2, r"src={getImageUrl(\1)}", content)

    if content != original:
        # Add import
        if "import { getImageUrl }" not in content:
            # Insert after the first import or at the top
            if "import " in content:
                content = re.sub(r"(import .*?;|import .*?\n)", r"\1\nimport { getImageUrl } from '@/lib/image';\n", content, count=1)
            else:
                content = "import { getImageUrl } from '@/lib/image';\n" + content
                
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched: {filepath}")

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
