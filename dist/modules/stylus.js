"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var path = _interopRequire(require("path"));

var compileCSS = _interopRequire(require("../utils/compileCSS"));

var getType = _interopRequire(require("../utils/getType"));

var distillOptions = _interopRequire(require("../utils/distillOptions"));

var StylusTask = function StylusTask(params) {
  this.params = params;
};

StylusTask.getDefaults = function () {
  return {
    entry: "::src/stylus/index.styl",
    dist: "::dist/stylesheets/app.css",
    search: "::src/**/*.styl",
    minify: false,
    "source-maps": true,
    "font-awesome": false,
    normalize: false,
    use: ["nib", "jeet", "rupture"]
  };
};

StylusTask.prototype.enqueue = function (gulp) {
  var params = arguments[1] === undefined ? {} : arguments[1];
  var opts = distillOptions(StylusTask, params);

  if (params["source-maps"]) {
    opts.sourcemap = {
      inline: true,
      sourceRoot: "."
    };
  }

  if (params.use && getType(params.use) === "array") {
    opts.use = params.use.map(function (m) {
      return require(m)();
    });
  }

  return compileCSS({
    gulp: gulp,
    compiler: "stylus",
    opts: opts,
    params: params
  });
};

StylusTask.prototype.generateWatcher = function (gulp, params) {
  return true;
};

module.exports = pruno.extend(StylusTask);