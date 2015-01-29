"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var pruno = _interopRequire(require(".."));

var assign = _interopRequire(require("object-assign"));

var buffer = _interopRequire(require("vinyl-buffer"));

var source = _interopRequire(require("vinyl-source-stream"));

var browserify = _interopRequire(require("browserify"));

var watchify = _interopRequire(require("watchify"));

var envify = _interopRequire(require("envify/custom"));

var to6ify = _interopRequire(require("6to5ify"));

var loadPlugins = _interopRequire(require("gulp-load-plugins"));

var to5Runtime = _interopRequire(require("../utils/addTo5Runtime"));

var Notification = _interopRequire(require("../utils/notification"));

var koaServer = _interopRequire(require("../utils/koaServer"));

var plugins = loadPlugins();

var JSTask = (function () {
  function JSTask(params) {
    this.params = params;
  }

  _prototypeProperties(JSTask, {
    getDefaults: {
      value: function getDefaults() {
        return {
          entry: "::src/index.js",
          dist: "::dist/bundle.js",
          uglify: false,
          "source-maps": true,
          es6: false,
          runtime: false
        };
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  }, {
    enqueue: {
      value: function enqueue(gulp) {
        var params = arguments[1] === undefined ? {} : arguments[1];
        var args = assign({}, watchify.args, {
          entry: true,
          fullPaths: false
        });

        var bundler = transform(browserify(params.entry, args), params);

        return bundle(gulp, bundler, params);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    generateWatcher: {
      value: function generateWatcher(gulp) {
        var params = arguments[1] === undefined ? {} : arguments[1];
        return function () {
          var args = assign({}, watchify.args, {
            entry: true,
            fullPaths: true,
            debug: true
          });

          var bundler = transform(watchify(browserify(params.entry, args)), params);
          bundler.on("update", bundle.bind(bundle, gulp, bundler, params));

          return bundle(gulp, bundler, params);
        };
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return JSTask;
})();

;

var onError = function (e) {
  new Notification().error(e, "Browserify Compilation Failed!");
  this.emit("end");
};

var bundle = function (gulp, bundler) {
  var params = arguments[2] === undefined ? {} : arguments[2];
  var path = params.dist.split("/");
  var fileName = path.pop();
  var dist = path.join("/");

  new Notification().message("Task `" + params.taskName + "` started!");

  return bundler.bundle().on("error", onError).pipe(source(fileName)).pipe(buffer()).pipe(plugins["if"](params.uglify, plugins.uglify())).pipe(plugins["if"](params["source-maps"], plugins.sourcemaps.init({ loadMaps: true }))).pipe(plugins["if"](params["source-maps"], plugins.sourcemaps.write())).pipe(gulp.dest(dist)).pipe(new Notification().message("Task `" + params.taskName + "` completed!"));
};

function transform(bundler, params) {
  if (params.runtime) {
    bundler.transform(to5Runtime);
  }

  bundler.transform(envify({ NODE_ENV: "development" }));

  if (params.es6 || params.harmony || params.react) {
    bundler.transform(to6ify);
  }

  return bundler;
}

module.exports = pruno.extend(JSTask);