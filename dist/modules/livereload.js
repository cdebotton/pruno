"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var pruno = _interopRequire(require(".."));

var livereload = _interopRequire(require("gulp-livereload"));

var Notification = _interopRequire(require("../utils/notification"));

var LiveReloadTask = (function () {
  function LiveReloadTask() {
    var params = arguments[0] === undefined ? {} : arguments[0];
    this.params = params;
  }

  _prototypeProperties(LiveReloadTask, {
    getDefaults: {
      value: function getDefaults() {
        return {
          search: ["::dist/**/*", "./api/**/*"]
        };
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  }, {
    generateWatcher: {
      value: function generateWatcher(gulp, params) {
        livereload.listen();

        return function () {
          gulp.watch(params.search, function () {
            gulp.src(params.search).pipe(livereload()).pipe(new Notification().message("Server Reload Started"));
          });
        };
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return LiveReloadTask;
})();

module.exports = pruno.extend(LiveReloadTask);