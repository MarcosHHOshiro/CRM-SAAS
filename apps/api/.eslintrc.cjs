module.exports = {
  root: true,
  extends: ['@crm-saas/eslint-config/nest'],
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
};

