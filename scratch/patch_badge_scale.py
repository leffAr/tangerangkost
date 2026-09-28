import re

path = 'apps/web/src/app/about/page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the classes for the floating badge to make it much smaller on PC (md:scale-75)
old_classes = 'absolute right-4 -bottom-6 md:right-auto md:-right-6 md:top-1/4 md:-bottom-auto bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl z-20 flex items-center gap-3 md:gap-4 border border-gray-100 animate-in zoom-in duration-1000 delay-300 scale-90 md:scale-100 origin-bottom-right md:origin-center'
new_classes = 'absolute right-4 -bottom-6 md:right-auto md:-right-6 md:top-1/4 md:-bottom-auto bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl z-20 flex items-center gap-3 md:gap-4 border border-gray-100 animate-in zoom-in duration-1000 delay-300 scale-90 md:scale-75 origin-bottom-right md:origin-right'

content = content.replace(old_classes, new_classes)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
