import re

path_edit = 'apps/web/src/app/owner/kos/[id]/edit/page.tsx'
with open(path_edit, 'r', encoding='utf-8') as f:
    content_edit = f.read()

# Make sure it didn't already get injected partially (state is probably there already, but let's check)
if 'availableRooms: 0' not in content_edit:
    content_edit = content_edit.replace(
        "whatsapp: '',",
        "whatsapp: '',\n    availableRooms: 0,"
    )
    content_edit = content_edit.replace(
        "whatsapp: data.whatsapp || '',",
        "whatsapp: data.whatsapp || '',\n          availableRooms: data.availableRooms || 0,"
    )

old_html = """                </div>
              </div>
            </CardContent>
          </Card>"""

new_html = """                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-semibold text-[#00288E] mb-2">Total Kamar Kosong (Ready)</label>
                    <input type="number" min="0" required className="w-full border-2 border-green-200 bg-green-50 p-3 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" placeholder="Contoh: 5" value={formData.availableRooms} onChange={e => setFormData({...formData, availableRooms: parseInt(e.target.value) || 0})} />
                    <p className="text-xs text-gray-500 mt-2">Jumlah ini akan ditampilkan di kartu kos agar pencari kos tahu sisa kamar.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>"""

content_edit = content_edit.replace(old_html, new_html)

with open(path_edit, 'w', encoding='utf-8') as f:
    f.write(content_edit)
