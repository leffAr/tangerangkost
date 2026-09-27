import re

with open('apps/web/src/app/owner/kos/[id]/edit/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'const \{ data \} = await api\.get\(`/kos/\$\{kosMatch\.slug\}`\);\s*setFormData\(\{'
replacement = """const { data } = await api.get(`/kos/${kosMatch.slug}`);
          if (data.kosImages) setExistingImages(data.kosImages);
          setFormData({"""

if re.search(target, content):
    content = re.sub(target, replacement, content)
    with open('apps/web/src/app/owner/kos/[id]/edit/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS")
else:
    print("FAILED")
