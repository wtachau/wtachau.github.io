import express from 'express'
import path from 'path'
import expressCDN from 'express-cdn'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import dotenv from 'dotenv'

import webpackConfig from './webpack.development.config.js'

const isLocal = !process.env._HANDLER
const isDeploying = !!process.env.DEPLOYING
const isDevelopment = isLocal && !isDeploying

if (isLocal) {
  dotenv.load()
}

const app = express()

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

app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))

app.locals.CDN = expressCDN(app, {
  publicDir: path.join(__dirname, 'public'),
  viewsDir: path.join(__dirname, 'views'),
  domain: 's3-us-west-1.amazonaws.com/tachauwebsite',
  bucket: 'tachauwebsite',
  endpoint: 's3-us-west-1.amazonaws.com',
  key: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY,
  hostname: 'localhost',
  port: (isLocal ? 1337 : 443),
  ssl: !isLocal,
  production: true
})()

app.get('/', (req, res) => {
  res.render('home', {
    useBundledAssets: !isDevelopment
  })
})

if (isLocal && !isDeploying) {
  app.listen(3000)
}

module.exports = app
