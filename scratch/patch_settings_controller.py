import re

with open('apps/api/src/settings/settings.controller.ts', 'r', encoding='utf-8') as f:
    ctrl = f.read()

ctrl = ctrl.replace(
    "updateContactSettings(@Body() data: { whatsapp?: string; email?: string; address?: string })",
    "updateContactSettings(@Body() data: { whatsapp?: string; email?: string; address?: string; instagram?: string; tiktok?: string })"
)

with open('apps/api/src/settings/settings.controller.ts', 'w', encoding='utf-8') as f:
    f.write(ctrl)
print("SUCCESS")
