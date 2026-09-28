import re

# 1. Update search/page.tsx
path_search = 'apps/web/src/app/search/page.tsx'
with open(path_search, 'r', encoding='utf-8') as f:
    content_search = f.read()

badge_search = """                      <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#00288E] hover:bg-white shadow-sm border-0 font-bold">
                        {kos.genderType}
                      </Badge>
                      {(kos.availableRooms && kos.availableRooms > 0) ? (
                        <Badge className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm text-white hover:bg-green-600 shadow-sm border-0 font-bold">
                          Sisa {kos.availableRooms} Kamar
                        </Badge>
                      ) : null}"""

content_search = content_search.replace(
    """                      <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#00288E] hover:bg-white shadow-sm border-0 font-bold">
                        {kos.genderType}
                      </Badge>""",
    badge_search
)
with open(path_search, 'w', encoding='utf-8') as f:
    f.write(content_search)

# 2. Update page.tsx
path_home = 'apps/web/src/app/page.tsx'
with open(path_home, 'r', encoding='utf-8') as f:
    content_home = f.read()

badge_home = """                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#00288E] shadow-sm uppercase">
                          {kos.genderType}
                        </div>
                        {(kos.availableRooms && kos.availableRooms > 0) ? (
                          <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                            Sisa {kos.availableRooms} Kamar
                          </div>
                        ) : null}"""

content_home = content_home.replace(
    """                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#00288E] shadow-sm uppercase">
                          {kos.genderType}
                        </div>""",
    badge_home
)
with open(path_home, 'w', encoding='utf-8') as f:
    f.write(content_home)
