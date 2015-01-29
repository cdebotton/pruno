"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var pruno = _interopRequire(require(".."));

var koaServer = _interopRequire(require("../utils/koaServer"));

var Notification = _interopRequire(require("../utils/notification"));

var path = _interopRequire(require("path"));

var HttpTask = (function () {
  function HttpTask() {
    var params = arguments[0] === undefined ? {} : arguments[0];
    this.params = params;
  }

  _prototypeProperties(HttpTask, {
    getDefaults: {
      value: function getDefaults() {
        return {
          listen: 3000,
          env: "development",
          dist: "::dist",
          file: path.join(__dirname, "../utils/simpleHttp.js")
        };
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  }, {
    generateWatcher: {
      value: function generateWatcher(gulp, params) {
        return function () {
          koaServer.run(params);

          gulp.watch(params.dist + "/**/*", koaServer.notify);
          return new Notification().message("Koa Server Started!");
        };
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return HttpTask;
})();

module.exports = pruno.extend(HttpTask);