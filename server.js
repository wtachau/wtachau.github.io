import express from "express";
import path from "path";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import dotenv from "dotenv";

import webpackConfig from "./webpack.development.config.js";

const isLocal = !process.env._HANDLER;
const isDeploying = !!process.env.DEPLOYING;
const isDevelopment = isLocal && !isDeploying;

if (isLocal) {
  dotenv.load();
}

const app = express();

if (isDevelopment) {
  const compiler = webpack(webpackConfig);

  app.use(
    webpackMiddleware(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
    })
  );

  app.use(webpackHotMiddleware(compiler));
}

app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("home", {
    useBundledAssets: !isDevelopment,
  });
});

if (isLocal && !isDeploying) {
  app.listen(process.env.PORT || 3000);
}

module.exports = app;
