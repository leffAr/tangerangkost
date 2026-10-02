import urllib.request
import urllib.parse
import json

with open('scratch/flowchart.mmd', 'r', encoding='utf-8') as f:
    mermaid_code = f.read()

url = "https://quickchart.io/mermaid"
data = json.dumps({"graph": mermaid_code}).encode('utf-8')

req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
with urllib.request.urlopen(req) as response, open('C:\\Users\\lefia\\.gemini\\antigravity\\brain\\977f15a1-3938-44c5-9d25-637ac20ce991\\TangerangKost_Flowchart.png', 'wb') as out_file:
    out_file.write(response.read())

print("Downloaded successfully!")
