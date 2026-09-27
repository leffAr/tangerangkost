import re

with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'<div className="p-3 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between text-sm font-semibold text-gray-500">\s*<div className="flex items-center">\s*<Navigation className="w-4 h-4 mr-2" /> Area Kabupaten Tangerang\s*</div>\s*<button\s*onClick={handleNearestSearch}\s*disabled={isDetecting}\s*className="flex items-center text-\[#00288E\] hover:text-\[#001859\] font-bold bg-blue-50 px-3 py-1\.5 rounded-lg transition-colors"\s*>'

replacement = """<div className="p-3 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 text-sm font-semibold text-gray-500">
                    <div className="flex items-center">
                      <Navigation className="w-4 h-4 mr-2" /> Area Kabupaten Tangerang
                    </div>
                    <button 
                      onClick={handleNearestSearch}
                      disabled={isDetecting}
                      className="flex items-center w-full sm:w-auto justify-center text-[#00288E] hover:text-[#001859] font-bold bg-blue-50 px-3 py-2 sm:py-1.5 rounded-lg transition-colors"
                    >"""

if re.search(target, content):
    content = re.sub(target, replacement, content)
    with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS")
else:
    print("FAILED TO MATCH")
