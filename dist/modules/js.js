"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var assign = _interopRequire(require("object-assign"));

var buffer = _interopRequire(require("vinyl-buffer"));

var source = _interopRequire(require("vinyl-source-stream"));

var browserify = _interopRequire(require("browserify"));

var watchify = _interopRequire(require("watchify"));

var envify = _interopRequire(require("envify/custom"));

var to6ify = _interopRequire(require("6to5ify"));

// import to5Runtime from './helpers/addTo5Runtime';
var loadPlugins = _interopRequire(require("gulp-load-plugins"));

// import Notification from './helpers/Notification';
// import koaServer from './helpers/koa-server';


var plugins = loadPlugins();

var JS = function JS(params) {
  this.params = params;
};

JS.getDefaults = function () {
  return {
    entry: "::src/index.js",
    dist: "::dist/bundle.js",
    uglify: false,
    "source-maps": true,
    es6: false,
    runtime: false
  };
};

JS.prototype.enqueue = function (gulp) {
  var params = arguments[1] === undefined ? {} : arguments[1];
  var args = assign({}, watchify.args);
  args.entry = true;
  args.fullPaths = false;

  var bundler = browserify(params.entry, args);

  return bundle(gulp, bundler, params);
};

JS.prototype.watch = function () {
  var args = assign({}, watchify.args);
  args.entry = true;
  args.fullPaths = true;
  args.debug = true;

  var bundler = browserify(params.entry, args);

  bundler.on("update", bundle.bind(bundle, bundler));

  return bundle(bundler);
};

;

var onError = function (e) {
  console.error(e);
};

var bundle = function (gulp, bundler) {
  var params = arguments[2] === undefined ? {} : arguments[2];
  var path = params.dist.split("/");
  var fileName = path.pop();
  var dist = path.join("/");

  return bundler.bundle().on("error", onError).pipe(source(fileName)).pipe(buffer()).pipe(plugins["if"](params.uglify, plugins.uglify())).pipe(plugins["if"](params["source-maps"], plugins.sourcemaps.init({ loadMaps: true }))).pipe(plugins["if"](params["source-maps"], plugins.sourcemaps.write())).pipe(gulp.dest(dist));
};

module.exports = pruno.extend(JS);