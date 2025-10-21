import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

// 'tseslint.config' - це хелпер, який допомагає правильно "змішати" конфіги
export default tseslint.config(
  // Включаємо рекомендований набір правил від ESLint
  // (знаходить помилки типу 'no-unused-vars' у звичайному JS)
  eslint.configs.recommended,
  // 2. Включаємо рекомендований набір правил від TypeScript-ESLint
  // (знаходить помилки, специфічні для TS, наприклад, синтаксичні)
  // '...' (spread-оператор) потрібен, бо 'recommended' - це масив
  ...tseslint.configs.recommended,
  // 3. Наш власний об'єкт з кастомними правилами
  {
    rules: {
      //Правило, яке вимагає писати тип повернення для КОЖНОЇ функції
      '@typescript-eslint/explicit-function-return-type': 'off',
      //Те саме, але для функцій, які експортуються з файлу
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      //Дозволяє використовувати тип 'any', але показує жовте попередження
      '@typescript-eslint/no-explicit-any': 'warn',
      // 'warn' - Попереджає про невикористані змінні,
      // АЛЕ ігнорує змінні, які починаються з '_' (наприклад, у (req, _res, next))
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  }
);
