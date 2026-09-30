import re

path = 'apps/api/src/admin/admin.controller.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

target = r"@UseInterceptors\(FileInterceptor\('file', \{[\s\S]*?\}\)\)\s*uploadFile\(@UploadedFile\(\) file: Express\.Multer\.File\) \{"
replacement = """@Post('upload')
  uploadFile(@Body('url') url: string) {"""

content = re.sub(target, replacement, content)
content = content.replace("if (!file) throw new BadRequestException('File is required');", "if (!url) throw new BadRequestException('URL is required');")
content = content.replace("return { url: `/uploads/${file.filename}` };", "return { url };")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
