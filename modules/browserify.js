'use strict';

var path = require('path');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var envify = require('envify/custom');
var to5ify = require('6to5ify');
var to5Runtime = require('./helpers/addTo5Runtime');
var plugins = require('gulp-load-plugins')();
var Notification = require('./helpers/notification');
var koaServer = require('./helpers/koa-server');
var pruno = require('..');
var config = pruno.config;
var gulp = config.gulp;

var PLUGIN_NAME = 'browserify';
var SEARCH = path.join(config.srcDir, '**/*.js');

pruno.extend(PLUGIN_NAME, function(src, output, params) {
  src = src || 'index.js';

  var onError = function(e) {
    new Notification().error(e, 'Browserify Compilation Failed!');
    this.emit('end');
  };

  function bundle(bundler) {
    var hasServer = config.tasks.indexOf('koa') > -1;

    return bundler.bundle()
      .on('error', onError)
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(plugins.if(config.production, plugins.uglify()))
      .pipe(plugins.if(!config.production, plugins.sourcemaps.init()))
      .pipe(plugins.if(!config.production, plugins.sourcemaps.write()))
      .pipe(plugins.if(config.production, plugins.rename({suffix: '.min'})))
      .pipe(gulp.dest(config.output))
      .pipe(new Notification().message('Browserify completed successfull!'));
  }

  function transform(bundler) {
    bundler.transform(to5Runtime);
    bundler.transform(envify({NODE_ENV: 'development'}));
    bundler.transform(to5ify);

    return bundler;
  }

  gulp.task(PLUGIN_NAME, function() {
    watchify.args.entry = true;
    watchify.args.fullPaths = false;

    var bundler = browserify(
      './' + path.join(config.srcDir, src),
      watchify.args
    );
    bundler = transform(bundler);

    return bundle.call(bundle, bundler);
  });

  gulp.task(PLUGIN_NAME+':watch', function() {
    watchify.args.entry = true;
    watchify.args.fullPaths = false;
    watchify.args.debug = true;

    var bundler = watchify(browserify(
      './' + path.join(config.srcDir, src),
      watchify.args
    ));
    bundler = transform(bundler);

    bundler.on('update', bundle.bind(bundle, bundler));

    return bundle.call(bundle, bundler);
  });

  return config.queueTask(PLUGIN_NAME);
});
