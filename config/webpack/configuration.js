// Common configuration for webpacker loaded from config/webpacker.yml
'use strict';

const { env } = require('process');
const { safeLoad } = require('js-yaml');
const { readFileSync } = require('fs');
const { join, resolve } = require('path');

const configPath = resolve('config', 'webpacker.yml');
const loadersDir = join(__dirname, 'loaders');
const settings = safeLoad(readFileSync(configPath), 'utf8')[env.NODE_ENV];

function removeOuterSlashes(string) {
  return string.replace(/^\/*/, '').replace(/\/*$/, '');
}

function formatPublicPath(host = '', path = '') {
  let formattedHost = removeOuterSlashes(host);
  if (formattedHost && !/^http/i.test(formattedHost)) {
    formattedHost = `//${formattedHost}`;
  }
  const formattedPath = removeOuterSlashes(path);
  return `${formattedHost}/${formattedPath}/`;
}

const output = {
  path: resolve('public', settings.public_output_path),
  publicPath: formatPublicPath(env.ASSET_HOST, settings.public_output_path)
};

// Setting this in development.js doesn't work for some reason?
if (process.env.NODE_ENV !== 'production'){
  output.publicPath = 'http://' + settings.dev_server.host + ':' + settings.dev_server.port + '/webpack/';
}

module.exports = {
  settings,
  env,
  loadersDir,
  output
};
