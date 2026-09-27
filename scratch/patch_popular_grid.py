import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'<div className="grid grid-cols-2 md:grid-cols-4 gap-4">\s*<PopularAreasGrid />'

replacement = """<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <PopularAreasGrid />"""

if re.search(target, content):
    content = re.sub(target, replacement, content)
    with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS")
else:
    print("FAILED TO MATCH")
