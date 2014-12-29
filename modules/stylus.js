'use strict';

var assign = require('object-assign');
var util = require('gulp-util');
var nib = require('nib');
var jeet = require('jeet');
var rupture = require('rupture');
var pruno = require('..');
var config = pruno.config;
var compile = require('./helpers/compileCSS');

pruno.extend('stylus', function(src, output, params) {
  var options = assign({
    use: [nib(), jeet(), rupture()]
  }, params);

  if (! config.production) {
    options = assign(options, {
      sourcemap: {
        inline: true,
        sourceRoot: '.'
      }
    });
  }

  return compile({
    compiler: 'Stylus',
    pluginName: 'stylus',
    pluginOptions: options,
    src: src,
    output: output,
    search: '**/*.styl',
    normalize: true,
    fontAwesome: true
  });
});
