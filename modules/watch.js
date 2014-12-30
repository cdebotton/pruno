'use strict';

var pruno = require('..');
var assign = require('object-assign');
var config = pruno.config;
var gulp = config.gulp;
var _ = require('lodash');
var inSequence = require('run-sequence').use(gulp);

var srcPaths;
var tasksToRun;
var filelessModules;

gulp.task('watch', function() {
  var filelessModules = _.intersection(config.tasks, ['koa', 'livereload']);
  srcPaths = config.watchers.default;

  tasksToRun = _.intersection(config.tasks, _.keys(srcPaths))
    .concat(['watch-assets'])
    .concat(filelessModules);

  if (config.tasks.indexOf('browserify') > -1) {
    tasksToRun = tasksToRun.concat(['browserify:watch']);
  }

  inSequence.apply(this, tasksToRun);
});

gulp.task('watch-assets', function() {
  for (var task in srcPaths) {
    gulp.watch(srcPaths[task], [task]);
  }
});
