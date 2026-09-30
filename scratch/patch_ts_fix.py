import re

path_edit = 'apps/web/src/app/owner/kos/[id]/edit/page.tsx'
with open(path_edit, 'r', encoding='utf-8') as f:
    content_edit = f.read()

# Fix formData initial state
if 'availableRooms: 0' not in content_edit:
    content_edit = content_edit.replace(
        "facilities: [] as string[]\n  });",
        "facilities: [] as string[],\n    availableRooms: 0\n  });"
    )

# Fix formData setting in loadKos
if 'availableRooms: data.availableRooms' not in content_edit:
    content_edit = content_edit.replace(
        "facilities: data.facilities?.map((f: any) => f.facility.name) || []\n        });",
        "facilities: data.facilities?.map((f: any) => f.facility.name) || [],\n          availableRooms: data.availableRooms || 0\n        });"
    )

with open(path_edit, 'w', encoding='utf-8') as f:
    f.write(content_edit)
