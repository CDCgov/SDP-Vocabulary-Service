// Note: You must restart bin/webpack-dev-server for changes to take effect

const merge = require('webpack-merge');
const sharedConfig = require('./shared.js');
const { settings, output } = require('./configuration.js');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = merge(sharedConfig, {
  entry: {
    // Sources are expected to live in $app_root/webpack
    'babel-polyfill': 'babel-polyfill',
    'landing': './webpack/landing.js'
  },

  devtool: 'cheap-eval-source-map',

  stats: {
    errorDetails: true
  },

  plugins: [
    new BundleAnalyzerPlugin()
  ],

  output: {
    pathinfo: true
  },

  devServer: {
    clientLogLevel: 'none',
    https: settings.dev_server.https,
    host: settings.dev_server.host,
    port: settings.dev_server.port,
    contentBase: output.path,
    publicPath: output.publicPath,
    compress: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/
    }
  }
});
