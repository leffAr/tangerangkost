import axios from 'axios';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.137.1:3000/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const cookies = parseCookies();
    const token = cookies.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const cookies = parseCookies();
        const refreshToken = cookies.refreshToken;
        
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        setCookie(null, 'accessToken', data.accessToken, {
          maxAge: 15 * 60, // 15 minutes
          path: '/',
        });
        
        setCookie(null, 'refreshToken', data.refreshToken, {
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: '/',
        });

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (e) {
        destroyCookie(null, 'accessToken');
        destroyCookie(null, 'refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
