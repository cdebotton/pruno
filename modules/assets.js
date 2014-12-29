'use strict';

var pruno = require('..');

pruno.extend('assets', function(src) {
  var config = pruno.config;
  var gulp = config.gulp;

  gulp.task('assets', function() {
    var sources = src.map(function(entry) {
      return entry.replace(/^(\!?)(.+)$/, function(str, p1, p2) {
        return p1 + config.srcDir + p2;
      });
    });

    return gulp.src(sources)
      .pipe(gulp.dest(config.output));
  });

  config.registerWatcher('assets', src);
  config.queueTask('assets');
});
