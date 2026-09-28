import re

with open('apps/api/src/contact/contact.controller.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_method = """  @Get('debug2')
  getDebug2() {
    const cid = process.env.GOOGLE_CLIENT_ID;
    const cidKey = Object.keys(process.env).find(k => k.includes('GOOGLE_CLIENT_ID'));
    return {
      cid_value: cid,
      cid_type: typeof cid,
      cid_length: cid ? cid.length : 0,
      cid_key_found: cidKey,
      cid_key_length: cidKey ? cidKey.length : 0,
      cidKey_hex: cidKey ? Buffer.from(cidKey).toString('hex') : null,
      val_hex: cid ? Buffer.from(cid).toString('hex') : null
    };
  }

  @Get('debug-env')"""

content = content.replace("  @Get('debug-env')", new_method)

with open('apps/api/src/contact/contact.controller.ts', 'w', encoding='utf-8') as f:
    f.write(content)
