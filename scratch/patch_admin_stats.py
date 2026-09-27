import re

with open('apps/api/src/admin/admin.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"const \[totalUsers, totalOwners, totalKos, pendingVerifications\] = await Promise\.all\(\[\n(.*?)\n\s+\]\);"
replacement = """const [totalUsers, totalOwners, totalKos, pendingVerifications, unreadMessages] = await Promise.all([
\\1,
        this.prisma.contactMessage.count({ where: { isRead: false } })
      ]);"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

pattern_return = r"return \{\n\s+totalUsers,\n\s+totalOwners,\n\s+totalKos,\n\s+pendingVerifications,\n\s+\};"
replacement_return = """return {
        totalUsers,
        totalOwners,
        totalKos,
        pendingVerifications,
        unreadMessages,
      };"""

content = re.sub(pattern_return, replacement_return, content)

with open('apps/api/src/admin/admin.service.ts', 'w', encoding='utf-8') as f:
    f.write(content)
