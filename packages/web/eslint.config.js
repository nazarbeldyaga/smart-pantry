// packages/web/eslint.config.js
import baseConfig from '../../eslint.config.base.mjs';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import pluginReactX from 'eslint-plugin-react-x';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(...baseConfig, {
  files: ['**/*.{ts,tsx}'],
  plugins: {
    'react-x': pluginReactX,
    'react-refresh': pluginReactRefresh,
  },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
    globals: {
      ...globals.browser,
    },
  },
  rules: {
    ...pluginReactX.configs.recommended.rules,
    'react-x/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
  ignores: ['dist/', '.vite/'],
});
