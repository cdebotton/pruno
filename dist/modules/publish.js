"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var pkg = _interopRequire(require("../utils/pkg"));

var PublishTask = function PublishTask(params) {
  this.params = params;
};

PublishTask.getDefaults = function () {
  return {
    pkg: false,
    src: ["!::src/assets/images/**/*", "::src/assets/**/*"],
    dist: "::dist"
  };
};

PublishTask.prototype.enqueue = function (gulp) {
  var params = arguments[1] === undefined ? {} : arguments[1];
  var sources = Array.isArray(params.src) ? params.src : [params.src];
  if (params.pkg) {
    sources = sources.map(function (src) {
      return pkg(params.pkg, src);
    });
  }

  gulp.src(sources).pipe(gulp.dest(params.dist));
};

PublishTask.prototype.generateWatcher = function (gulp) {
  var params = arguments[1] === undefined ? {} : arguments[1];
  return true;
};

module.exports = pruno.extend(PublishTask);