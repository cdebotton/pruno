"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var distillOptions = _interopRequire(require("../utils/distillOptions"));

var compileTemplates = _interopRequire(require("../utils/compileTemplates"));

var SwigTask = function SwigTask() {
  var params = arguments[0] === undefined ? {} : arguments[0];
  this.params = params;
};

SwigTask.getDefaults = function () {
  return {
    data: "::src/templates/data",
    entry: "::src/templates/**/*.html",
    dist: "::dist",
    search: ["::src/templates/**/*.html"],
    ignorePrefix: "_"
  };
};

SwigTask.prototype.enqueue = function (gulp) {
  var params = arguments[1] === undefined ? {} : arguments[1];
  var compiler = "swig";
  var opts = distillOptions(SwigTask, params);

  if (params.data) {
    opts.load_json = true;
  }

  if (process.env.NODE_ENV !== "production") {
    opts.defaults = { cache: false };
  }

  return compileTemplates({ gulp: gulp, compiler: compiler, params: params, opts: opts });
};

SwigTask.prototype.generateWatcher = function () {
  return true;
};

module.exports = pruno.extend(SwigTask);