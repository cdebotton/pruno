'use strict';

var Notification = require('./helpers/notification');
var pruno = require('..');
var config = pruno.config;
var gulp = config.gulp;

pruno.extend('koa', function(src, options) {
  var koaServer = require('./helpers/koa-server');
  var env = config.production ? 'production' : 'development';

  gulp.task('koa', function() {
    gulp.src('.', {read: false})
      .pipe(new Notification().message('Server Started'));

    koaServer.run({
      file: src,
      env: env
    });
  });

  config.queueTask('koa');
});
