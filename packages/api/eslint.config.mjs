// packages/api/eslint.config.mjs
import baseConfig from '../../eslint.config.base.mjs';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  ...baseConfig,
  // Застосовуємо type-aware правила ТІЛЬКИ до TS файлів проєкту
  {
    files: ['src/**/*.ts', 'test/**/*.ts'], // <-- Вказуємо область дії
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
    },
  },
  // Загальні налаштування для всього пакету 'api'
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    ignores: ['dist/'],
  },
);
