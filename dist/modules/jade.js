"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var pruno = _interopRequire(require(".."));

var compileTemplates = _interopRequire(require("../utils/compileTemplates"));

var distillOptions = _interopRequire(require("../utils/distillOptions"));

var JadeTask = (function () {
  function JadeTask() {
    var params = arguments[0] === undefined ? {} : arguments[0];
    this.params = params;
  }

  _prototypeProperties(JadeTask, {
    getDefaults: {
      value: function getDefaults() {
        return {
          data: "::src/templates/data",
          entry: "::src/templates/**/*.jade",
          dist: "::dist",
          search: ["::src/templates/**/*.jade", "::src/templates/data/**/*"],
          ignorePrefix: "_"
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
        var compiler = "jade";
        var opts = distillOptions(JadeTask, params);

        return compileTemplates({ gulp: gulp, compiler: compiler, params: params, opts: opts });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    generateWatcher: {
      value: function generateWatcher() {
        return true;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return JadeTask;
})();

module.exports = pruno.extend(JadeTask);