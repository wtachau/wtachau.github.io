import express from 'express'
import path from 'path'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from './webpack.development.config.js'

const app = express()
const port = 3000
const isLocal = !process.env._HANDLER 
const isDeploying = !!process.env.DEPLOYING
const isDevelopment = isLocal && !isDeploying

const sslEnabled = !isLocal

if (isLocal) {
  require('dotenv').load();
}

if (isDevelopment) {
  const compiler = webpack(webpackConfig)

  app.use(
    webpackMiddleware(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    })
  )

  app.use(webpackHotMiddleware(compiler))
}

const options = {
    publicDir  : path.join(__dirname, 'public')
  , viewsDir   : path.join(__dirname, 'views')
  , domain     : 's3-us-west-1.amazonaws.com/tachauwebsite'
  , bucket     : 'tachauwebsite'
  , endpoint: 's3-us-west-1.amazonaws.com'
  , key        : process.env.AWS_ACCESS_KEY_ID
  , secret     : process.env.AWS_SECRET_ACCESS_KEY
  , hostname   : 'localhost'
  , port       : (sslEnabled ? 443 : 1337)
  , ssl        : sslEnabled
  , production : true
}

const CDN = require('express-cdn')(app, options);

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.locals.CDN = CDN();

app.get('/', (req, res) => {
  res.render('home', {
    useBundledAssets: !isDevelopment
  })
})

if (isLocal && !isDeploying) {
  app.listen(port)
}

module.exports = app