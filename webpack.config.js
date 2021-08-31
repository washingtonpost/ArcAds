const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');

const generateOptimizations = (env) => {
  let optimizations = {
    minimize: false
  };
  if (env.production) {
    optimizations.minimize = true;
    optimizations.minimizer = [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ]
  }
  return optimizations;
};

const generatePlugins = (env) => {
  let plugins = [];

  if (env.production) {
    plugins.push(new ESLintPlugin())
  }
  return plugins;
};

module.exports = env => ({
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'arcads.js',
    libraryTarget: 'umd',
  },
  devtool: env.development ? 'inline-source-map' : false,
  resolve: { extensions: ['.js', '.json'] },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  optimization: generateOptimizations(env),
  plugins: generatePlugins(env),
});
