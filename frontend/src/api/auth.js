const API_BASE = '/api/v1';

/**
 * Login — calls POST /api/v1/auth/login/access-token
 * Backend expects OAuth2 form data (username + password)
 */
export async function loginUser(email, password) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const res = await fetch(`${API_BASE}/auth/login/access-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.detail || 'Login failed');
    }

    return data; // { access_token, token_type }
}

/**
 * Register — calls POST /api/v1/auth/register/user
 * Backend expects JSON body: { email, password, role, organization_id }
 */
export async function registerUser({ email, password, organization_id }) {
    const res = await fetch(`${API_BASE}/auth/register/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            password,
            role: 'user',
            organization_id: organization_id || null,
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.detail || 'Registration failed');
    }

    return data;
}

/**
 * Store + Retrieve + Clear the JWT token
 */
export function saveToken(token) {
    localStorage.setItem('ocsafe_token', token);
}

export function getToken() {
    return localStorage.getItem('ocsafe_token');
}

export function clearToken() {
    localStorage.removeItem('ocsafe_token');
}

/**
 * Helper: make an authenticated GET request
 */
export async function authFetch(url, options = {}) {
    const token = getToken();
    const res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
        },
    });

    if (res.status === 401) {
        clearToken();
        window.location.href = '/signin';
        return;
    }

    return res;
}
