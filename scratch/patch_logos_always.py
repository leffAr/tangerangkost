import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# For the first column (Brand column)
content = re.sub(r'\{contactSettings\?\.instagram && \(\s*(.*?)\s*\)\}', r'\1', content, flags=re.DOTALL)
content = re.sub(r'\{contactSettings\?\.tiktok && \(\s*(.*?)\s*\)\}', r'\1', content, flags=re.DOTALL)
content = re.sub(r'\{contactSettings\?\.whatsapp && \(\s*(.*?)\s*\)\}', r'\1', content, flags=re.DOTALL)

# Let's fix the href to default to '#' if not present
content = re.sub(r'href=\{contactSettings\.instagram\}', r'href={contactSettings?.instagram || "#"}', content)
content = re.sub(r'href=\{contactSettings\.tiktok\}', r'href={contactSettings?.tiktok || "#"}', content)

with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
