'use strict';

var pruno = require('..');
var Notification = require('./helpers/notification');

pruno.extend('publish', function(src, dest) {
  var config = pruno.config;
  var gulp = config.gulp;

  gulp.task('publish', function() {
    return gulp.src(src)
      .pipe(gulp.dest(config.output + dest))
      .pipe(new Notification().message('Published ' + src));
  });

  config.registerWatcher('publish', src);
  return config.queueTask('publish');
});
