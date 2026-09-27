import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'<li className="flex items-center gap-3">\s*<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-\[\#E1306C\] shrink-0">.*?TikTok</a>\s*</li>'

content = re.sub(target, '', content, flags=re.DOTALL)

with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
