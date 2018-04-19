const babelOptions = {
  presets: ['env', 'stage-2'],
  plugins: ['transform-decorators-legacy', 'babel-plugin-root-import'],
};

module.exports = require('babel-jest').createTransformer(babelOptions)
