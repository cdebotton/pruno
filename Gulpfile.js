'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');

gulp.task('del', function() {
  del(['./dist']);
});

gulp.task('babel', function() {
  gulp.src('./src/**/*.js')
    .pipe(babel())
    .pipe(plumber())
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', function() {
  runSequence(['del', 'babel']);
});

gulp.task('watch', function() {
  runSequence(['del', 'babel']);
  gulp.watch('./src/**/*.js', ['babel']);
});
