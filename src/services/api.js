const BASE_URL = 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token && !endpoint.startsWith('/auth')) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Безопасная обработка 401 без зацикливания reload
    if (response.status === 401 && !endpoint.startsWith('/auth')) {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/') {
            window.location.href = '/';
        }
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `Error ${response.status}`);
        error.status = response.status;
        throw error;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

export const authApi = {
    login: (credentials) => request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    register: (credentials) => request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials)
    })
};

export const subscriptionApi = {
    getAll: () => request('/subscriptions'),
    getTotalExpenses: () => request('/subscriptions/total'),
    create: (data) => request('/subscriptions', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    delete: (id) => request(`/subscriptions/${id}`, {
        method: 'DELETE'
    }),
    getGhosts: () => request('/subscriptions/ghosts'),
    markUsed: (id) => request(`/subscriptions/${id}/used`, { method: 'POST' }),
    getPriceHistory: (id) => request(`/subscriptions/${id}/price-history`),
    getUpcoming: (days = 7) => request(`/subscriptions/upcoming?days=${days}`),
    getMembers: (id) => request(`/subscriptions/${id}/members`),
    addMember: (id, name) => request(`/subscriptions/${id}/members`, {
        method: 'POST',
        body: JSON.stringify({ name })
    }),
    deleteMember: (id, memberId) => request(`/subscriptions/${id}/members/${memberId}`, {
        method: 'DELETE'
    }),
    getDebts: () => request('/subscriptions/debts')
};