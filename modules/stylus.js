'use strict';

var assign = require('object-assign');
var util = require('gulp-util');
var pruno = require('..');
var config = pruno.config;
var compile = require('./helpers/compileCSS');
var assignVars = require('./helpers/assignVars');

var defaults = {
  'entry': '::src/stylus/index.styl',
  'dist': '::output/stylesheets/app.css',
  'search': '::src/**/*.styl',
  'minify': false,
  'source-maps':true,
  'font-awesome': false,
  'normalize': false,
  'use': ['nib', 'jeet', 'rupture']
};

pruno.extend('stylus', function(params) {
  if (config.defaultOptions.stylus) {
    params = assign(
      config.defaultOptions.stylus,
      params
    );
  }

  var options = assign({}, defaults, params);
  options = assignVars(options);

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
