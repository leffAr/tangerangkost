import re

with open('apps/web/src/app/admin/settings/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state variables
target_state = r'const \[address, setAddress\] = useState\(\'\'\);'
replacement_state = """const [address, setAddress] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');"""
content = re.sub(target_state, replacement_state, content)

# 2. Add to GET fetch
target_get = r'setAddress\(resContact\.data\.address \|\| \'\'\);'
replacement_get = """setAddress(resContact.data.address || '');
      setInstagram(resContact.data.instagram || '');
      setTiktok(resContact.data.tiktok || '');"""
content = re.sub(target_get, replacement_get, content)

# 3. Add to PATCH request
target_patch = r'whatsapp,\s*email,\s*address,'
replacement_patch = """whatsapp,
        email,
        address,
        instagram,
        tiktok,"""
content = re.sub(target_patch, replacement_patch, content)

# 4. Add Input fields to the JSX
target_jsx = r'</textarea>\s*</div>\s*</div>\s*<div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end rounded-b-2xl">'
replacement_jsx = """</textarea>
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

            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end rounded-b-2xl">"""
content = re.sub(target_jsx, replacement_jsx, content)

with open('apps/web/src/app/admin/settings/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
