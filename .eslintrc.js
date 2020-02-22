module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.eslint.json',
    createDefaultProgram: false,
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  env: { node: true },
  plugins: [
    '@typescript-eslint', //
    'prettier',
    'eslint-comments'
  ],
  extends: ['ackama', 'ackama/@typescript-eslint'],
  overrides: [
    {
      files: ['bin/**'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      files: ['test/**'],
      extends: ['ackama/jest'],
      rules: {
        'jest/prefer-expect-assertions': 'off'
      }
    }
  ],
  rules: {}
};
