import re

# 1. Fix search/page.tsx missing import
path_search = 'apps/web/src/app/search/page.tsx'
with open(path_search, 'r', encoding='utf-8') as f:
    content_search = f.read()

if "import { FavoriteButton }" not in content_search:
    # Let's just insert it after the first import
    content_search = re.sub(r"(import .*?;)", r"\1\nimport { FavoriteButton } from '@/components/kos/FavoriteButton';", content_search, count=1)

with open(path_search, 'w', encoding='utf-8') as f:
    f.write(content_search)

# 2. Fix favorites/page.tsx invalid import
path_fav = 'apps/web/src/app/user/favorites/page.tsx'
with open(path_fav, 'r', encoding='utf-8') as f:
    content_fav = f.read()

content_fav = content_fav.replace("import { useAuth } from '@/hooks/useAuth';", "")

with open(path_fav, 'w', encoding='utf-8') as f:
    f.write(content_fav)
