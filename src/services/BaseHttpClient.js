const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

function buildHeaders(customHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...customHeaders,
  };
  return headers;
}

async function request(method, url, data = null, customHeaders = {}) {
  const config = {
    method,
    headers: buildHeaders(customHeaders),
  };

  if (data && method !== 'GET') {
    config.body = JSON.stringify(data);
  }

  const fullUrl = `${API_BASE}${url}`;
  if (import.meta.env.DEV) {
    console.log(`[HTTP] ${method} → ${fullUrl}`, data || '');
  }

  try {
    const response = await fetch(fullUrl, config);

    const responseBody = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = responseBody.message || `Erro ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.body = responseBody;
      throw error;
    }

    return responseBody;
  } catch (error) {
    console.error(`[HTTP ERROR] ${method} ${url}`, error);
    throw error;
  }
}

const BaseHttpClient = {
  get: (url, headers) => request('GET', url, null, headers),
  post: (url, data, headers) => request('POST', url, data, headers),
  put: (url, data, headers) => request('PUT', url, data, headers),
  del: (url, headers) => request('DELETE', url, null, headers),
  setAuthToken,
};

export default BaseHttpClient;
