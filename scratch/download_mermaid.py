import zlib
import base64
import urllib.request

with open('scratch/flowchart.mmd', 'r', encoding='utf-8') as f:
    mermaid_code = f.read()

# Kroki encoding: deflate + base64 (urlsafe)
compressed = zlib.compress(mermaid_code.encode('utf-8'))
encoded = base64.urlsafe_b64encode(compressed).decode('utf-8')

url = f"https://kroki.io/mermaid/png/{encoded}"

print(f"Downloading from {url}")

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response, open('C:\\Users\\lefia\\.gemini\\antigravity\\brain\\977f15a1-3938-44c5-9d25-637ac20ce991\\TangerangKost_Flowchart.png', 'wb') as out_file:
    data = response.read()
    out_file.write(data)

print("Downloaded successfully!")
