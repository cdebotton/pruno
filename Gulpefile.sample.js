'use strict';

var gulp = require('gulp');
var pruno = require('pruno').use(gulp);

pruno(function(runner) {
  runner.publish('./node_modules/font-awesome/fonts/*', '/fonts/');
  runner.images('/assets/images/**/*', 'images');
  runner.assets(['!/assets/images/**/*', '/assets/**/*']);
  runner.koa('api/index.js')
  runner.stylus('index.styl');
  runner.browserify();
  runner.livereload(['./public/**/*']);
});
