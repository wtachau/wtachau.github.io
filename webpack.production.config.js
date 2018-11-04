const path = require('path')
const config = require('./webpack.base.config')

config.output = {
  filename: '[name]-bundle.js',
  path: path.join(__dirname, 'public'),
  sourceMapFilename: '[name]-bundle.js.map',
}

config.mode = 'production'

module.exports = config