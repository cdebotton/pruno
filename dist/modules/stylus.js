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

var pruno = _interopRequire(require(".."));

var path = _interopRequire(require("path"));

var Notification = _interopRequire(require("../utils/notification"));

var streamqueue = _interopRequire(require("streamqueue"));

var getType = _interopRequire(require("../utils/getType"));

var loadPlugins = _interopRequire(require("gulp-load-plugins"));

var plugins = loadPlugins();

var StylusTask = function StylusTask(params) {
  this.params = params;
};

StylusTask.getDefaults = function () {
  return {
    entry: "::src/stylus/index.styl",
    dist: "::dist/stylesheets/app.css",
    search: "::src/**/*.styl",
    minify: false,
    "source-maps": true,
    "font-awesome": false,
    normalize: false,
    use: ["nib", "jeet", "rupture"]
  };
};

StylusTask.prototype.enqueue = function (gulp) {
  var params = arguments[1] === undefined ? {} : arguments[1];
  var _params$dist$match = params.dist.match(/^(.+\/)(.+\.css)$/);

  var _params$dist$match2 = _slicedToArray(_params$dist$match, 3);

  var dist = _params$dist$match2[0];
  var distDir = _params$dist$match2[1];
  var fileName = _params$dist$match2[2];


  var opts = {};

  if (params["source-maps"]) {
    opts.sourcemap = {
      inline: true,
      sourceRoot: "."
    };
  }

  if (params.use && getType(params.use) === "array") {
    opts.use = params.use.map(function (m) {
      return require(m)();
    });
  }

  var stream = streamqueue({ objectMode: true });

  stream.pipe(plugins["if"](params["source-maps"], plugins.sourcemaps.init({ loadMaps: true })));

  var basedir = path.dirname(require.resolve("../../"));

  if (params.normalize) {
    stream.queue(gulp.src(path.join(basedir, "node_modules/normalize.css/normalize.css")));
  }

  if (params["font-awesome"]) {
    stream.queue(gulp.src(path.join(basedir, "node_modules/font-awesome/css/font-awesome.css")));
  }

  stream.queue(gulp.src(params.entry).pipe(plugins.stylus(opts)));

  return stream.done().pipe(plugins.concat(fileName)).pipe(plugins["if"](params.minify, plugins.minifyCss())).pipe(plugins["if"](params["source-maps"], plugins.sourcemaps.write())).pipe(gulp.dest(distDir)).pipe(new Notification().message("Stylus Compiled!"));
};

StylusTask.prototype.generateWatcher = function (gulp, params) {
  return Array.isArray(params.search) ? params.search : [params.search];
};

module.exports = pruno.extend(StylusTask);