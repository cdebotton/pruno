"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var path = _interopRequire(require("path"));

var compileCSS = _interopRequire(require("../utils/compileCSS"));

var getType = _interopRequire(require("../utils/getType"));

var distillOptions = _interopRequire(require("../utils/distillOptions"));

var LessTask = function LessTask(params) {
  this.params = params;
};

LessTask.getDefaults = function () {
  return {
    entry: "::src/less/index.less",
    dist: "::dist/stylesheets/app.css",
    search: "::src/**/*.less",
    minify: false,
    "source-maps": true,
    "font-awesome": false,
    normalize: false
  };
};

LessTask.prototype.enqueue = function (gulp) {
  var params = arguments[1] === undefined ? {} : arguments[1];
  var opts = distillOptions(SassTask, params);

  return compileCSS({
    gulp: gulp,
    compiler: "less",
    opts: opts,
    params: params
  });
};

LessTask.prototype.generateWatcher = function (gulp, params) {
  return true;
};

module.exports = pruno.extend(LessTask);