const path = require("path");
const express = require("express");
const isDeveloping = process.env.NODE_ENV !== "production";
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();
if (isDeveloping) {
  let webpack = require("webpack");
  let webpackMiddleware = require("webpack-dev-middleware");
  let webpackHotMiddleware = require("webpack-hot-middleware");
  let config = require("./webpack.config.js");
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true,
    quiet: false,
    lazy: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
    stats: {
      colors: true
    }
  });
  const bundlePath = path.join(__dirname, "./dist/index.html");
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get("*", function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(bundlePath));
    res.end();
  });
} else {
  app.use(express.static(__dirname + "./dist"));
  app.get("*", function response(req, res) {
    res.sendFile(path.join(__dirname, "./dist/index.html"));
  });
}
app.listen(port, "0.0.0.0", function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info(
    "==> � Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.",
    port,
    port
  );
});
