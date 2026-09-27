import re

with open('apps/web/src/lib/api.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Change parameter for submitContactMessage
pattern = r"export const submitContactMessage = async \(data: \{ name: string; email: string; subject\?: string; message: string \}\) => \{"
replacement = "export const submitContactMessage = async (data: { name: string; phone: string; subject?: string; message: string }, token: string) => {"
content = re.sub(pattern, replacement, content)

# Add authorization header
pattern2 = r"    headers: \{\n      'Content-Type': 'application/json',\n    \},"
replacement2 = "    headers: {\n      'Content-Type': 'application/json',\n      Authorization: `Bearer ${token}`,\n    },"
content = re.sub(pattern2, replacement2, content)

with open('apps/web/src/lib/api.ts', 'w', encoding='utf-8') as f:
    f.write(content)
