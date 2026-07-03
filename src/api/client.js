const API = '';

function token() { return localStorage.getItem('dsa-auth-token'); }

function headers() {
  const h = { 'Content-Type': 'application/json' };
  const t = token();
  if (t) h.Authorization = `Bearer ${t}`;
  return h;
}

export async function apiGet(path) {
  const res = await fetch(`${API}${path}`, { headers: headers() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}

export function setAuthToken(t) { localStorage.setItem('dsa-auth-token', t); }
export function getAuthToken() { return localStorage.getItem('dsa-auth-token'); }
export function clearAuthToken() { localStorage.removeItem('dsa-auth-token'); }
