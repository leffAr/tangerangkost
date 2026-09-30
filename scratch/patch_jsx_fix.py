import re

path_edit = 'apps/web/src/app/owner/kos/[id]/edit/page.tsx'
with open(path_edit, 'r', encoding='utf-8') as f:
    content_edit = f.read()

# Add the missing closing divs
content_edit = content_edit.replace(
    "<p className=\"text-xs text-gray-500 mt-2\">Jumlah ini akan langsung ditampilkan dengan pita hijau cantik di foto kos Anda.</p>\n",
    "<p className=\"text-xs text-gray-500 mt-2\">Jumlah ini akan langsung ditampilkan dengan pita hijau cantik di foto kos Anda.</p>\n                  </div>\n                </div>\n"
)

with open(path_edit, 'w', encoding='utf-8') as f:
    f.write(content_edit)
