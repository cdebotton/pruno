"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var koaServer = _interopRequire(require("../utils/koaServer"));

var Notification = _interopRequire(require("../utils/notification"));

var KoaTask = function KoaTask(params) {
  this.params = params;
};

KoaTask.getDefaults = function () {
  return {
    env: "development",
    file: "./server.js"
  };
};

KoaTask.prototype.generateWatcher = function (gulp, params) {
  return function () {
    koaServer.run(params);

    return new Notification().message("Koa Server Started!");
  };
};

module.exports = pruno.extend(KoaTask);