import urllib.request
import urllib.parse
import json
import base64

# A tiny 1x1 transparent GIF
b64_image = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
api_key = "23c0298fe962b4594f78729f4569a226"

data = urllib.parse.urlencode({'image': b64_image}).encode('utf-8')
req = urllib.request.Request(f"https://api.imgbb.com/1/upload?key={api_key}", data=data, method="POST")

try:
    with urllib.request.urlopen(req) as response:
        res = json.loads(response.read().decode())
        print("Success:", res['data']['url'])
except Exception as e:
    print("Error:", e)
