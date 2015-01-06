'use strict';

var assign = require('object-assign');
var Notification = require('./helpers/notification');
var pruno = require('..');
var config = pruno.config;
var gulp = config.gulp;

var defaults = {
  env: 'development',
  server: './server.js'
};

pruno.extend('koa', function(params) {
  var options = assign({}, defaults, params);
  var koaServer = require('./helpers/koa-server');
  var env = config.production ? 'production' : 'development';

  gulp.task('koa', function() {
    gulp.src('.', {read: false})
      .pipe(new Notification().message('Server Started'));

    koaServer.run({
      file: options.server,
      env: options.env
    });
  });

  config.queueTask('koa');
});
