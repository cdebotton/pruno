'use strict';

var assign = require('object-assign');
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

var defaults = {
  'entry': './app/index.js',
  'dist': './public/bundle.js',
  'uglify': false,
  'source-maps': true,
  'es6': false,
  'runtime': false
};

pruno.extend(PLUGIN_NAME, function(params) {
  params || (params = {});

  var options = assign({}, defaults, params);
  var bundlePattern = /^(.+\/)((.+)\.js)$/
  console.log(options.dist);
  try {
    var match = options.dist.match(bundlePattern);
    var dist = match[1];
    var fileName = match[2];
  }
  catch (err) {
    throw new Error('No target bundle file.');
  }

  var onError = function(e) {
    new Notification().error(e, 'Browserify Compilation Failed!');
    this.emit('end');
  };

  function bundle(bundler) {
    var hasServer = config.tasks.indexOf('koa') > -1;

    return bundler.bundle()
      .on('error', onError)
      .pipe(source(fileName))
      .pipe(buffer())
      .pipe(plugins.if(options.uglify, plugins.uglify()))
      .pipe(plugins.if(options['source-maps'], plugins.sourcemaps.init({loadMaps: true})))
      .pipe(plugins.if(options['source-maps'], plugins.sourcemaps.write()))
      .pipe(gulp.dest(dist))
      .pipe(new Notification().message('Browserify completed successfull!'));
  }

  function transform(bundler) {
    if (options.runtime) {
      bundler.transform(to5Runtime);
    }

    bundler.transform(envify({NODE_ENV: 'development'}));

    if (options.es6 || options.harmony || options.react) {
      bundler.transform(to5ify);
    }

    return bundler;
  }

  gulp.task(PLUGIN_NAME, function() {
    watchify.args.entry = true;
    watchify.args.fullPaths = false;

    var bundler = browserify(
      options.entry,
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
      options.entry,
      watchify.args
    ));
    bundler = transform(bundler);

    bundler.on('update', bundle.bind(bundle, bundler));

    return bundle.call(bundle, bundler);
  });

  return config.queueTask(PLUGIN_NAME);
});
