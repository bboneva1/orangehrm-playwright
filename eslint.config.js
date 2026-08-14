import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

// Flat config (ESLint 9). Array of config objects, applied in order.
export default tseslint.config(
  { ignores: ['node_modules', 'test-results', 'playwright-report', 'dist'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    rules: {
      // Test code legitimately uses non-null assertions less than app code does -
      // if you need `!`, you probably need a proper assertion instead.
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Floating promises are THE classic Playwright bug: a forgotten `await`
      // on page.click() makes tests pass that should fail.
      '@typescript-eslint/no-floating-promises': 'error',
    },
    languageOptions: {
      parserOptions: { projectService: true },  // needed for type-aware rules above
    },
  },

  // Must be last: turns off formatting rules that would fight Prettier.
  prettier
);
