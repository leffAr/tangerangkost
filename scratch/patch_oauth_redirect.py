import re

with open('apps/api/src/auth/auth.controller.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("res.redirect('http://localhost:3001/dashboard');", "res.redirect(process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/dashboard` : 'https://tangerangkost.vercel.app/dashboard');")

with open('apps/api/src/auth/auth.controller.ts', 'w', encoding='utf-8') as f:
    f.write(content)
