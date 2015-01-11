"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var fs = _interopRequire(require("fs"));

var path = _interopRequire(require("path"));

var loadPlugins = _interopRequire(require("gulp-load-plugins"));

var pruno = _interopRequire(require(".."));

var plugins = loadPlugins();

module.exports = function (args) {
  var params = args.params;
  var opts = args.opts;
  var gulp = args.gulp;
  var compiler = args.compiler;
  var topLevel = pruno.get("topLevel");

  gulp.src(params.entry).pipe(plugins.data(function (file, cb) {
    var data;
    var dataFile = path.join(topLevel, params.data, path.basename(file.path).replace(/\.html$/, ""));

    if (fs.existsSync("" + dataFile + ".js")) {
      data = require("" + dataFile.js);
      if (typeof data === "function") {
        data = data(params, opts);
      }
    } else if (fs.existsSync("" + dataFile + ".json")) {
      data = require("" + dataFile + ".json");
    }

    if (data) {
      return cb(data);
    }
  })).pipe(plugins[compiler](opts)).pipe(gulp.dest(params.dist));
};