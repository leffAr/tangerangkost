async function main() {
  try {
    const res = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@tangerangkost.com',
        password: 'password123'
      })
    });
    const data = await res.json();
    console.log('Login success:', data);
  } catch (e: any) {
    console.error('Login failed:', e);
  }
}

main();
