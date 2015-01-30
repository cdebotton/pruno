"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var pruno = _interopRequire(require(".."));

var distillOptions = _interopRequire(require("../utils/distillOptions"));

var plugins = require("gulp-load-plugins")();

var LintTask = (function () {
  function LintTask() {
    var params = arguments[0] === undefined ? {} : arguments[0];
    this.params = params;
  }

  _prototypeProperties(LintTask, {
    getDefaults: {
      value: function getDefaults() {
        return {
          search: ["::src/**/*.js", "::src/**/*.jsx", "::src/**/*.es6"]
        };
      },
      writable: true,
      configurable: true
    }
  }, {
    enqueue: {
      value: function enqueue(gulp, params) {
        var opts = distillOptions(LintTask, params);

        gulp.src(params.search).pipe(plugins.plumber()).pipe(plugins.eslint(opts)).pipe(plugins.eslint.format()).pipe(plugins.eslint.failOnError());
      },
      writable: true,
      configurable: true
    },
    generateWatcher: {
      value: function generateWatcher(gulp, params) {
        return true;
      },
      writable: true,
      configurable: true
    }
  });

  return LintTask;
})();

module.exports = pruno.extend(LintTask);