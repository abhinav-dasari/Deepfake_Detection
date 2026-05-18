const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || 'Something went wrong');
    }
    return response.json();
};

const getHeaders = (isMultipart = false) => {
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    // Auth
    login: async (credentials) => {
        // SimpleJWT expects 'username', not 'email'
        const payload = { username: credentials.username, password: credentials.password };
        const response = await fetch(`${API_URL}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return handleResponse(response);
    },

    register: async (userData) => {
        const response = await fetch(`${API_URL}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },

    // Detection
    uploadImage: async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`${API_URL}/detect/upload/`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData,
        });
        return handleResponse(response);
    },

    // History
    getHistory: async () => {
        const response = await fetch(`${API_URL}/detect/history/`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
};
