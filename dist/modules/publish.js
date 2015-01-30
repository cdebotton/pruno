"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var pruno = _interopRequire(require(".."));

var loadPlugins = _interopRequire(require("gulp-load-plugins"));

var pngcrush = _interopRequire(require("imagemin-pngcrush"));

var pkg = _interopRequire(require("../utils/pkg"));

var plugins = loadPlugins();

var PublishTask = (function () {
  function PublishTask(params) {
    this.params = params;
  }

  _prototypeProperties(PublishTask, {
    getDefaults: {
      value: function getDefaults() {
        return {
          pkg: false,
          "image-min": true,
          src: ["::src/assets/**/*"],
          dist: "::dist"
        };
      },
      writable: true,
      configurable: true
    }
  }, {
    enqueue: {
      value: function enqueue(gulp) {
        var params = arguments[1] === undefined ? {} : arguments[1];
        var sources = Array.isArray(params.src) ? params.src : [params.src];
        if (params.pkg) {
          sources = sources.map(function (src) {
            return pkg(params.pkg, src);
          });
        }

        return gulp.src(sources).pipe(plugins["if"](params["image-min"], plugins.imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewbox: false }],
          use: [pngcrush()]
        }))).pipe(gulp.dest(params.dist));
      },
      writable: true,
      configurable: true
    },
    generateWatcher: {
      value: function generateWatcher(gulp) {
        var params = arguments[1] === undefined ? {} : arguments[1];
        return true;
      },
      writable: true,
      configurable: true
    }
  });

  return PublishTask;
})();

module.exports = pruno.extend(PublishTask);