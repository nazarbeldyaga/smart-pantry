import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Беремо URL з .env (http://localhost:3000)
});
