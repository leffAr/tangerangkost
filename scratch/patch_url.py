import re

with open('apps/web/src/app/admin/settings/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a state for newImageUrl
state_addition = """  const [newImageUrl, setNewImageUrl] = useState('');
"""
content = re.sub(
    r'(const \[heroSlides, setHeroSlides\] = useState<string\[\]>\(\[\]\);)',
    r'\1\n' + state_addition,
    content
)

# Add the UI for URL input
ui_replacement = """              <input 
                type="file" 
                accept="image/*" 
                ref={heroFileInputRef}
                onChange={handleHeroFileChange}
                className="hidden" 
              />
              
              <div className="mt-4 flex gap-2 items-center">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Atau masukkan Link/URL gambar secara manual (contoh: https://unsplash.com/...)"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00288E] focus:border-[#00288E] outline-none"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    if (newImageUrl.trim()) {
                      setHeroSlides([...heroSlides, newImageUrl.trim()]);
                      setNewImageUrl('');
                    }
                  }}
                  className="shrink-0"
                >
                  Tambah dari URL
                </Button>
              </div>"""

content = content.replace("""              <input 
                type="file" 
                accept="image/*" 
                ref={heroFileInputRef}
                onChange={handleHeroFileChange}
                className="hidden" 
              />""", ui_replacement)

with open('apps/web/src/app/admin/settings/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("URL Patched!")
