"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var distillOptions = _interopRequire(require("../utils/distillOptions"));

var plugins = require("gulp-load-plugins")();

var LintTask = function LintTask() {
  var params = arguments[0] === undefined ? {} : arguments[0];
  this.params = params;
};

LintTask.getDefaults = function () {
  return {
    search: ["::src/**/*.js", "::src/**/*.jsx", "::src/**/*.es6"]
  };
};

LintTask.prototype.enqueue = function (gulp, params) {
  var opts = distillOptions(LintTask, params);

  gulp.src(params.search).pipe(plugins.plumber()).pipe(plugins.eslint(opts)).pipe(plugins.eslint.format()).pipe(plugins.eslint.failOnError());
};

LintTask.prototype.generateWatcher = function (gulp, params) {
  return true;
};

module.exports = pruno.extend(LintTask);