// smart-pantry/eslint.config.js
import apiConfig from './packages/api/eslint.config.mjs';
import webConfig from './packages/web/eslint.config.js';

export default [
  // Глобальні налаштування для всього монорепозиторію
  {
    ignores: ['node_modules/', '**/dist/', '**/.vite/', '**/coverage/'],
  },
  // Підключаємо конфігурацію для бекенду
  ...apiConfig,
  // Підключаємо конфігурацію для фронтенду
  ...webConfig,
];
