import re

path_edit = 'apps/web/src/app/owner/kos/[id]/edit/page.tsx'
with open(path_edit, 'r', encoding='utf-8') as f:
    content_edit = f.read()

# State
content_edit = content_edit.replace(
    "whatsapp: '',",
    "whatsapp: '',\n    availableRooms: 0,"
)
content_edit = content_edit.replace(
    "whatsapp: data.whatsapp || '',",
    "whatsapp: data.whatsapp || '',\n          availableRooms: data.availableRooms || 0,"
)

new_ui = """              <div className="pt-6 border-t border-gray-100 mt-6">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-semibold text-[#00288E] mb-2">Total Kamar Kosong (Ready)</label>
                  <input type="number" min="0" required className="w-full border-2 border-green-200 bg-green-50 p-3 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-bold text-lg" placeholder="Contoh: 5" value={formData.availableRooms} onChange={e => setFormData({...formData, availableRooms: parseInt(e.target.value) || 0})} />
                  <p className="text-xs text-gray-500 mt-2">Jumlah ini akan langsung ditampilkan dengan pita hijau cantik di foto kos Anda.</p>
                </div>
              </div>
            </CardContent>"""

content_edit = content_edit.replace("            </CardContent>", new_ui, 1)

with open(path_edit, 'w', encoding='utf-8') as f:
    f.write(content_edit)
