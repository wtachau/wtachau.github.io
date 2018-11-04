module.exports = {
  entry: {
    index: [
      './client/index.js',
    ]
  },
  resolve: {
    modules: [
      './client',
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  }
}
