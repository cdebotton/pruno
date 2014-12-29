'use strict';

var pruno = require('..');
var Notification = require('./helpers/notification');

pruno.extend('images', function(src, dest) {
  var imagemin = require('gulp-imagemin');
  var pngcrush = require('imagemin-pngcrush');
  var config = pruno.config;
  var gulp = config.gulp;

  gulp.task('images', function() {
    gulp.src(config.srcDir + src)
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewbox: false}],
        use: [pngcrush()]
      }))
      .pipe(gulp.dest(config.output + dest))
      .pipe(new Notification().message('Images Optimized'));
  });

  config.registerWatcher('images', config.srcDir + src);
  config.queueTask('images');
});
