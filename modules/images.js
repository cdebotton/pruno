'use strict';

var assign = require('object-assign');
var pruno = require('..');
var Notification = require('./helpers/notification');

var defaults = {
  src: './app/assets/img/**/*',
  dist: './public/img/',
  use: ['imagemin-pngcrush']
};

pruno.extend('images', function(params) {
  var options = assign({}, defaults, params);
  var imagemin = require('gulp-imagemin');
  var config = pruno.config;
  var gulp = config.gulp;

  options.use = options.use.map(function(moduleName) {
    try {
      return require(moduleName)();
    }
    catch (err) {
      console.log('Module `%s` does not exist', moduleName);
    }
  });

  gulp.task('images', function() {
    gulp.src(options.src)
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewbox: false}],
        use: options.use || []
      }))
      .pipe(gulp.dest(options.dist))
      .pipe(new Notification().message('Images Optimized'));
  });

  config.registerWatcher('images', options.src);
  config.queueTask('images');
});
