import urllib.request, urllib.error, json
req = urllib.request.Request(
    'https://tangerangkost.onrender.com/api/v1/auth/login', 
    data=json.dumps({'email':'admin@tangerangkost.com','password':'password123'}).encode(), 
    headers={'Content-Type': 'application/json'}
)
try:
    print(urllib.request.urlopen(req).read().decode())
except urllib.error.HTTPError as e:
    print('ERROR:', e.code, e.read().decode())
