// Note: You must restart bin/webpack-dev-server for changes to take effect
'use strict';

/* eslint global-require: 0 */

const merge = require('webpack-merge');
const webpack = require('webpack');
const sharedConfig = require('./shared.js');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = merge(sharedConfig, {
  output: { filename: '[name]-[chunkhash].js' },
  devtool: 'source-map',
  stats: 'normal',

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize:  true,
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
