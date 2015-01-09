"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var koaServer = _interopRequire(require("../utils/koaServer"));

var Notification = _interopRequire(require("../utils/notification"));

var LiveReloadTask = function LiveReloadTask() {
  var params = arguments[0] === undefined ? {} : arguments[0];
  this.params = params;
};

LiveReloadTask.getDefaults = function () {
  return {
    search: ["::dist/**/*", "./api/**/*"]
  };
};

LiveReloadTask.prototype.generateWatcher = function (gulp, params) {
  return function () {
    gulp.watch(params.search, function () {
      var args = [];

      for (var _key = 0; _key < arguments.length; _key++) {
        args[_key] = arguments[_key];
      }

      koaServer.notify.apply(koaServer, args);
      new Notification().message("Server Reload Started");
    });
  };
};

module.exports = pruno.extend(LiveReloadTask);