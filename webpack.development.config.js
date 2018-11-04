const webpack = require('webpack')
const path = require('path')

const config = require('./webpack.base.config')

config.mode = 'development'

config.entry.index.push(
  'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'
)

config.output = {
  path: path.resolve(__dirname, './public'),
  filename: '[name].bundle.js',
  publicPath: '/'
}

config.plugins = [
  new webpack.HotModuleReplacementPlugin()
]

module.exports = config
