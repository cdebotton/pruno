'use strict';

var pruno = require('..');
var del = require('del');

var defaults = ['./public/'];

pruno.extend('del', function(params) {
  var config = pruno.config;
  var gulp = config.gulp;

  var options = [defaults, config.defaultOptions.del, params]
    .reduce(function(memo, opts) {
      return opts || (Array.isArray(memo) ? memo : [memo]);
    }, null);

  var toRemove = Array.isArray(params) ?
    params : defaults;

  gulp.task('del', function(cb) {
    del(toRemove, cb);
  });

  return config.queueTask('del');
});
