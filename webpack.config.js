const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    'diff-parser': './src/diff-parser.ts',
    'diff-parser.min': './src/diff-parser.ts',
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'DiffParser',
    umdNamedDefine: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  devtool: 'inline-source-map',
  optimization: {
    minimizer: [new UglifyJsPlugin({ include: /\.min\.js$/ })],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, /\.spec.ts$/],
      },
    ],
  },
};
