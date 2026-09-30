import re

# 1. Update backend kos.service.ts
path_kos_service = 'apps/api/src/kos/kos.service.ts'
with open(path_kos_service, 'r', encoding='utf-8') as f:
    service_content = f.read()

# Add reviews to findMany
target_many = r"include: \{\s*kosImages: \{ orderBy: \{ order: 'asc' \} \},\s*owner: \{ include: \{ user: \{ select: \{ name: true, phone: true \} \} \} \}\s*\}"
replacement_many = """include: {
        kosImages: { orderBy: { order: 'asc' } },
        owner: { include: { user: { select: { name: true, phone: true } } } },
        reviews: { select: { rating: true } }
      }"""
service_content = re.sub(target_many, replacement_many, service_content)

# Add reviews to findOne
target_one = r"include: \{\s*kosImages: true,\s*rooms: true,\s*facilities: true,\s*owner: \{ include: \{ user: \{ select: \{ name: true, phone: true \} \} \} \}\s*\}"
replacement_one = """include: {
        kosImages: { orderBy: { order: 'asc' } },
        rooms: true,
        facilities: true,
        owner: { include: { user: { select: { name: true, phone: true } } } },
        reviews: { select: { rating: true } }
      }"""
service_content = re.sub(target_one, replacement_one, service_content)

with open(path_kos_service, 'w', encoding='utf-8') as f:
    f.write(service_content)


# 2. Update frontend page.tsx
path_page = 'apps/web/src/app/page.tsx'
with open(path_page, 'r', encoding='utf-8') as f:
    page_content = f.read()

# Replace hardcoded 4.8 star with dynamic
# <span className="font-bold text-gray-900">4.8</span>
target_page_star = r'<span className="font-bold text-gray-900">4\.8</span>'
replacement_page_star = r"""<span className="font-bold text-gray-900">
                      {kos.reviews?.length > 0 
                        ? (kos.reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / kos.reviews.length).toFixed(1) 
                        : "Baru"}
                    </span>"""
page_content = re.sub(target_page_star, replacement_page_star, page_content)

with open(path_page, 'w', encoding='utf-8') as f:
    f.write(page_content)


# 3. Update search/page.tsx
path_search = 'apps/web/src/app/search/page.tsx'
with open(path_search, 'r', encoding='utf-8') as f:
    search_content = f.read()

search_content = re.sub(target_page_star, replacement_page_star, search_content)

with open(path_search, 'w', encoding='utf-8') as f:
    f.write(search_content)


# 4. Update kos/[slug]/page.tsx
path_detail = 'apps/web/src/app/kos/[slug]/page.tsx'
with open(path_detail, 'r', encoding='utf-8') as f:
    detail_content = f.read()

target_detail_star = r"4\.8 <span className=\"text-gray-400 ml-1 underline decoration-dotted\">\(\{reviews\?\.length \|\| 0\} \nUlasan\)</span"
replacement_detail_star = r"""{kos.reviews?.length > 0 ? (kos.reviews.reduce((a: number, c: any) => a + c.rating, 0) / kos.reviews.length).toFixed(1) : "Baru"} <span className="text-gray-400 ml-1 underline decoration-dotted">({reviews?.length || 0} \nUlasan)</span"""
# We must be careful with regex due to newlines
detail_content = re.sub(r"4\.8 <span className=\"text-gray-400 ml-1 underline decoration-dotted\">\(\{reviews\?\.length \|\| 0\}\s*Ulasan\)</span>", r"""{kos.reviews?.length > 0 ? (kos.reviews.reduce((a: number, c: any) => a + c.rating, 0) / kos.reviews.length).toFixed(1) : "Baru"} <span className="text-gray-400 ml-1 underline decoration-dotted">({reviews?.length || 0} Ulasan)</span>""", detail_content)

with open(path_detail, 'w', encoding='utf-8') as f:
    f.write(detail_content)
