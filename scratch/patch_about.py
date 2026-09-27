import re

with open('apps/web/src/app/about/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'<div className="absolute -right-6 top-1/4 bg-white p-4 rounded-2xl shadow-xl z-20 hidden md:flex items-center gap-4 border border-gray-100 animate-in zoom-in duration-1000 delay-300">'

replacement = '<div className="absolute right-4 -bottom-6 md:right-auto md:-right-6 md:top-1/4 md:-bottom-auto bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl z-20 flex items-center gap-3 md:gap-4 border border-gray-100 animate-in zoom-in duration-1000 delay-300 scale-90 md:scale-100 origin-bottom-right md:origin-center">'

if re.search(target, content):
    content = re.sub(target, replacement, content)
    with open('apps/web/src/app/about/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS")
else:
    print("FAILED TO MATCH")
