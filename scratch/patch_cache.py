import os

def force_dynamic(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "export const dynamic = 'force-dynamic';" not in content:
        # Add it right after the imports
        parts = content.split('\n\n', 1)
        if len(parts) == 2:
            new_content = parts[0] + "\n\nexport const dynamic = 'force-dynamic';\n\n" + parts[1]
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)

force_dynamic('apps/web/src/app/page.tsx')
force_dynamic('apps/web/src/app/search/page.tsx')
