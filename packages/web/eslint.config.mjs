import baseConfig from '../../eslint.config.base.mjs';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import pluginReactX from 'eslint-plugin-react-x';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(...baseConfig, {
  files: ['**/*.{ts,tsx}'],
  // 'plugins' - так у новій "flat" конфігурації підключаються плагіни
  plugins: {
    'react-x': pluginReactX,
    'react-refresh': pluginReactRefresh,
  },
  languageOptions: {
    parserOptions: {
      // 'ecmaFeatures: { jsx: true }' - Вмикає аналіз JSX-синтаксису
      ecmaFeatures: { jsx: true },
    },
    // Оголошуємо глобальні змінні браузера (наприклад, 'window', 'document')
    globals: {
      ...globals.browser,
    },
  },
  rules: {
    // Включаємо всі рекомендовані правила з плагіна 'react-x'
    ...pluginReactX.configs.recommended.rules,
    // Вимикаємо правило, яке вимагало 'import React from "react"' у кожному файлі
    'react-x/react-in-jsx-scope': 'off',
    // Правило для Vite, яке стежить за правильним експортом компонентів
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
  ignores: ['dist/', '.vite/'],
});
