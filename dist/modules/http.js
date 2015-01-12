"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var koaServer = _interopRequire(require("../utils/koaServer"));

var Notification = _interopRequire(require("../utils/notification"));

var path = _interopRequire(require("path"));

var HttpTask = function HttpTask() {
  var params = arguments[0] === undefined ? {} : arguments[0];
  this.params = params;
};

HttpTask.getDefaults = function () {
  return {
    listen: 3000,
    env: "development",
    dist: "::dist",
    file: path.join(__dirname, "../utils/simpleHttp.js")
  };
};

HttpTask.prototype.generateWatcher = function (gulp, params) {
  return function () {
    koaServer.run(params);

    gulp.watch(params.dist + "/**/*", koaServer.notify);
    return new Notification().message("Koa Server Started!");
  };
};

module.exports = pruno.extend(HttpTask);