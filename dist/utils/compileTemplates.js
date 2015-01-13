"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var fs = _interopRequire(require("fs"));

var path = _interopRequire(require("path"));

var through = _interopRequire(require("through2"));

var loadPlugins = _interopRequire(require("gulp-load-plugins"));

var pruno = _interopRequire(require(".."));

var plugins = loadPlugins();

module.exports = function (args) {
  var params = args.params;
  var opts = args.opts;
  var gulp = args.gulp;
  var compiler = args.compiler;
  var topLevel = pruno.get("topLevel");
  var filters = ["!src/templates/_layout.html", "*"];
  var IGNORE_SEARCH = new RegExp("^" + params.ignorePrefix);

  gulp.src(params.entry).on("error", function (err) {
    return plugins.util.log(err);
  }).pipe(through.obj(function (file, enc, cb) {
    var fileName = path.basename(file.path);
    var isSys = IGNORE_SEARCH.test(fileName);
    cb(null, isSys ? null : file);
  })).pipe(plugins.data(function (file, cb) {
    var data;
    var dataFile = path.join(topLevel, params.data, path.basename(file.path).replace(/\.html$/, ""));

    if (fs.existsSync("" + dataFile + ".js")) {
      data = require("" + dataFile + ".js");
    } else if (fs.existsSync("" + dataFile + ".json")) {
      data = require("" + dataFile + ".json");
    }

    if (typeof data === "function") {
      data(cb);
    } else {
      cb(null, data);
    }
  })).pipe(plugins[compiler](opts)).pipe(gulp.dest(params.dist));
};