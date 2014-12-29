'use strict';

var path = require('path');
var streamqueue = require('streamqueue');
var plugins = require('gulp-load-plugins')();
var Notification = require('./notification');
var utilities = require('./utilities');
var config = require('../../').config;

module.exports = function(options) {
  var gulp = config.gulp;
  var src = utilities.buildGulpSrc(
    options.src,
    config.srcDir + '/' + options.pluginName,
    options.search
  );

  var onError = function(e) {
    new Notification().error(e, options.compiler + ' Compilation Failed!');
    this.emit('end');
  };

  gulp.task(options.pluginName, function() {
    var stream = streamqueue({objectMode: true});

    stream.pipe(plugins.if(!config.production, plugins.sourcemaps.init({loadMaps: true})));

    var basedir = path.dirname(require.resolve('../../'));

    if (options.normalize) {
      stream.queue(gulp.src(path.join(
        basedir,
        'node_modules/normalize.css/normalize.css'
      )));
    }

    if (options.fontAwesome) {
      stream.queue(gulp.src(path.join(
        basedir,
        'node_modules/font-awesome/css/font-awesome.css'
      )));
    }

    stream.queue(
      gulp.src(src)
        .pipe(plugins[options.pluginName](options.pluginOptions)).on('error', onError)
    );

    return stream.done()
      .pipe(plugins.concat('app.css'))
      .pipe(plugins.if(config.production, plugins.rename({suffix: '.min'})))
      .pipe(plugins.if(config.production, plugins.minifyCss()))
      .pipe(plugins.if(!config.production, plugins.sourcemaps.write()))
      .pipe(gulp.dest(options.output || config.output + config.cssOutput))
      .pipe(new Notification().message(options.compiler + ' Compiled!'));
  });

  config.registerWatcher(
    options.pluginName,
    config.srcDir + '/' + options.pluginName + '/' + options.search
  );

  return config.queueTask(options.pluginName);
};
