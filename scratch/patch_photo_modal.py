import re

path = 'apps/web/src/app/owner/kos/[id]/edit/page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add AlertTriangle to lucide-react imports
content = content.replace(
    "CheckSquare, Square, X, ArrowLeft } from 'lucide-react';",
    "CheckSquare, Square, X, ArrowLeft, AlertTriangle } from 'lucide-react';"
)

# 2. Add state
content = content.replace(
    "const [existingImages, setExistingImages] = useState<any[]>([]);",
    "const [existingImages, setExistingImages] = useState<any[]>([]);\n  const [imageToDelete, setImageToDelete] = useState<string | null>(null);"
)

# 3. Replace handleDeleteExistingImage
old_handler = """  const handleDeleteExistingImage = async (imageId: string) => {
    if (!confirm('Hapus foto ini?')) return;
    try {
      await api.post(`/kos/${id}/images/${imageId}/delete`);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Foto berhasil dihapus!');
    } catch (error) {
      toast.error('Gagal menghapus foto');
    }
  };"""

new_handler = """  const confirmDeleteImage = async () => {
    if (!imageToDelete) return;
    try {
      await api.post(`/kos/${id}/images/${imageToDelete}/delete`);
      setExistingImages(prev => prev.filter(img => img.id !== imageToDelete));
      toast.success('Foto berhasil dihapus!');
      setImageToDelete(null);
    } catch (error) {
      toast.error('Gagal menghapus foto');
      setImageToDelete(null);
    }
  };"""

content = content.replace(old_handler, new_handler)

# 4. Change button onClick to set state
content = content.replace(
    "handleDeleteExistingImage(img.id);",
    "setImageToDelete(img.id);"
)

# 5. Add Modal before the last </div>
modal_ui = """
      {/* Delete Image Modal */}
      {imageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Foto?</h3>
              <p className="text-sm text-gray-500">
                Tindakan ini tidak dapat dibatalkan. Foto akan dihapus secara permanen dari galeri kos Anda.
              </p>
            </div>
            <div className="flex border-t border-gray-100">
              <button
                type="button"
                onClick={() => setImageToDelete(null)}
                className="flex-1 py-4 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors border-r border-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteImage}
                className="flex-1 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>"""

# Safely replace the last </div> by splitting
parts = content.rsplit('</div>', 1)
content = modal_ui.join(parts)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
