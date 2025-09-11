const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

function handleUnauthorized() {
  
  localStorage.removeItem('ce_auth_token');
  authToken = null;
  
  if (window.location.pathname !== '/login') {
    sessionStorage.setItem('sessionExpired', 'true');
    window.location.href = '/login';
  }
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
      if (response.status === 401) {
        handleUnauthorized();
        
        const error = new Error('Sessão expirada. Redirecionando para login...');
        error.status = response.status;
        error.body = responseBody;
        throw error;
      }

      const errorMessage = responseBody.message || responseBody.errors?.[0] || `Erro ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.body = responseBody;
      error.errors = responseBody.errors || [];
      error.errorCode = responseBody.errorCode;
      throw error;
    }

    if (responseBody && typeof responseBody === 'object') {
      if (responseBody.hasOwnProperty('success') && responseBody.hasOwnProperty('data')) {
        if (responseBody.success) {
          return responseBody.data;
        } else {
          const errorMessage = responseBody.message || responseBody.errors?.[0] || 'Erro desconhecido';
          const error = new Error(errorMessage);
          error.status = response.status;
          error.body = responseBody;
          error.errors = responseBody.errors || [];
          error.errorCode = responseBody.errorCode;
          error.success = false;
          throw error;
        }
      }
      return responseBody;
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
  patch: (url, data, headers) => request('PATCH', url, data, headers),
  del: (url, headers) => request('DELETE', url, null, headers),
  setAuthToken,
  
  getFullResponse: async (method, url, data = null, headers = {}) => {
    const config = {
      method,
      headers: buildHeaders(headers),
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    const fullUrl = `${API_BASE}${url}`;
    const response = await fetch(fullUrl, config);
    const responseBody = await response.json().catch(() => ({}));
    
    return {
      success: response.ok && (responseBody.success !== false),
      status: response.status,
      data: responseBody.data || responseBody,
      message: responseBody.message,
      errors: responseBody.errors || [],
      errorCode: responseBody.errorCode,
      timestamp: responseBody.timestamp
    };
  }
};

export default BaseHttpClient;
