import re

path_dto = 'apps/api/src/kos/dto/create-kos.dto.ts'
with open(path_dto, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace closing bracket of the class
if 'availableRooms?: number;' not in content:
    content = re.sub(
        r"  facilities\?: string\[\];\s*\}",
        "  facilities?: string[];\n\n  @ApiPropertyOptional() @IsNumber() @IsOptional() availableRooms?: number;\n}",
        content
    )

with open(path_dto, 'w', encoding='utf-8') as f:
    f.write(content)
