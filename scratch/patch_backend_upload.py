import re

path = 'apps/api/src/kos/kos-images.controller.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the @UseInterceptors block with a @Body block
# Original uses:
#   @UseInterceptors(
#     FileInterceptor('file', {
# ...
#   )
#   async uploadImage(
#     @CurrentUser() user: User,
#     @Param('kosId') kosId: string,
#     @UploadedFile() file: Express.Multer.File,
#   ) {

target = r"@UseInterceptors\([\s\S]*?\)[\s\S]*?async uploadImage\([\s\S]*?@UploadedFile\(\) file: Express\.Multer\.File,[\s\S]*?\) \{"
replacement = """@ApiBody({ schema: { type: 'object', properties: { url: { type: 'string' } } } })
  async uploadImage(
    @CurrentUser() user: User,
    @Param('kosId') kosId: string,
    @Body('url') url: string,
  ) {"""

content = re.sub(target, replacement, content)

# Remove the file check: if (!file) throw new BadRequestException('File is required');
content = content.replace(
    "if (!file) throw new BadRequestException('File is required');",
    "if (!url) throw new BadRequestException('Image URL is required');"
)

# Remove the url generation: const url = `/uploads/${file.filename}`;
content = content.replace(
    "const url = `/uploads/${file.filename}`;",
    ""
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
