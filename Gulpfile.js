'use strict';

var gulp = require('gulp');
var to5 = require('gulp-6to5');
var del = require('del');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');

gulp.task('del', function() {
  del(['./dist']);
});

gulp.task('6to5', function() {
  gulp.src('./src/**/*.js')
    .pipe(to5())
    .pipe(plumber())
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', function() {
  runSequence(['del', '6to5']);
});

gulp.task('watch', function() {
  runSequence(['del', '6to5']);
  gulp.watch('./src/**/*.js', ['6to5']);
});
