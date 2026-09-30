import re

def update_badge(filepath, is_search_page=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The current badge uses bg-green-500/90 and says "Sisa {kos.availableRooms} Kamar"
    # We will replace it with the professional design.
    
    # We will find the whole badge block:
    if is_search_page:
        pattern = r"\{\(kos\.availableRooms\s*&&\s*kos\.availableRooms\s*>\s*0\)\s*\?\s*\(\s*<Badge[^>]*>.*?Sisa\s*\{kos\.availableRooms\}\s*Kamar.*?</Badge>\s*\)\s*:\s*null\}"
        replacement = """{(kos.availableRooms && kos.availableRooms > 0) ? (
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md border border-gray-100/50 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-gray-700 shadow-sm flex items-center gap-1.5 z-10">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          Tersedia {kos.availableRooms} Kamar
                        </div>
                      ) : null}"""
    else:
        pattern = r"\{\(kos\.availableRooms\s*&&\s*kos\.availableRooms\s*>\s*0\)\s*\?\s*\(\s*<div[^>]*>.*?Sisa\s*\{kos\.availableRooms\}\s*Kamar.*?</div>\s*\)\s*:\s*null\}"
        replacement = """{(kos.availableRooms && kos.availableRooms > 0) ? (
                          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md border border-gray-100/50 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-gray-700 shadow-sm flex items-center gap-1.5 z-10">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Tersedia {kos.availableRooms} Kamar
                          </div>
                        ) : null}"""

    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

update_badge('apps/web/src/app/page.tsx', False)
update_badge('apps/web/src/app/search/page.tsx', True)
