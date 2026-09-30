import re

path_page = 'apps/web/src/app/page.tsx'
with open(path_page, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Mengapa Memilih TangerangKost?
content = content.replace(
    'Mengapa Memilih <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00288E] to-blue-500">TangerangKost?</span>',
    'Mengapa Memilih <span className="text-[#00288E]">TangerangKost?</span>'
)

# Replace Footer TangerangKost
content = content.replace(
    '<h2 className="text-3xl font-black tracking-tight text-white mb-4">Tangerang<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Kost</span></h2>',
    '<h2 className="text-3xl font-black tracking-tight text-white mb-4">TangerangKost</h2>'
)

with open(path_page, 'w', encoding='utf-8') as f:
    f.write(content)
