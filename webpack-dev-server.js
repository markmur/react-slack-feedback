const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

const PORT = process.env.PORT || 8080;

new WebpackDevServer(webpack(config), {
  hot: true,
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  noInfo: true,
  proxy: {
    '/api/*': {
      target: `http://localhost:${PORT + 1}/`,
      rewrite(req) {
        req.url = req.url.replace(/^\/api/, '');
      }
    }
  }
}).listen(PORT, 'localhost', err => {
  if (err) {
    return console.log(err);
  }

  console.log(`Listening at http://localhost:${PORT}`);
});
