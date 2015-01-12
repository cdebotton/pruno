"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var compileTemplates = _interopRequire(require("../utils/compileTemplates"));

var distillOptions = _interopRequire(require("../utils/distillOptions"));

var JadeTask = function JadeTask() {
  var params = arguments[0] === undefined ? {} : arguments[0];
  this.params = params;
};

JadeTask.getDefaults = function () {
  return {
    data: "::src/templates/data",
    entry: "::src/templates/**/*.jade",
    dist: "::dist",
    search: ["::src/templates/**/*.jade", "::src/templates/data/**/*"],
    ignorePrefix: "_"
  };
};

JadeTask.prototype.enqueue = function (gulp) {
  var params = arguments[1] === undefined ? {} : arguments[1];
  var compiler = "jade";
  var opts = distillOptions(JadeTask, params);

  return compileTemplates({ gulp: gulp, compiler: compiler, params: params, opts: opts });
};

JadeTask.prototype.generateWatcher = function () {
  return true;
};

module.exports = pruno.extend(JadeTask);