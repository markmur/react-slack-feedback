const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: ['./src/feedback.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: path.join(__dirname, 'dist'),
    filename: 'index.js',
    library: 'react-slack-feedback',
    libraryTarget: 'umd'
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    extensions: ['.js', '.json', '.css', '.scss']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpg|jpeg|svg)$/,
        loader: 'file-loader'
      }
    ]
  },

  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    'prop-types': 'prop-types'
  }
};
