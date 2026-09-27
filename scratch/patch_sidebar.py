import re

with open('apps/web/src/components/dashboard-layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Mail icon import if missing
if 'Mail' not in content:
    content = content.replace("import { Home, Users", "import { Home, Users, Mail")

# Add Pesan Masuk to adminLinks
pattern = r"const adminLinks = \[\n(.*?)\n  \];"

replacement = """const adminLinks = [
\\1
    { name: 'Pesan Masuk', href: '/admin/messages', icon: Mail },
  ];"""

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('apps/web/src/components/dashboard-layout.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
