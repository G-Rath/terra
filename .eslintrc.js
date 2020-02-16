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
  extends: [
    'ackama', //
    'ackama/jest',
    'ackama/@typescript-eslint'
  ],
  rules: {
    'jest/prefer-expect-assertions': 'off'
  }
};
