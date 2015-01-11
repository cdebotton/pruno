"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var path = _interopRequire(require("path"));

var compileCSS = _interopRequire(require("../utils/compileCSS"));

var getType = _interopRequire(require("../utils/getType"));

var SassTask = function SassTask(params) {
  this.params = params;
};

SassTask.getDefaults = function () {
  return {
    entry: "::src/sass/index.sass",
    dist: "::dist/stylesheets/app.css",
    search: ["::src/**/*.sass", "::src/**/*.scss"],
    minify: false,
    "source-maps": true,
    "font-awesome": false,
    normalize: false
  };
};

SassTask.prototype.enqueue = function (gulp) {
  var params = arguments[1] === undefined ? {} : arguments[1];
  var defaults = Object.keys(SassTask.getDefaults()).concat(["taskName"]);

  var opts = Object.keys(params).filter(function (param) {
    return defaults.indexOf(param) === -1;
  }).reduce(function (memo, param) {
    memo[param] = params[param];
    delete params[param];
    return memo;
  }, {});

  return compileCSS({
    gulp: gulp,
    compiler: "sass",
    opts: opts,
    params: params
  });
};

SassTask.prototype.generateWatcher = function (gulp, params) {
  return true;
};

module.exports = pruno.extend(SassTask);