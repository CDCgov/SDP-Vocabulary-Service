// Example webpack configuration with asset fingerprinting in production.
'use strict';

var path = require('path');
var webpack = require('webpack');
var StatsPlugin = require('stats-webpack-plugin');
var autoprefixer = require('autoprefixer');

// must match config.webpack.dev_server.port
var devServerPort = 3808;

// set NODE_ENV=production on the environment to add asset fingerprints
var production = process.env.NODE_ENV === 'production';

var config = {


  entry: {
    // Sources are expected to live in $app_root/webpack
    'application': './webpack/application.js',
    'response_set': './webpack/response_set.js',
    'forms': './webpack/forms.js',
    'my_stuff': './webpack/my_stuff.js',
    'form_list': './webpack/form_list.js',
    'question_list': './webpack/question_list.js',
    'question_form': './webpack/question_form.js',
    'response_set_list': './webpack/response_set_list.js',
    'search': './webpack/search.js',
    'bootstrap': 'bootstrap-loader',
    'babel-polyfill': 'babel-polyfill',
    'question': './webpack/question.js',
    'notification_menu': './webpack/notification_menu.js',
    'notification_dropdown': './webpack/notification_dropdown.js',
    'landing': './webpack/landing.js'
    },

  output: {
    // Build assets directly in to public/webpack/, let webpack know
    // that all webpacked assets start with webpack/

    // must match config.webpack.output_dir
    path: path.join(__dirname, '..', 'public', 'webpack'),
    publicPath: '/webpack/',

    filename: production ? '[name]-[chunkhash].js' : '[name].js',

    // export itself to a global var
    libraryTarget: "var",
    // name of the global var: "SDP"
    library: "SDP"
  },

  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],

  module: {
    preLoaders: [
    { test: /\.erb$/, loader: 'rails-erb-loader' },
    ],
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.css$/, loaders: ['style', 'css', 'postcss'] },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=assets/[name].[ext]' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=8192' },
      { test: /\.scss$/, loaders: ['style', 'css', 'postcss', 'sass'] }
    ]
  },

  resolve: {
    root: path.join(__dirname, '..', 'webpack')
  },

  plugins: [
    // must match config.webpack.manifest_filename
    new StatsPlugin('manifest.json', {
      // We only need assetsByChunkName
      chunkModules: false,
      source: false,
      chunks: false,
      modules: false,
      assets: true
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })]
};

if (production) {
  config.plugins.push(
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: { warnings: false },
      sourceMap: false
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  );
} else {
  config.devServer = {
    port: devServerPort,
    headers: { 'Access-Control-Allow-Origin': '*' }
  };
  config.output.publicPath = '//localhost:' + devServerPort + '/webpack/';
  // Source maps
  config.devtool = 'cheap-module-eval-source-map';
}

module.exports = config;
