module.exports = {
  extends: 'airbnb-base',
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
  },
};
