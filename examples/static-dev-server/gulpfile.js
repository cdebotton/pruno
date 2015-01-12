'use strict';

var gulp = require('pruno')
      .use(require('gulp'));

pruno(function(mix) {
  mix
    .stylus({
      entry: '::src/styles/index.styl'
    })
    .js()
    .livereload()
    .http();
});
