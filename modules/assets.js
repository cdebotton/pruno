'use strict';

var pruno = require('..');
var assign = require('object-assign');

var defaults = {
  sources: [
    '!./app/assets/images/**/*',
    './app/assets/**/*'
  ],
  dist: './public/'
};

pruno.extend('assets', function(params) {
  var config = pruno.config;
  var gulp = config.gulp;

  defaults = config.defaultOptions.assets ?
    config.defaultOptions.assets :
    defaults;

  var options = assign({}, defaults, params);

  gulp.task('assets', function() {
    return gulp.src(options.sources)
      .pipe(gulp.dest(options.dist));
  });

  config.registerWatcher('assets', options.sources);
  config.queueTask('assets');
});
