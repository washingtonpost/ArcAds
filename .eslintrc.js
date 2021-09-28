module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: 'airbnb-base',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: '2018',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'no-console': 0,
    'class-methods-use-this': 0,
    'import/prefer-default-export': 0,
    'import/no-named-as-default': 0,
    'import/no-extraneous-dependencies': 0,
    'func-names': 0,
    'prefer-arrow-callback': 0,
    'consistent-return': 0,
    "object-curly-newline": [
      "error", 
      { 
        "minProperties": 3,
        "multiline": true,
      }
    ],
    "spaced-comment": 0,
    "comma-dangle": 0,
    "semi": 2,
    "no-prototype-builtins": 0,
    "object-curly-newline": 0,
    "no-restricted-syntax": 0,
    "max-len": 0,
    "no-plusplus": 0,
    "no-undef": 0,
    "arrow-body-style": 0,
    "no-use-before-define": 0,
    "radix": 0
  }
};
