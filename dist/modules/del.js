"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var pruno = _interopRequire(require(".."));

var del = _interopRequire(require("del"));

var DelTask = (function () {
  function DelTask() {
    var params = arguments[0] === undefined ? {} : arguments[0];
    this.params = params;
  }

  _prototypeProperties(DelTask, {
    getDefaults: {
      value: function getDefaults() {
        return { dirs: ["::dist"] };
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  }, {
    enqueue: {
      value: function enqueue(gulp, params) {
        return del(params.dirs);
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return DelTask;
})();

module.exports = pruno.extend(DelTask);