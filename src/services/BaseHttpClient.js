const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const defaultHeaders = {
    'Content-Type': 'application/json',
    // todo - colocar o token aqui depois
    // 'Authorization': `Bearer ${token}`
};

async function request(method, url, data) {
    const config = {
        method,
        headers: { ...defaultHeaders },
    };

    if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE}${url}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || `Erro ${response.status}`;
        throw new Error(message);
    }

    return response.json().catch(() => ({}));
}

const BaseHttpClient = {
    get: (url) => request('GET', url),
    post: (url, data) => request('POST', url, data),
    put: (url, data) => request('PUT', url, data),
    del: (url) => request('DELETE', url),
};

export default BaseHttpClient;
