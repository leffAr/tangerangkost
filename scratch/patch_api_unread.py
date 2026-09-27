import re

with open('apps/web/src/lib/api.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_api = """export const markContactMessageRead = async (id: string) => {
  const { data } = await api.patch(`/contact/${id}/read`);
  return data;
};

export const getUnreadMessageCount = async () => {
  const { data } = await api.get('/contact/unread-count');
  return data.count;
};"""

content = content.replace("export const markContactMessageRead = async (id: string) => {\n  const { data } = await api.patch(`/contact/${id}/read`);\n  return data;\n};", new_api)

with open('apps/web/src/lib/api.ts', 'w', encoding='utf-8') as f:
    f.write(content)
