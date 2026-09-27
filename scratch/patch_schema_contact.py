import re

with open('apps/api/prisma/schema.prisma', 'r', encoding='utf-8') as f:
    content = f.read()

model = """
model ContactMessage {
  id        String   @id @default(uuid())
  name      String
  email     String
  subject   String?
  message   String   @db.Text
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}
"""

if 'model ContactMessage' not in content:
    with open('apps/api/prisma/schema.prisma', 'a', encoding='utf-8') as f:
        f.write(model)
    print("Added ContactMessage model")
else:
    print("Already exists")
