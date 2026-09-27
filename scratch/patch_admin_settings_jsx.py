import re

with open('apps/web/src/app/admin/settings/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'></textarea>\s*</div>\s*<div className="pt-4 border-t border-gray-100 flex justify-end">'

replacement = """></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-pink-600 font-bold">IG</span> Link Instagram
                </label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/tangerangkost"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00288E] focus:border-[#00288E] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-black font-bold">TT</span> Link TikTok
                </label>
                <input
                  type="url"
                  value={tiktok}
                  onChange={(e) => setTiktok(e.target.value)}
                  placeholder="https://tiktok.com/@tangerangkost"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00288E] focus:border-[#00288E] outline-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">"""

if re.search(target, content):
    content = re.sub(target, replacement, content)
    with open('apps/web/src/app/admin/settings/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS")
else:
    print("FAILED TO MATCH")
