"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var pruno = _interopRequire(require(".."));

var path = _interopRequire(require("path"));

var compileCSS = _interopRequire(require("../utils/compileCSS"));

var getType = _interopRequire(require("../utils/getType"));

var distillOptions = _interopRequire(require("../utils/distillOptions"));

var StylusTask = (function () {
  function StylusTask(params) {
    this.params = params;
  }

  _prototypeProperties(StylusTask, {
    getDefaults: {
      value: function getDefaults() {
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
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  }, {
    enqueue: {
      value: function enqueue(gulp) {
        var params = arguments[1] === undefined ? {} : arguments[1];
        var opts = distillOptions(StylusTask, params);

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

        return compileCSS({
          gulp: gulp,
          compiler: "stylus",
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

  return StylusTask;
})();

module.exports = pruno.extend(StylusTask);