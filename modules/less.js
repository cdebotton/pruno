'use strict';

var assign = require('object-assign');
var util = require('gulp-util');
var pruno = require('..');
var config = pruno.config;
var compile = require('./helpers/compileCSS');

pruno.extend('less', function(src, output, options) {
  return compile({
    compiler: 'LESS',
    pluginName: 'less',
    pluginOptions: options,
    src: src,
    output: output,
    search: '**/*.less',
    normalize: true,
    fontAwesome: true
  });
});
