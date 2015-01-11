"use strict";

var _slicedToArray = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else {
    var _arr = [];

    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  }
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

module.exports = compileCSS;
var loadPlugins = _interopRequire(require("gulp-load-plugins"));

var streamqueue = _interopRequire(require("streamqueue"));

var Notification = _interopRequire(require("./notification"));

var getType = _interopRequire(require("./getType"));

var pkg = _interopRequire(require("./pkg"));

var path = _interopRequire(require("path"));

var plugins = loadPlugins();

function compileCSS(args) {
  var gulp = args.gulp;
  var compiler = args.compiler;
  var opts = args.opts;
  var params = args.params;
  var _params$dist$match = params.dist.match(/^(.+\/)(.+\.css)$/);

  var _params$dist$match2 = _slicedToArray(_params$dist$match, 3);

  var dist = _params$dist$match2[0];
  var distDir = _params$dist$match2[1];
  var fileName = _params$dist$match2[2];


  var stream = streamqueue({ objectMode: true });

  stream.pipe(plugins["if"](params["source-maps"], plugins.sourcemaps.init({ loadMaps: true })));

  if (params.normalize) {
    stream.queue(gulp.src(pkg("normalize.css", "normalize.css")));
  }

  if (params["font-awesome"]) {
    stream.queue(gulp.src(pkg("font-awesome", "css/font-awesome.css")));
  }

  stream.queue(gulp.src(params.entry).pipe(plugins[compiler](opts)));

  return stream.done().pipe(plugins.concat(fileName)).pipe(plugins["if"](params.minify, plugins.minifyCss())).pipe(plugins["if"](params["source-maps"], plugins.sourcemaps.write())).pipe(gulp.dest(distDir)).pipe(new Notification().message("Task `" + compiler.replace(/^(.)/, function () {
    var parts = [];

    for (var _key = 0; _key < arguments.length; _key++) {
      parts[_key] = arguments[_key];
    }

    return parts[1].toUpperCase();
  }) + "` Compiled!"));
}