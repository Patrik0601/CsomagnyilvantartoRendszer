// Egyszerű wrapper az API hívásokhoz
function getToken(){ return localStorage.getItem('token'); }
function setToken(t){ localStorage.setItem('token', t); }
function removeToken(){ localStorage.removeItem('token'); }

async function apiRequest(method, path, body=null, auth=true){
  const headers = { 'Content-Type':'application/json' };
  if(auth){
    const t = getToken();
    if(!t) throw new Error('Nincs bejelentkezve');
    headers['Authorization'] = 'Bearer ' + t;
  }
  const res = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if(res.status === 401) { removeToken(); throw new Error('Unauthorized — jelentkezz be újra'); }
  const text = await res.text();
  try{ return JSON.parse(text); } catch(e){ return text; }
}

// exportoljuk globálisan
window.apiRequest = apiRequest;
window.getToken = getToken;
window.setToken = setToken;
window.removeToken = removeToken;

// helper üzenet megjelenítés login/register oldalaknak
window.showMsg = function(msg){ const el = document.getElementById('msg'); if(el) el.textContent = typeof msg === 'string' ? msg : JSON.stringify(msg); }
