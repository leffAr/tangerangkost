import re

# 1. Update page.tsx
path_page = 'apps/web/src/app/page.tsx'
with open(path_page, 'r', encoding='utf-8') as f:
    content_page = f.read()

target_page = r"\) : null\}\s*</div>\s*<CardContent"
replacement_page = r") : null}\n                        <FavoriteButton kosId={kos.id} className=\"absolute bottom-3 right-3 z-20 hover:scale-110 active:scale-95\" />\n                      </div>\n                      <CardContent"
content_page = re.sub(target_page, replacement_page, content_page)

with open(path_page, 'w', encoding='utf-8') as f:
    f.write(content_page)


# 2. Update search/page.tsx
path_search = 'apps/web/src/app/search/page.tsx'
with open(path_search, 'r', encoding='utf-8') as f:
    content_search = f.read()

target_search = r"\) : null\}\s*</div>\s*<CardContent"
replacement_search = r") : null}\n                        <FavoriteButton kosId={kos.id} className=\"absolute bottom-3 right-3 z-20 hover:scale-110 active:scale-95\" />\n                      </div>\n                      <CardContent"
content_search = re.sub(target_search, replacement_search, content_search)

with open(path_search, 'w', encoding='utf-8') as f:
    f.write(content_search)
