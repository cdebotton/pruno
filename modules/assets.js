'use strict';

var pruno = require('..');
var assign = require('object-assign');
var assignVars = require('./helpers/assignVars');

var defaults = {
  sources: [
    '!::src/assets/images/**/*',
    '::src/assets/**/*'
  ],
  dist: '::output/'
};

pruno.extend('assets', function(params) {
  var config = pruno.config;
  var gulp = config.gulp;

  if (config.defaultOptions.assets) {
    params = assign({}, config.defaultOptions.assets, params);
  }

  var options = assign({}, defaults, params);

  options = assignVars(options);

  gulp.task('assets', function() {
    return gulp.src(options.sources)
      .pipe(gulp.dest(options.dist));
  });

  config.registerWatcher('assets', options.sources);
  config.queueTask('assets');
});
