import axios from 'axios';
import { getToken } from '@/lib/tokenStorage';

// IMPORTANT: In production (Vercel), NEXT_PUBLIC_API_URL must be set in Vercel Dashboard.
// If not set, fallback to the localhost backend URL.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 30000, // 30 second timeout to prevent hanging requests
});


api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.clear();
                window.location.href = '/login';
            }
        }
        if (error.response?.status === 403 && error.response?.data?.code === 'PASSWORD_RESET_REQUIRED') {
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/change-password';
            }
        }
        return Promise.reject(error);
    }
);

export default api;