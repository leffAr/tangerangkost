const fs = require('fs');

async function test() {
  const b64 = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  const apiKey = "23c0298fe962b4594f78729f4569a226";
  
  const form = new URLSearchParams();
  form.append('image', b64);
  
  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: form
    });
    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
}

test();
