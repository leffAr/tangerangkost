import re

path_page = 'apps/web/src/app/page.tsx'
with open(path_page, 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace(r'className=\"absolute bottom-3 right-3 z-20 hover:scale-110 active:scale-95\"', 'className="absolute bottom-3 right-3 z-20 hover:scale-110 active:scale-95"')
with open(path_page, 'w', encoding='utf-8') as f:
    f.write(content)

path_search = 'apps/web/src/app/search/page.tsx'
with open(path_search, 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace(r'className=\"absolute bottom-3 right-3 z-20 hover:scale-110 active:scale-95\"', 'className="absolute bottom-3 right-3 z-20 hover:scale-110 active:scale-95"')
with open(path_search, 'w', encoding='utf-8') as f:
    f.write(content)
