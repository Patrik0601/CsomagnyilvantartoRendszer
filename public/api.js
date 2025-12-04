// token kezelés
function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function removeToken() {
    localStorage.removeItem('token');
}

// fetch kérések
async function apiRequest(method, path, body = null, auth = true) {
    const url = "http://localhost:3000" + path; // mindig teljes URL

    const headers = {
        "Content-Type": "application/json"
    };

    if (auth) {
        const token = getToken();
        if (!token) throw new Error("Nincs bejelentkezve");
        headers["Authorization"] = "Bearer " + token;
    }

    const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });

    // ha 401, token törlése
    if (res.status === 401) {
        removeToken();
        throw new Error("Nem vagy bejelentkezve vagy a token lejárt");
    }

    // a választ szövegként olvassuk
    const text = await res.text();
    if (!res.ok) {
        let msg = text || `HTTP hiba! Status: ${res.status}`;
        try {
            const data = JSON.parse(text);
            msg = data.message || data.error || msg;
        } catch (e) {}
        throw new Error(msg);
    } 

    // JSON parse, ha lehet
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

// üzenet megjelenítés (opcionális)
function showMsg(msg) {
    const el = document.getElementById("msg");
    if (el) el.textContent = typeof msg === "string" ? msg : JSON.stringify(msg);
}

// globális objektum
window.apiRequest = apiRequest;
window.getToken = getToken;
window.setToken = setToken;
window.removeToken = removeToken;
window.showMsg = showMsg;
