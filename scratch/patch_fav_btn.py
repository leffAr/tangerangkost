import re

# 1. Update page.tsx
path_page = 'apps/web/src/app/page.tsx'
with open(path_page, 'r', encoding='utf-8') as f:
    content_page = f.read()

# Add import if missing
if 'FavoriteButton' not in content_page:
    content_page = content_page.replace(
        "import { Button } from '@/components/ui/button';",
        "import { Button } from '@/components/ui/button';\nimport { FavoriteButton } from '@/components/kos/FavoriteButton';"
    )

# Inject FavoriteButton inside the aspect-[4/3] container
# Let's put it right before the closing div of the image container
target_page = r"(<div className=\"absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent\"></div>)"
replacement_page = r"\1\n                        <FavoriteButton kosId={kos.id} className=\"absolute bottom-3 right-3 z-20 hover:scale-110 active:scale-95\" />"
content_page = re.sub(target_page, replacement_page, content_page)

with open(path_page, 'w', encoding='utf-8') as f:
    f.write(content_page)


# 2. Update search/page.tsx
path_search = 'apps/web/src/app/search/page.tsx'
with open(path_search, 'r', encoding='utf-8') as f:
    content_search = f.read()

if 'FavoriteButton' not in content_search:
    content_search = content_search.replace(
        "import { Button } from '@/components/ui/button';",
        "import { Button } from '@/components/ui/button';\nimport { FavoriteButton } from '@/components/kos/FavoriteButton';"
    )

target_search = r"(<div className=\"absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent\"></div>)"
replacement_search = r"\1\n                      <FavoriteButton kosId={kos.id} className=\"absolute bottom-3 right-3 z-20 hover:scale-110 active:scale-95\" />"
content_search = re.sub(target_search, replacement_search, content_search)

with open(path_search, 'w', encoding='utf-8') as f:
    f.write(content_search)
