'use strict';

var assign = require('object-assign');
var util = require('gulp-util');
var pruno = require('..');
var config = pruno.config;
var compile = require('./helpers/compileCSS');

var defaults = {
  'entry': './app/stylus/index.styl',
  'dist': './public/stylesheets/app.css',
  'search': './app/**/*.styl',
  'minify': false,
  'source-maps':true,
  'font-awesome': false,
  'normalize': false,
  'use': ['nib', 'jeet', 'rupture']
};

pruno.extend('stylus', function(params) {
  var options = assign({}, defaults, params);

  if (options.use) {
    options.use = options.use.map(function(module) {
      try {
        return require(module)();
      }
      catch (err) {
        console.log('Module `%s` not found.', module);
      }
    });
  }

  if (options['source-maps']) {
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
    pluginOptions: options
  });
});
