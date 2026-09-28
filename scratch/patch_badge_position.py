import re

path = 'apps/web/src/app/about/page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_classes = 'absolute right-4 -bottom-6 md:right-auto md:-right-6 md:top-1/4 md:-bottom-auto bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl z-20 flex items-center gap-3 md:gap-4 border border-gray-100 animate-in zoom-in duration-1000 delay-300 scale-90 md:scale-75 origin-bottom-right md:origin-right'
new_classes = 'absolute right-2 -bottom-6 md:-right-6 md:-bottom-6 bg-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-2xl z-20 flex items-center gap-4 border border-gray-100 animate-in zoom-in duration-1000 delay-300 scale-90 md:scale-100 origin-bottom-right'

content = content.replace(old_classes, new_classes)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
