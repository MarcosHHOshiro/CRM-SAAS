module.exports = {
  env: {
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['.next', '.turbo', 'build', 'dist', 'node_modules'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
  },
};
