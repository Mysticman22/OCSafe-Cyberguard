const API_BASE = '/api/v1';

// ─── Auth ─────────────────────────────────────────────

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
    if (!res.ok) throw new Error(data.detail || 'Login failed');
    return data; // { access_token, token_type }
}

export async function registerUser({ email, password, organization_id }) {
    const res = await fetch(`${API_BASE}/auth/register/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'user', organization_id: organization_id || null }),
    });

    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error('Server error. Please try again later.');
    }
    if (!res.ok) throw new Error(data.detail || 'Registration failed');
    return data;
}

// ─── Token Management ─────────────────────────────────

export function saveToken(token) {
    localStorage.setItem('ocsafe_token', token);
}

export function getToken() {
    return localStorage.getItem('ocsafe_token');
}

export function clearToken() {
    localStorage.removeItem('ocsafe_token');
}

export function isAuthenticated() {
    return !!getToken();
}

// ─── Authenticated Fetch Helper ───────────────────────

export async function authFetch(url, options = {}) {
    const token = getToken();
    if (!token) {
        window.location.href = '/signin';
        return null;
    }

    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
            'Authorization': `Bearer ${token}`,
        },
    });

    if (res.status === 401) {
        clearToken();
        window.location.href = '/signin';
        return null;
    }

    return res;
}

// ─── User Info ────────────────────────────────────────

export async function getCurrentUser() {
    const res = await authFetch(`${API_BASE}/auth/me`);
    if (!res) return null;
    if (!res.ok) return null;
    return await res.json();
}

// ─── Dashboard API ────────────────────────────────────

export async function getSecurityScore() {
    const res = await authFetch(`${API_BASE}/dashboard/score`);
    if (!res || !res.ok) return { score: 0, max_score: 100, status_label: '' };
    return await res.json();
}

export async function getThreatsAnalytics(days = 7) {
    const res = await authFetch(`${API_BASE}/dashboard/analytics/threats?days=${days}`);
    if (!res || !res.ok) return { labels: [], data: [] };
    return await res.json();
}

export async function getDevicesAnalytics() {
    const res = await authFetch(`${API_BASE}/dashboard/analytics/devices`);
    if (!res || !res.ok) return { labels: [], online_series: [], offline_series: [] };
    return await res.json();
}

export async function getRiskDistribution() {
    const res = await authFetch(`${API_BASE}/dashboard/analytics/risk-distribution`);
    if (!res || !res.ok) return { low: 0, medium: 0, high: 0 };
    return await res.json();
}

// ─── Alerts API ───────────────────────────────────────

export async function getAlerts() {
    const res = await authFetch(`${API_BASE}/alerts`);
    if (!res || !res.ok) return { alerts: [] };
    return await res.json();
}

export async function resolveAlert(alertId) {
    const res = await authFetch(`${API_BASE}/alerts/${alertId}/resolve`, { method: 'PUT' });
    if (!res || !res.ok) throw new Error('Failed to resolve alert');
    return await res.json();
}

// ─── Devices API ──────────────────────────────────────

export async function getDevices() {
    const res = await authFetch(`${API_BASE}/devices`);
    if (!res || !res.ok) return [];
    return await res.json();
}

// ─── Users API (Admin only) ───────────────────────────

export async function getUsers() {
    const res = await authFetch(`${API_BASE}/users`);
    if (!res || !res.ok) return [];
    return await res.json();
}

export async function removeUser(userId) {
    const res = await authFetch(`${API_BASE}/users/${userId}`, { method: 'DELETE' });
    if (!res || !res.ok) throw new Error('Failed to remove user');
    return await res.json();
}

export async function changeUserRole(userId, role) {
    const res = await authFetch(`${API_BASE}/users/${userId}/role?role=${role}`, { method: 'PUT' });
    if (!res || !res.ok) throw new Error('Failed to change role');
    return await res.json();
}

// ─── Audit Logs API ──────────────────────────────────

export async function getAuditLogs() {
    const res = await authFetch(`${API_BASE}/audit-logs`);
    if (!res || !res.ok) return [];
    return await res.json();
}
