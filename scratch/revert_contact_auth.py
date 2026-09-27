import re

# 1. Update contact.controller.ts
with open('apps/api/src/contact/contact.controller.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("@UseGuards(JwtAuthGuard)\n  @Post()", "@Post()")

with open('apps/api/src/contact/contact.controller.ts', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update api.ts
with open('apps/web/src/lib/api.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("export const submitContactMessage = async (data: { name: string; phone: string; subject?: string; message: string }, token: string) => {", "export const submitContactMessage = async (data: { name: string; phone: string; subject?: string; message: string }) => {")
content = content.replace("      Authorization: `Bearer ${token}`,\n", "")

with open('apps/web/src/lib/api.ts', 'w', encoding='utf-8') as f:
    f.write(content)
