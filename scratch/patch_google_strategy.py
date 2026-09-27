import re

with open('apps/api/src/auth/strategies/google.strategy.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace callbackURL and add proxy: true
pattern = r"callbackURL: process\.env\.GOOGLE_CALLBACK_URL.*,"
replacement = "callbackURL: process.env.GOOGLE_CALLBACK_URL || 'https://tangerangkost.onrender.com/api/v1/auth/google/callback',\n      proxy: true,"

content = re.sub(pattern, replacement, content)

with open('apps/api/src/auth/strategies/google.strategy.ts', 'w', encoding='utf-8') as f:
    f.write(content)
