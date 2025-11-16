// web/src/shared/api/apiClient.ts
import axios from 'axios';

// Створюємо екземпляр axios
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Беремо URL з .env (http://localhost:3000)
});

// Інтерцептор, який буде додавати токен до *кожного* запиту
// (Ми налаштуємо його в useAuthStore)
