var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/SlackFeedback.js'
  ],
  output: {
    path: './lib',
    publicPath: path.join(__dirname, 'lib/'),
    filename: 'SlackFeedback.js',
    library: 'react-slack-feedback',
    libraryTarget: 'umd'
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
     new webpack.DefinePlugin({
       'process.env.NODE_ENV': JSON.stringify('production'),
     }),
     new webpack.optimize.UglifyJsPlugin({
       compressor: {
         screw_ie8: true,
         warnings: false
       }
     })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'autoprefixer', 'sass'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.(png|jpg|jpeg|svg)$/,
        loaders: ['file'],
        include: path.join(__dirname, 'src')
      }
    ]
  },
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react')
    }
  }
};
