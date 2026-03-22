// NOTE: We intentionally do NOT extend @react-native-community/eslint-config
// because it depends on eslint-plugin-prettier@3, which is incompatible with
// prettier@3 (resolveConfig.sync removed). We run prettier separately in CI
// via format:check, so the plugin is unnecessary.
//
// The rules below are carried forward from @react-native-community/eslint-config@2.0.0
// minus the prettier plugin dependency.
module.exports = {
  root: true,
  extends: ['prettier'],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'eslint-comments',
    'react',
    'react-hooks',
    'react-native',
    'jest',
  ],
  env: {
    es6: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // React-Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // React-Native
    'react-native/no-inline-styles': 1,

    // React
    'react/jsx-no-duplicate-props': 2,
    'react/jsx-no-undef': 2,
    'react/jsx-uses-react': 1,
    'react/jsx-uses-vars': 1,
    'react/no-string-refs': 1,
    'react/self-closing-comp': 1,

    // ESLint Comments
    'eslint-comments/no-aggregating-enable': 1,
    'eslint-comments/no-unlimited-disable': 1,
    'eslint-comments/no-unused-disable': 1,
    'eslint-comments/no-unused-enable': 1,

    // Jest
    'jest/no-disabled-tests': 1,
    'jest/no-focused-tests': 1,
    'jest/no-identical-title': 1,
    'jest/valid-expect': 1,

    // General
    'no-cond-assign': 1,
    'no-const-assign': 2,
    'no-dupe-class-members': 2,
    'no-dupe-keys': 2,
    'no-unreachable': 2,
    'no-eval': 2,
    'no-new-func': 2,
    'no-undef': 2,
    'no-unused-vars': [
      1,
      {vars: 'all', args: 'none', ignoreRestSiblings: true},
    ],
    'no-use-before-define': 0,
    eqeqeq: [1, 'allow-null'],
    curly: 1,
  },
  overrides: [
    {
      // Node.js files (configs, scripts)
      files: [
        '.eslintrc.js',
        'babel.config.js',
        'metro.config.js',
        'react-native.config.js',
        'index.js',
        'scripts/**/*.js',
      ],
      env: {
        node: true,
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      plugins: ['@typescript-eslint/eslint-plugin'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {argsIgnorePattern: '^_'},
        ],
        'no-shadow': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',
      },
    },
    {
      files: [
        'jest.setup.js',
        '*.{spec,test}.{js,ts,tsx}',
        '**/__{mocks,tests}__/**/*.{js,ts,tsx}',
      ],
      env: {
        jest: true,
        'jest/globals': true,
        node: true,
      },
      rules: {
        'react-native/no-inline-styles': 0,
        'no-undef': 'off',
      },
    },
  ],
};
