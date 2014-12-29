'use strict';

var assign = require('object-assign');
var util = require('gulp-util');
var _ = require('lodash');
var pruno = require('..');
var config = pruno.config;
var compile = require('./helpers/compileCSS');

pruno.extend('sass', function(src, output, options) {
  options = _.extend({
    outputStyle: inProduction ? 'compressed' : 'nested',
    includePaths: [elixir.config.bowerDir + "/bootstrap-sass-official/assets/stylesheets"]
  }, options);

  return compile({
    compiler: 'SASS',
    pluginName: 'sass',
    pluginOptions: options,
    src: src,
    output: output,
    search: '**/*.sass',
    normalize: true,
    fontAwesome: true
  });
});
