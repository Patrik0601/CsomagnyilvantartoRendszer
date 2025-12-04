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

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function getUserRoleFromToken() {
    const token = getToken();
    if (!token) return null;
    try {
        const decoded = parseJwt(token);
        return decoded.role;
    } catch (e) {
        console.error("Error decoding token:", e);
        return null;
    }
}

async function apiRequest(method, path, body = null, auth = true) {
    const url = "http://localhost:3000" + path;

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

    if (res.status === 401) {
        removeToken();
        throw new Error("Nem vagy bejelentkezve vagy a token lejárt");
    }

    const text = await res.text();
    if (!res.ok) {
        let errorMessage = `HTTP hiba! Státusz: ${res.status}`;
        try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
            errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
    }

    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

function showMsg(msg) {
    const el = document.getElementById("msg");
    if (el) el.textContent = typeof msg === "string" ? msg : JSON.stringify(msg);
}

window.apiRequest = apiRequest;
window.getToken = getToken;
window.setToken = setToken;
window.removeToken = removeToken;
window.showMsg = showMsg;
window.getUserRoleFromToken = getUserRoleFromToken;
