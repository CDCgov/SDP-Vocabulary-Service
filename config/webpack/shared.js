// Note: You must restart bin/webpack-dev-server for changes to take effect
'use strict';

/* eslint global-require: 0 */
/* eslint import/no-dynamic-require: 0 */

const webpack  = require('webpack');
const extname  = require('path-complete-extname');
const { sync } = require('glob');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { env, settings, output, loadersDir } = require('./configuration.js');
const { basename, dirname, join, relative, resolve } = require('path');

const extensionGlob = `**/*{${settings.extensions.join(',')}}*`;
const entryPath = join(settings.source_path, settings.source_entry_path);
const packPaths = sync(join(entryPath, extensionGlob));

var sharedConfig = {
  entry: packPaths.reduce(
    (map, entry) => {
      const localMap  = map;
      const namespace = relative(join(entryPath), dirname(entry));
      localMap[join(namespace, basename(entry, extname(entry)))] = resolve(entry);
      return localMap;
    }, {}
  ),

  output: {
    path: output.path,
    filename: '[name].js',
    publicPath: output.publicPath
  },

  module: {
    rules: sync(join(loadersDir, '*.js')).map(loader => require(loader))
  },

  plugins: [
    new webpack.EnvironmentPlugin(JSON.parse(JSON.stringify(env))),
    new ExtractTextPlugin(env.NODE_ENV === 'production' ? '[name]-[hash].css' : '[name].css'),
    new ManifestPlugin({
      publicPath: output.publicPath,
      writeToFileEmit: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['landing','babel-polyfill'],
      minChunks: 2
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new webpack.DefinePlugin({
      DISABLE_USER_REGISTRATION: JSON.stringify(process.env.DISABLE_USER_REGISTRATION || 'false')
    }),
  ],

  resolve: {
    extensions: settings.extensions,
    modules: [
      resolve(settings.source_path),
      'node_modules'
    ]
  },

  resolveLoader: {
    modules: ['node_modules']
  }
};

module.exports = sharedConfig;