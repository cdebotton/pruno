"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var pruno = _interopRequire(require(".."));

var koaServer = _interopRequire(require("../utils/koaServer"));

var Notification = _interopRequire(require("../utils/notification"));

var KoaTask = (function () {
  function KoaTask(params) {
    this.params = params;
  }

  _prototypeProperties(KoaTask, {
    getDefaults: {
      value: function getDefaults() {
        return {
          env: "development",
          file: "./server.js",
          search: "::dist/**/*"
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
          gulp.watch(params.search, koaServer.notify);
          return new Notification().message("Koa Server Started!");
        };
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return KoaTask;
})();

module.exports = pruno.extend(KoaTask);