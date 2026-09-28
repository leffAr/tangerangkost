import re

with open('apps/api/src/contact/contact.controller.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_method = """  @Get('debug')
  getDebug() {
    return {
      clientId: process.env.GOOGLE_CLIENT_ID || 'undefined',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'undefined'
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)"""

content = content.replace("  @UseGuards(JwtAuthGuard, RolesGuard)", new_method, 1)

with open('apps/api/src/contact/contact.controller.ts', 'w', encoding='utf-8') as f:
    f.write(content)
