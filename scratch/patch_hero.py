import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the section overflow and z-index
target1 = r'<section className="relative text-white pt-28 pb-32 px-4 overflow-hidden min-h-\[70vh\] flex flex-col justify-center">'
replacement1 = '<section className="relative text-white pt-28 pb-32 px-4 min-h-[70vh] flex flex-col justify-center z-50">'
content = re.sub(target1, replacement1, content)

# 2. Revert the Search Dropdown header to not be stacked, but keep it responsive maybe just hidden text on mobile?
# "Area Kabupaten Tangerang" is too long on mobile. We can just say "Tangerang" or hide it.
target2 = r'<div className="p-3 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 text-sm font-semibold text-gray-500">\s*<div className="flex items-center">\s*<Navigation className="w-4 h-4 mr-2" /> Area Kabupaten Tangerang\s*</div>\s*<button\s*onClick=\{handleNearestSearch\}\s*disabled=\{isDetecting\}\s*className="flex items-center w-full sm:w-auto justify-center text-\[#00288E\] hover:text-\[#001859\] font-bold bg-blue-50 px-3 py-2 sm:py-1\.5 rounded-lg transition-colors"\s*>'

replacement2 = """<div className="p-3 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between text-sm font-semibold text-gray-500">
                    <div className="flex items-center truncate mr-2">
                      <Navigation className="w-4 h-4 mr-2 shrink-0" /> <span className="hidden sm:inline">Area Kabupaten Tangerang</span><span className="sm:hidden">Tangerang</span>
                    </div>
                    <button 
                      onClick={handleNearestSearch}
                      disabled={isDetecting}
                      className="flex items-center text-[#00288E] hover:text-[#001859] font-bold bg-blue-50 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                    >"""
if re.search(target2, content):
    content = re.sub(target2, replacement2, content)
else:
    print("FAILED TO MATCH TARGET 2")

with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
