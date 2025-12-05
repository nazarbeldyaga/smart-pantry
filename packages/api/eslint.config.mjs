import baseConfig from '../../eslint.config.base.mjs';
import tseslint from 'typescript-eslint';
// Імпортуємо список глобальних змінних
import globals from 'globals';

export default tseslint.config(
  // 1. Спочатку вставляємо ВСІ правила з нашого "Фундаменту"
  ...baseConfig,
  // 2. Додаємо об'єкт з "важкими" правилами, що потребують tsconfig.json
  {
    // 'files' - Застосовувати ці правила ТІЛЬКИ до файлів у 'src' та 'test'
    files: ['src/**/*.ts', 'test/**/*.ts'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        // 'project: true' - Вказує ESLint шукати найближчий 'tsconfig.json'
        project: true,
        // 'tsconfigRootDir' - Каже, звідки починати шукати 'tsconfig.json'
        // 'import.meta.dirname' - це сучасний аналог '__dirname' в ES модулях
        tsconfigRootDir: import.meta.dirname,
      },
    },
    // Додаткові правила, специфічні для API
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      files: ['**/*.spec.ts', '**/*.test.ts'],
      rules: {
        '@typescript-eslint/unbound-method': 'off',
        'jest/unbound-method': 'off', // якщо використовується плагін jest
      },
    },
  },
  // 3. Ще один об'єкт для загальних налаштувань пакету 'api'
  {
    languageOptions: {
      // Оголошуємо глобальні змінні для середовища Node.js та Jest
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    // Ігноруємо папку збірки
    ignores: ['dist/'],
  }
);
