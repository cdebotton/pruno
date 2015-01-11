"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var JadeTask = function JadeTask() {
  var params = arguments[0] === undefined ? {} : arguments[0];
  this.params = params;
};

JadeTask.getDefaults = function () {
  return {
    entry: "::src/templates/**/*.jade",
    dist: "::output"
  };
};

JadeTask.prototype.enqueue = function (gulp) {
  var params = arguments[1] === undefined ? {} : arguments[1];
  gulp.src(params.entry).pipe(plugins.jade(opts)).pipe(gulp.dest(params.dist));
};

JadeTask.prototype.generateWatcher = function () {
  return true;
};

module.exports = pruno.extend(JadeTask);