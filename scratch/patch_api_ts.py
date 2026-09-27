import re

with open('apps/web/src/lib/api.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add to the end
api_funcs = """
// Contact Messages
export const submitContactMessage = async (data: { name: string; email: string; subject?: string; message: string }) => {
  const response = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Gagal mengirim pesan');
  return response.json();
};

export const getContactMessages = async (token: string) => {
  const response = await fetch(`${API_URL}/contact`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Gagal memuat pesan');
  return response.json();
};

export const markContactMessageRead = async (id: string, token: string) => {
  const response = await fetch(`${API_URL}/contact/${id}/read`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Gagal menandai pesan');
  return response.json();
};
"""

if 'submitContactMessage' not in content:
    with open('apps/web/src/lib/api.ts', 'a', encoding='utf-8') as f:
        f.write(api_funcs)
    print("Injected API funcs")
else:
    print("Already injected")
