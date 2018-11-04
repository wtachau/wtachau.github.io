"use strict";

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevMiddleware = _interopRequireDefault(require("webpack-dev-middleware"));

var _webpackConfig = _interopRequireDefault(require("./webpack.config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sslEnabled = true;
var isLocal = !process.env._HANDLER;
var isDeploying = !!process.env.DEPLOYING;

if (isLocal || isDeploying) {
  require('dotenv').load();
}

if (isLocal) {
  var _sslEnabled = false;
}

console.log(process.env);
console.log(isLocal);
console.log(isDeploying);

var express = require('express');

var app = express();

var path = require('path');

var port = 3000;
var compiler = (0, _webpack.default)(_webpackConfig.default);
app.use((0, _webpackDevMiddleware.default)(compiler, {
  noInfo: true,
  publicPath: _webpackConfig.default.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));
var currentDir = path.dirname(require.main.filename);
var options = {
  publicDir: path.join(__dirname, 'public'),
  viewsDir: path.join(__dirname, 'views'),
  domain: 's3-us-west-1.amazonaws.com/tachauwebsite',
  bucket: 'tachauwebsite',
  endpoint: 's3-us-west-1.amazonaws.com',
  key: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY,
  hostname: 'localhost',
  port: sslEnabled ? 443 : 1337,
  ssl: sslEnabled,
  production: true
};

var CDN = require('express-cdn')(app, options);

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.locals.CDN = CDN();
app.get('/', function (req, res) {
  res.render('home', {
    useBundledAssets: !isLocal || isDeploying
  });
});

if (isLocal && !isDeploying) {
  app.listen(port);
}

module.exports = app;
