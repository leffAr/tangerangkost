import re

with open('apps/web/src/app/owner/kos/[id]/edit/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# First, add a state for existing images. We need to parse kos.kosImages in useEffect.
# Wait, `kos` is loaded via `api.get('/kos/owner/${id}')`. But wait, does the endpoint return `kosImages`?
# In apps/web/src/app/owner/kos/[id]/edit/page.tsx, there's useEffect.
target1 = r'const \[files, setFiles\] = useState<File\[\]>\(\[\]\);'
replacement1 = """const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);"""
content = re.sub(target1, replacement1, content)

# In useEffect
target2 = r'setFormData\({\s*name: res\.data\.name,'
replacement2 = """if (res.data.kosImages) setExistingImages(res.data.kosImages);
        setFormData({
          name: res.data.name,"""
content = re.sub(target2, replacement2, content)

# Also need to add handleDeleteExistingImage
target3 = r'const handleSubmit = async \(e: React\.FormEvent\) => {'
replacement3 = """const handleDeleteExistingImage = async (imageId: string) => {
    if (!confirm('Hapus foto ini?')) return;
    try {
      await api.post(`/kos/${id}/images/${imageId}/delete`);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Foto berhasil dihapus!');
    } catch (error) {
      toast.error('Gagal menghapus foto');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {"""
content = re.sub(target3, replacement3, content)

# Now in the JSX, we render existing images
target4 = r'\{files\.length > 0 && \('
replacement4 = """{existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Foto Saat Ini (Tersimpan):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {existingImages.map((img) => (
                        <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-sm group bg-gray-50">
                          <img src={`http://192.168.137.1:3000${img.url}`} alt="Kos" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={(e) => { 
                              e.preventDefault(); 
                              handleDeleteExistingImage(img.id);
                            }} 
                            className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white text-gray-700 p-1.5 rounded-full transition-colors shadow-sm"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
  
                {files.length > 0 && ("""
content = re.sub(target4, replacement4, content)

with open('apps/web/src/app/owner/kos/[id]/edit/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
