import re

# 1. Update search/page.tsx
path_search = 'apps/web/src/app/search/page.tsx'
with open(path_search, 'r', encoding='utf-8') as f:
    content_search = f.read()

search_replacement = """{kos.genderType}
                      </Badge>
                      {(kos.availableRooms && kos.availableRooms > 0) ? (
                        <Badge className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm text-white hover:bg-green-600 shadow-sm border-0 font-bold">
                          Sisa {kos.availableRooms} Kamar
                        </Badge>
                      ) : null}"""
content_search = re.sub(r'\{kos\.genderType\}\s*</Badge>', search_replacement, content_search)
with open(path_search, 'w', encoding='utf-8') as f:
    f.write(content_search)

# 2. Update page.tsx
path_home = 'apps/web/src/app/page.tsx'
with open(path_home, 'r', encoding='utf-8') as f:
    content_home = f.read()

home_replacement = """{kos.genderType}
                        </div>
                        {(kos.availableRooms && kos.availableRooms > 0) ? (
                          <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                            Sisa {kos.availableRooms} Kamar
                          </div>
                        ) : null}"""
content_home = re.sub(r'\{kos\.genderType\}\s*</div>', home_replacement, content_home)
with open(path_home, 'w', encoding='utf-8') as f:
    f.write(content_home)
