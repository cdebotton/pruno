'use strict';

var path = require('path');
var streamqueue = require('streamqueue');
var plugins = require('gulp-load-plugins')();
var Notification = require('./notification');
var utilities = require('./utilities');
var config = require('../../').config;

module.exports = function(options) {
  var gulp = config.gulp;

  var onError = function(e) {
    new Notification().error(e, options.compiler + ' Compilation Failed!');
    this.emit('end');
  };

  var params = options.pluginOptions;
  try {
    var cssPattern = /^(.+\/)(.+\.css)$/;
    var dist = params.dist.match(cssPattern)[1];
    var fileName = params.dist.match(cssPattern)[2];
  }
  catch (err) {
    throw new Error('Invalid css dist file');
  }

  gulp.task(options.pluginName, function() {
    var stream = streamqueue({objectMode: true});

    stream.pipe(plugins.if(
      params['source-maps'],
      plugins.sourcemaps.init({
        loadMaps: true
      })
    ));

    var basedir = path.dirname(require.resolve('../../'));

    if (params.normalize) {
      stream.queue(gulp.src(path.join(
        basedir,
        'node_modules/normalize.css/normalize.css'
      )));
    }

    if (params['font-awesome']) {
      stream.queue(gulp.src(path.join(
        basedir,
        'node_modules/font-awesome/css/font-awesome.css'
      )));
    }

    stream.queue(
      gulp.src(params.entry)
        .pipe(plugins[options.pluginName](params)).on('error', onError)
    );

    return stream.done()
      .pipe(plugins.concat(fileName))
      .pipe(plugins.if(params.minify, plugins.minifyCss()))
      .pipe(plugins.if(params['source-maps'], plugins.sourcemaps.write()))
      .pipe(gulp.dest(dist))
      .pipe(new Notification().message(options.compiler + ' Compiled!'));
  });

  config.registerWatcher(
    options.pluginName,
    params.search
  );

  return config.queueTask(options.pluginName);
};
