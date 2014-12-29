'use strict';

var koaServer = require('./helpers/koa-server');
var Notification = require('./helpers/notification');
var pruno = require('..');
var config = pruno.config;
var gulp = config.gulp;

pruno.extend('livereload', function(watchers) {
  gulp.task('livereload', function() {
    gulp.src('.', {read: false})
      .pipe(new Notification().message('Server Reload Started'));

    gulp.watch(watchers, koaServer.notify);
  });

  config.queueTask('livereload');
});
