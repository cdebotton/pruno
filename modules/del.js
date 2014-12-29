'use strict';

var pruno = require('..');
var del = require('del');

pruno.extend('del', function(src) {
  var config = pruno.config;
  var gulp = config.gulp;

  gulp.task('del', function(cb) {
    del(src, cb);
  });

  return config.queueTask('del');
});
