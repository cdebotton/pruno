"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var path = _interopRequire(require("path"));

var fs = _interopRequire(require("fs"));

var loadPlugins = _interopRequire(require("gulp-load-plugins"));

var distillOptions = _interopRequire(require("../utils/distillOptions"));

var plugins = loadPlugins();

var JadeTask = function JadeTask() {
  var params = arguments[0] === undefined ? {} : arguments[0];
  this.params = params;
};

JadeTask.getDefaults = function () {
  return {
    entry: "::src/templates/**/*.jade",
    dist: "::dist",
    search: ["::src/templates/**/*.jade"]
  };
};

JadeTask.prototype.enqueue = function (gulp) {
  var params = arguments[1] === undefined ? {} : arguments[1];
  var opts = distillOptions(JadeTask, params);

  gulp.src(params.entry).pipe(plugins.jade(opts)).pipe(gulp.dest(params.dist));
};

JadeTask.prototype.generateWatcher = function () {
  return true;
};

module.exports = pruno.extend(JadeTask);