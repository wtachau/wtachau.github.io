const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    index: [
    "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
    './client/index.js',
    ]
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].bundle.js",
    publicPath: "./"
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}