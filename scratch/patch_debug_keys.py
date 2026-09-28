import re

with open('apps/api/src/contact/contact.controller.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_method = """  @Get('debug-env')
  getDebugEnv() {
    return {
      keys: Object.keys(process.env).filter(k => k.includes('GOOGLE') || k.includes('JWT') || k.includes('DATABASE')),
      allKeys: Object.keys(process.env)
    };
  }

  @Get('debug')"""

content = content.replace("  @Get('debug')", new_method)

with open('apps/api/src/contact/contact.controller.ts', 'w', encoding='utf-8') as f:
    f.write(content)
