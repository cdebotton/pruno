"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var pruno = _interopRequire(require(".."));

var path = _interopRequire(require("path"));

var compileCSS = _interopRequire(require("../utils/compileCSS"));

var getType = _interopRequire(require("../utils/getType"));

var distillOptions = _interopRequire(require("../utils/distillOptions"));

var LessTask = (function () {
  function LessTask(params) {
    this.params = params;
  }

  _prototypeProperties(LessTask, {
    getDefaults: {
      value: function getDefaults() {
        return {
          entry: "::src/less/index.less",
          dist: "::dist/stylesheets/app.css",
          search: "::src/**/*.less",
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
          compiler: "less",
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

  return LessTask;
})();

module.exports = pruno.extend(LessTask);