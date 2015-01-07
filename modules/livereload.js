'use strict';

var koaServer = require('./helpers/koa-server');
var Notification = require('./helpers/notification');
var pruno = require('..');
var config = pruno.config;
var gulp = config.gulp;

var defaultWatchers = ['::output/**/*', './api/**/*'];

pruno.extend('livereload', function(params) {
  var watchers = params || defaultWatchers;

  gulp.task('livereload', function() {
    gulp.src('.', {read: false})
      .pipe(new Notification().message('Server Reload Started'));

    gulp.watch(watchers, koaServer.notify);
  });

  config.queueTask('livereload');
});
