/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  env: { node: true },
  extends: ['ackama', 'ackama/@typescript-eslint'],
  ignorePatterns: ['recordings/*'],
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
        'jest/prefer-expect-assertions': 'off',
        'jest/no-large-snapshots': 'off'
      }
    }
  ],
  rules: {
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: { object: false }
      }
    ]
  }
};

module.exports = config;
