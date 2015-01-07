'use strict';

var assign = require('object-assign');
var pruno = require('..');
var Notification = require('./helpers/notification');
var assignVars = require('./helpers/assignVars');

var defaults = {
  src: '::src/assets/img/**/*',
  dist: '::output/img/',
  use: ['imagemin-pngcrush']
};

pruno.extend('images', function(params) {
  var config = pruno.config;
  var gulp = config.gulp;

  params || (params = {});

  if (config.defaultOptions.images) {
    params = assign({}, config.defaultOptions.images, params);
  }

  var options = assign({}, defaults, params);
  options = assignVars(options);
  var imagemin = require('gulp-imagemin');

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
