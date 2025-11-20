import { apiClient } from '@/shared/api/apiClient.ts';

export const registerUser = (username: string, email: string, pass: string) => {
  return apiClient.post('/auth/register', { username, email, password: pass });
};

export const loginUser = (email: string, pass: string) => {
  return apiClient.post('/auth/login', { email, password: pass });
};
