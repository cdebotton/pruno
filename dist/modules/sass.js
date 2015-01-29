"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var pruno = _interopRequire(require(".."));

var path = _interopRequire(require("path"));

var compileCSS = _interopRequire(require("../utils/compileCSS"));

var getType = _interopRequire(require("../utils/getType"));

var distillOptions = _interopRequire(require("../utils/distillOptions"));

var SassTask = (function () {
  function SassTask(params) {
    this.params = params;
  }

  _prototypeProperties(SassTask, {
    getDefaults: {
      value: function getDefaults() {
        return {
          entry: "::src/sass/index.sass",
          dist: "::dist/stylesheets/app.css",
          search: ["::src/**/*.sass", "::src/**/*.scss"],
          minify: false,
          "source-maps": true,
          "font-awesome": false,
          normalize: false
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
        var opts = distillOptions(SassTask, params);

        return compileCSS({
          gulp: gulp,
          compiler: "sass",
          opts: opts,
          params: params
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    generateWatcher: {
      value: function generateWatcher(gulp, params) {
        return true;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return SassTask;
})();

module.exports = pruno.extend(SassTask);