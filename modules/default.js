'use strict';

var _ = require('lodash');
var config = require('../').config;
var gulp = config.gulp;
var runSequence = require('run-sequence').use(gulp);

if ('undefined' === typeof config.gulp) {
  throw ReferenceError('Please provide a gulp instance with pruno.use(...)');
}

gulp.task('default', function() {
  var tasks = _.without(config.tasks, 'koa', 'livereload');
  runSequence.apply(this, tasks);
});
