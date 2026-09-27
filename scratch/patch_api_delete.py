import re

with open('apps/web/src/lib/api.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_api = """export const getUnreadMessageCount = async () => {
  const { data } = await api.get('/contact/unread-count');
  return data.count;
};

export const deleteContactMessage = async (id: string) => {
  const { data } = await api.delete(`/contact/${id}`);
  return data;
};"""

content = content.replace("export const getUnreadMessageCount = async () => {\n  const { data } = await api.get('/contact/unread-count');\n  return data.count;\n};", new_api)

with open('apps/web/src/lib/api.ts', 'w', encoding='utf-8') as f:
    f.write(content)
