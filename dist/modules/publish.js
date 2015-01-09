"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var loadPlugins = _interopRequire(require("gulp-load-plugins"));

var pngcrush = _interopRequire(require("imagemin-pngcrush"));

var pkg = _interopRequire(require("../utils/pkg"));

var plugins = loadPlugins();

var PublishTask = function PublishTask(params) {
  this.params = params;
};

PublishTask.getDefaults = function () {
  return {
    pkg: false,
    "image-min": true,
    src: ["::src/assets/**/*"],
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

  gulp.src(sources).pipe(plugins["if"](params["image-min"], plugins.imagemin({
    progressive: true,
    svgoPlugins: [{ removeViewbox: false }],
    use: [pngcrush()]
  }))).pipe(gulp.dest(params.dist));
};

PublishTask.prototype.generateWatcher = function (gulp) {
  var params = arguments[1] === undefined ? {} : arguments[1];
  return true;
};

module.exports = pruno.extend(PublishTask);