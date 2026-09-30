import re

# 1. Update page.tsx
path_page = 'apps/web/src/app/page.tsx'
with open(path_page, 'r', encoding='utf-8') as f:
    page_content = f.read()

target_page_star = r'<span className="ml-1">4\.8</span>'
replacement_page_star = r"""<span className="ml-1">
                              {kos.reviews?.length > 0 
                                ? (kos.reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / kos.reviews.length).toFixed(1) 
                                : "Baru"}
                            </span>"""
page_content = re.sub(target_page_star, replacement_page_star, page_content)

with open(path_page, 'w', encoding='utf-8') as f:
    f.write(page_content)


# 2. Update search/page.tsx
path_search = 'apps/web/src/app/search/page.tsx'
with open(path_search, 'r', encoding='utf-8') as f:
    search_content = f.read()

search_content = re.sub(target_page_star, replacement_page_star, search_content)

with open(path_search, 'w', encoding='utf-8') as f:
    f.write(search_content)
