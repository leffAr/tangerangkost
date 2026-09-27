import re

with open('apps/web/src/app/admin/settings/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add states
state_addition = """  const [heroSlides, setHeroSlides] = useState<string[]>([]);
  const [isSavingHero, setIsSavingHero] = useState(false);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
"""
content = re.sub(
    r'(const \[aboutImage, setAboutImage\] = useState\(\'\'\);)',
    r'\1\n' + state_addition,
    content
)

# Add fetch logic
fetch_addition = """      const resHero = await api.get('/settings/hero');
      setHeroSlides(resHero.data.slides || []);
"""
content = re.sub(
    r'(const resAbout = await api.get\(\'/settings/about\'\);\s*setAboutImage\(resAbout.data.imageUrl \|\| \'\'\);)',
    r'\1\n' + fetch_addition,
    content
)

# Add handlers
handlers_addition = """
  const handleHeroFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    setIsUploading(true);
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setHeroSlides([...heroSlides, res.data.url]);
    } catch (error) {
      alert('Gagal mengupload gambar');
    } finally {
      setIsUploading(false);
      if (heroFileInputRef.current) heroFileInputRef.current.value = '';
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHero(true);
    setMessage('');
    try {
      await api.patch('/settings/hero', { slides: heroSlides });
      setMessage('Gambar Slide Beranda berhasil diperbarui!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Gagal memperbarui gambar slide beranda.');
    } finally {
      setIsSavingHero(false);
    }
  };
"""
content = re.sub(
    r'(const handleSaveAbout = async \(e: React.FormEvent\) => \{.*?\n  \};)',
    r'\1' + handlers_addition,
    content,
    flags=re.DOTALL
)

# Add UI
ui_addition = """
      {/* Hero Slides Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Gambar Slide Awal (Beranda)</h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : (
          <form onSubmit={handleSaveHero} className="p-6 space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Atur urutan dan gambar yang akan muncul secara bergiliran pada halaman utama (Beranda).
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {heroSlides.map((slide, idx) => (
                  <div key={idx} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={slide.startsWith('http') ? slide : `http://192.168.137.1:3000${slide}`} 
                      alt={`Slide ${idx+1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setHeroSlides(heroSlides.filter((_, i) => i !== idx))}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="aspect-video bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer" onClick={() => heroFileInputRef.current?.click()}>
                  <Upload className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Tambah Slide</span>
                </div>
              </div>
              
              <input 
                type="file" 
                accept="image/*" 
                ref={heroFileInputRef}
                onChange={handleHeroFileChange}
                className="hidden" 
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Button 
                type="submit" 
                disabled={isSavingHero}
                className="bg-[#00288E] hover:bg-[#001859] text-white font-bold"
              >
                {isSavingHero ? 'Menyimpan...' : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
"""

content = content.replace('      {/* About Settings */}', ui_addition + '\n      {/* About Settings */}')

with open('apps/web/src/app/admin/settings/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched!")
