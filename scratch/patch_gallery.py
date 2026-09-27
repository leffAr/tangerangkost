import re

with open('apps/web/src/app/kos/[slug]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_str = '<div className="grid grid-cols-1 md:grid-cols-4 gap-2'
end_str = '{/* Main Content Layout */}'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_block = """{/* Desktop Image Gallery */}
        <div className="hidden md:grid grid-cols-4 gap-2 h-[450px] rounded-3xl overflow-hidden mb-12 shadow-lg border border-gray-100 relative">
          {mainImage ? (
            <div 
              className="col-span-3 h-full relative group cursor-pointer overflow-hidden bg-gray-100"
              onClick={() => setActiveImage(mainImage)}
            >
              <img src={`http://192.168.137.1:3000${mainImage}`} alt="Foto Utama" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg transition-opacity flex items-center gap-2">
                  <Search className="w-4 h-4" /> Perbesar HD
                </span>
              </div>
            </div>
          ) : (
            <div className="col-span-4 h-full bg-gray-200 flex items-center justify-center text-gray-400">Tidak ada foto</div>
          )}
          
          {mainImage && (
            <div className="flex flex-col gap-2 h-full">
              {otherImages.map((img: any, idx: number) => (
                <div 
                  key={img.id} 
                  className="h-1/2 relative group cursor-pointer overflow-hidden bg-gray-100"
                  onClick={() => setActiveImage(img.url)}
                >
                  <img src={`http://192.168.137.1:3000${img.url}`} alt={`Foto ${idx+2}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
              ))}
              {otherImages.length < 2 && (
                <div className="h-1/2 bg-gray-100 flex items-center justify-center border border-gray-200">
                  <span className="text-sm text-gray-400">Belum ada foto lain</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Image Gallery (Swipeable) */}
        <div className="md:hidden flex gap-2 h-[250px] overflow-x-auto snap-x snap-mandatory mb-8 rounded-2xl shadow-sm" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {allImages.length > 0 ? (
            allImages.map((img: any, idx: number) => (
              <div 
                key={img.id} 
                className="flex-none w-[85%] h-full snap-center relative overflow-hidden rounded-xl bg-gray-100 cursor-pointer"
                onClick={() => setActiveImage(img.url)}
              >
                <img src={`http://192.168.137.1:3000${img.url}`} alt={`Foto ${idx+1}`} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md font-medium">
                  {idx + 1} / {allImages.length}
                </div>
              </div>
            ))
          ) : (
            <div className="flex-none w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 rounded-xl">Tidak ada foto</div>
          )}
        </div>
        
        """
    
    content = content[:start_idx] + new_block + content[end_idx:]
    with open('apps/web/src/app/kos/[slug]/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS")
else:
    print("FAILED TO FIND INDICES")
