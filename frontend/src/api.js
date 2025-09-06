const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

function authHeaders(){
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function signup(data){
  const r = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
  });
  return r.json();
}

export async function login(data){
  const r = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
  });
  return r.json();
}

export async function fetchItems(q = {}){
  const params = new URLSearchParams(q).toString();
  const r = await fetch(`${API_BASE}/items?${params}`);
  return r.json();
}

export async function addToCart(itemId, qty = 1){
  const r = await fetch(`${API_BASE}/cart/add`, {
    method: 'POST', headers: {'Content-Type':'application/json', ...authHeaders()}, body: JSON.stringify({ itemId, qty })
  });
  return r.json();
}

export async function getCart(){
  const r = await fetch(`${API_BASE}/cart`, { headers: authHeaders() });
  return r.json();
}

export async function removeFromCart(itemId){
  const r = await fetch(`${API_BASE}/cart/remove`, {
    method: 'POST', headers: {'Content-Type':'application/json', ...authHeaders()}, body: JSON.stringify({ itemId })
  });
  return r.json();
}
