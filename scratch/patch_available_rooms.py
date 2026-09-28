import re

# 1. Update CreateKosDto
path_dto = 'apps/api/src/kos/dto/create-kos.dto.ts'
with open(path_dto, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "@ApiPropertyOptional() @IsString() @IsOptional() whatsapp?: string;",
    "@ApiPropertyOptional() @IsString() @IsOptional() whatsapp?: string;\n\n  @ApiPropertyOptional() @IsNumber() @IsOptional() availableRooms?: number;"
)
with open(path_dto, 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update frontend edit page
path_edit = 'apps/web/src/app/owner/kos/[id]/edit/page.tsx'
with open(path_edit, 'r', encoding='utf-8') as f:
    content_edit = f.read()

# Add to state
content_edit = content_edit.replace(
    "whatsapp: '',",
    "whatsapp: '',\n    availableRooms: 0,"
)

# Add to loadKos
content_edit = content_edit.replace(
    "whatsapp: data.whatsapp || '',",
    "whatsapp: data.whatsapp || '',\n          availableRooms: data.availableRooms || 0,"
)

# Add Input UI
ui_to_add = """
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Total Pintu / Kamar yang Ready (Kosong)</label>
                <input type="number" min="0" required className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] outline-none transition-all" placeholder="Contoh: 5" value={formData.availableRooms} onChange={e => setFormData({...formData, availableRooms: parseInt(e.target.value) || 0})} />
                <p className="text-xs text-gray-500 mt-1">Jumlah ini akan ditampilkan di kartu kos agar pencari kos tahu sisa kamar.</p>
              </div>
            </div>"""

content_edit = content_edit.replace(
    "<div>\n              <label className=\"block text-sm font-semibold text-gray-700 mb-2\">Alamat Lengkap</label>",
    ui_to_add + "\n\n            <div>\n              <label className=\"block text-sm font-semibold text-gray-700 mb-2\">Alamat Lengkap</label>"
)

with open(path_edit, 'w', encoding='utf-8') as f:
    f.write(content_edit)

# 3. Update frontend kos card to show the badge
# Let's write a script to patch KosCard component
