import urllib.request
import urllib.parse

print('Testing backend root...')
try:
    with urllib.request.urlopen('http://127.0.0.1:8000/', timeout=5) as resp:
        print('ROOT', resp.status)
        print(resp.read().decode())
except Exception as exc:
    print('ROOT ERROR', type(exc).__name__, exc)

print('\nTesting login endpoint...')
try:
    data = urllib.parse.urlencode({'username': 'admin@abc.com', 'password': 'AdminPass123!'}).encode()
    req = urllib.request.Request(
        'http://127.0.0.1:8000/login',
        data=data,
        headers={'Content-Type': 'application/x-www-form-urlencoded'},
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        print('LOGIN', resp.status)
        print(resp.read().decode())
except Exception as exc:
    print('LOGIN ERROR', type(exc).__name__, exc)
