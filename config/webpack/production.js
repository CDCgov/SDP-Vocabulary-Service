// Note: You must restart bin/webpack-dev-server for changes to take effect

/* eslint global-require: 0 */

const webpack = require('webpack');
const merge = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin');
const sharedConfig = require('./shared.js');

module.exports = merge(sharedConfig, {
  entry: {
    // Sources are expected to live in $app_root/webpack
    'babel-polyfill': 'babel-polyfill',
    'landing': './webpack/landing.js'
  },

  output: { filename: '[name]-[chunkhash].js' },
  devtool: 'source-map',
  stats: 'normal',

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: false,

      compress: {
        warnings: false
      },

      output: {
        comments: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
      DISABLE_USER_REGISTRATION: JSON.stringify(process.env.DISABLE_USER_REGISTRATION || 'false')
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html|json|ico|svg|eot|otf|ttf)$/
    })
  ]
});
