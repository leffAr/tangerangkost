import re

with open('apps/api/.env', 'r', encoding='utf-8') as f:
    content = f.read()

new_db_url = "mysql://4TvHqaXm7BZPzjK.root:amVmEsnGioCh00pJ@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/sys?sslaccept=strict"
content = re.sub(r'DATABASE_URL=.*', f'DATABASE_URL="{new_db_url}"', content)

with open('apps/api/.env', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
