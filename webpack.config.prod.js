const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: ['./src/SlackFeedback.js'],
  output: {
    path: path.join(__dirname, 'lib'),
    publicPath: path.join(__dirname, 'lib'),
    filename: 'SlackFeedback.js',
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

  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    },
    {
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      }
    }
  ]
};
