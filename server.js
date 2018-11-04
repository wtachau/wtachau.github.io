var sslEnabled = true
const isLocal = !process.env._HANDLER 
const isDeploying = !!process.env.DEPLOYING

if (isLocal || isDeploying) {
  require('dotenv').load();
}
if (isLocal) {
  const sslEnabled = false
}

console.log(process.env)
console.log(isLocal)
console.log(isDeploying)

const express = require('express')
const app = express()
const path = require('path')
const port = 3000

import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackConfig from './webpack.config.js'

const compiler = webpack(webpackConfig)

app.use(
    webpackMiddleware(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    })
)

app.use(require("webpack-hot-middleware")(compiler))

const currentDir = path.dirname(require.main.filename)

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
    useBundledAssets: !isLocal || isDeploying
  })
})

if (isLocal && !isDeploying) {
  app.listen(port)
}

module.exports = app