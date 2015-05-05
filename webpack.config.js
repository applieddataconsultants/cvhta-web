'use strict'
let webpack = require('webpack')
let ExtractTextPlugin = require('extract-text-webpack-plugin')

const env = process.env.NODE_ENV || 'development'

let plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': env
  }),
  new ExtractTextPlugin('bundle.css')
]

if (env === 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  )
}

module.exports = {
  devtool: env === 'development' && 'inline-source-map',
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.less$/,
      exclude: /node_modules/,
      loader: ExtractTextPlugin.extract('css-loader', 'css-loader!less-loader')
    }, {
      test: /\.(eot|ttf|woff|woff2|svg|png)$/,
      loader: 'file-loader'
    }]
  },
  plugins: plugins,
  devServer: {
    contentBase: './dist',
    info: true,
    hot: true,
    inline: true,
    port: 3000
  }
}