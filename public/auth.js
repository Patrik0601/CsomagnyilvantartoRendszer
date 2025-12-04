function getToken() { return localStorage.getItem('token'); }
function setToken(t) { localStorage.setItem('token', t); }
function removeToken() { localStorage.removeItem('token'); }

window.getToken = getToken;
window.setToken = setToken;
window.removeToken = removeToken;