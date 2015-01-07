'use strict';

var assign = require('object-assign');
var pruno = require('..');
var Notification = require('./helpers/notification');
var assignVars = require('./helpers/assignVars');

var defaultParams = {
  src: null,
  dist: null
};

pruno.extend('publish', function(params) {
  var config = pruno.config;
  var gulp = config.gulp;

  params || (params = {});

  if (config.defaultOptions.publish) {
    params = assign({}. config.defaultOptions.publish, params);
  }

  var options = assign({}, defaultParams, params);
  options = assignVars(options);

  if (! (options.src && options.dist)) {
    throw new Error(
      'pruno.publish(...) requires an object with src and dist ' +
      'properties.'
    );
  }

  gulp.task('publish', function() {
    return gulp.src(options.src)
      .pipe(gulp.dest(options.dist))
      .pipe(new Notification().message('Published ' + options.src));
  });

  config.registerWatcher('publish', options.src);
  return config.queueTask('publish');
});
