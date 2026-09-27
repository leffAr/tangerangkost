import re

# 1. Patch api.ts
with open('apps/web/src/lib/api.ts', 'r', encoding='utf-8') as f:
    content = f.read()

pattern_get = r"export const getContactMessages = async \(token: string\) => \{.*?return response\.json\(\);\n\};"
replacement_get = """export const getContactMessages = async () => {
  const { data } = await api.get('/contact');
  return data;
};"""
content = re.sub(pattern_get, replacement_get, content, flags=re.DOTALL)

pattern_mark = r"export const markContactMessageRead = async \(id: string, token: string\) => \{.*?return response\.json\(\);\n\};"
replacement_mark = """export const markContactMessageRead = async (id: string) => {
  const { data } = await api.patch(`/contact/${id}/read`);
  return data;
};"""
content = re.sub(pattern_mark, replacement_mark, content, flags=re.DOTALL)

with open('apps/web/src/lib/api.ts', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Patch page.tsx
with open('apps/web/src/app/admin/messages/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix fetchMessages
pattern_fetch = r"const token = localStorage\.getItem\('token'\);\n\s*if \(!token\) return;\n\s*const data = await getContactMessages\(token\);"
replacement_fetch = "const data = await getContactMessages();"
content = re.sub(pattern_fetch, replacement_fetch, content)

# Fix handleMarkRead
pattern_read = r"const token = localStorage\.getItem\('token'\);\n\s*if \(!token\) return;\n\s*await markContactMessageRead\(id, token\);"
replacement_read = "await markContactMessageRead(id);"
content = re.sub(pattern_read, replacement_read, content)

with open('apps/web/src/app/admin/messages/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
