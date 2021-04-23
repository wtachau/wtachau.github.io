"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevMiddleware = _interopRequireDefault(require("webpack-dev-middleware"));

var _webpackHotMiddleware = _interopRequireDefault(require("webpack-hot-middleware"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _webpackDevelopmentConfig = _interopRequireDefault(require("./webpack.development.config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var isLocal = !process.env._HANDLER;
var isDeploying = !!process.env.DEPLOYING;
var isDevelopment = isLocal && !isDeploying;

if (isLocal) {
  _dotenv["default"].load();
}

var app = (0, _express["default"])();

if (isDevelopment) {
  var compiler = (0, _webpack["default"])(_webpackDevelopmentConfig["default"]);
  app.use((0, _webpackDevMiddleware["default"])(compiler, {
    noInfo: true,
    publicPath: _webpackDevelopmentConfig["default"].output.publicPath
  }));
  app.use((0, _webpackHotMiddleware["default"])(compiler));
}

app.set("view engine", "pug");
app.use(_express["default"]["static"](_path["default"].join(__dirname, "public")));
app.get("/", function (req, res) {
  res.render("home", {
    useBundledAssets: !isDevelopment
  });
});

if (isLocal && !isDeploying) {
  app.listen(process.env.PORT || 3000);
}

module.exports = app;
