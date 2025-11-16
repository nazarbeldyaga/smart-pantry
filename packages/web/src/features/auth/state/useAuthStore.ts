import { create } from 'zustand';
import type { AuthState } from '../types/auth-types';
import { loginUser, registerUser } from '../api/authApi';
import { apiClient } from '../../../shared/api/apiClient';

const getTokenFromStorage = (): string | null => {
  return localStorage.getItem('authToken');
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: getTokenFromStorage(),
  isLoading: false,
  error: null,

  login: async (email, pass) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginUser(email, pass);
      const { user, token } = response.data;

      localStorage.setItem('authToken', token);
      set({ user, token, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  register: async (username, email, pass) => {
    set({ isLoading: true, error: null });
    try {
      const response = await registerUser(username, email, pass);
      const { user, token } = response.data;

      localStorage.setItem('authToken', token);
      set({ user, token, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    set({ user: null, token: null });
  },
}));

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
