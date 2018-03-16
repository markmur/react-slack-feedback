const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  noInfo: true,
  proxy: {
    '/api/*': {
      target: 'http://localhost:3001/',
      rewrite: function(req) {
        req.url = req.url.replace(/^\/api/, '');
      }
    }
  }
}).listen(3000, 'localhost', (err, result) => {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://localhost:3000/');
});
