import re

def patch_frontend_upload(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The original loop:
    # if (files.length > 0) {
    #   for (const f of files) {
    #     const uploadData = new FormData();
    #     uploadData.append('file', f);
    #     await api.post(`/kos/${id}/images`, uploadData, {
    #       headers: { 'Content-Type': 'multipart/form-data' }
    #     });
    #   }
    # }

    new_loop = """        if (files.length > 0) {
          for (const f of files) {
            // Upload directly to ImgBB
            const imgbbData = new FormData();
            imgbbData.append('image', f);
            
            const imgbbRes = await fetch('https://api.imgbb.com/1/upload?key=23c0298fe962b4594f78729f4569a226', {
              method: 'POST',
              body: imgbbData
            });
            const imgbbJson = await imgbbRes.json();
            
            if (imgbbJson.success) {
              // Send the permanent ImgBB URL to our backend
              await api.post(
                id ? `/kos/${id}/images` : `/kos/${kosId}/images`, 
                { url: imgbbJson.data.url }
              );
            } else {
              toast.error('Gagal mengunggah foto ke server penyimpanan');
            }
          }
        }"""

    # We need to use regex because spacing might differ slightly between create and edit
    # We match from `if (files.length > 0) {` to the closing `}` of the if block
    target = r"if\s*\(files\.length\s*>\s*0\)\s*\{[\s\S]*?for\s*\(const\s+f\s+of\s+files\)\s*\{[\s\S]*?await\s+api\.post\([\s\S]*?\}\s*\)"
    
    # Wait, the `api.post` could be in a block. Let's just do a string replace on the common part
    
    # Let's see the exact string in edit/page.tsx
    # if (files.length > 0) {
    #       for (const f of files) {
    #         const uploadData = new FormData();
    #         uploadData.append('file', f);
    #         await api.post(`/kos/${id}/images`, uploadData, {
    #           headers: { 'Content-Type': 'multipart/form-data' }
    #         });
    #       }
    #     }
    content = re.sub(r"if\s*\(files\.length\s*>\s*0\)\s*\{[\s\S]*?uploadData\.append\('file',\s*f\);[\s\S]*?headers:\s*\{\s*'Content-Type':\s*'multipart/form-data'\s*\}[\s\S]*?\}\);[\s\S]*?\}[\s\S]*?\}", new_loop, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

patch_frontend_upload('apps/web/src/app/owner/kos/[id]/edit/page.tsx')
patch_frontend_upload('apps/web/src/app/owner/kos/create/page.tsx')
