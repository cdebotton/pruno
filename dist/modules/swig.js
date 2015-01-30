"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var pruno = _interopRequire(require(".."));

var distillOptions = _interopRequire(require("../utils/distillOptions"));

var compileTemplates = _interopRequire(require("../utils/compileTemplates"));

var SwigTask = (function () {
  function SwigTask() {
    var params = arguments[0] === undefined ? {} : arguments[0];
    this.params = params;
  }

  _prototypeProperties(SwigTask, {
    getDefaults: {
      value: function getDefaults() {
        return {
          data: "::src/templates/data",
          entry: "::src/templates/**/*.html",
          dist: "::dist",
          search: ["::src/templates/**/*.html"],
          ignorePrefix: "_"
        };
      },
      writable: true,
      configurable: true
    }
  }, {
    enqueue: {
      value: function enqueue(gulp) {
        var params = arguments[1] === undefined ? {} : arguments[1];
        var compiler = "swig";
        var opts = distillOptions(SwigTask, params);

        if (params.data) {
          opts.load_json = true;
        }

        if (process.env.NODE_ENV !== "production") {
          opts.defaults = { cache: false };
        }

        return compileTemplates({ gulp: gulp, compiler: compiler, params: params, opts: opts });
      },
      writable: true,
      configurable: true
    },
    generateWatcher: {
      value: function generateWatcher() {
        return true;
      },
      writable: true,
      configurable: true
    }
  });

  return SwigTask;
})();

module.exports = pruno.extend(SwigTask);