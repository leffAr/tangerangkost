import re

with open('apps/api/src/app.controller.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_endpoint = """  @Get('debug-env')
  debugEnv() {
    return {
      googleId: process.env.GOOGLE_CLIENT_ID ? 'SET (' + process.env.GOOGLE_CLIENT_ID.substring(0, 5) + '...)' : 'MISSING',
      googleSecret: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
      dbUrl: process.env.DATABASE_URL ? 'SET' : 'MISSING'
    };
  }
}"""
content = content.replace("}", new_endpoint)

with open('apps/api/src/app.controller.ts', 'w', encoding='utf-8') as f:
    f.write(content)
