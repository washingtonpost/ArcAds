const babelOptions = {
  presets: ['@babel/preset-env'],
  plugins: ['babel-plugin-root-import'],
};

module.exports = require('babel-jest').default.createTransformer(babelOptions);
