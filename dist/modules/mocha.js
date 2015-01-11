"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var assign = _interopRequire(require("object-assign"));

var loadPlugins = _interopRequire(require("gulp-load-plugins"));

var getType = _interopRequire(require("../utils/getType"));

var Notification = _interopRequire(require("../utils/notification"));

var plugins = loadPlugins();

var MochaTask = function MochaTask(params) {
  if (params.coffee) {
    require("coffee-script/register");
  }
  this.params = params;
};

MochaTask.getDefaults = function () {
  return {
    search: ["./src/**/*.js", "./tests/**/*.js", "./tests/**/*.coffee"],
    coffee: false,
    use: ["should"]
  };
};

MochaTask.prototype.enqueue = function (gulp, params) {
  var defaults = Object.keys(MochaTask.getDefaults()).concat(["taskName"]);

  var opts = Object.keys(params).filter(function (param) {
    return defaults.indexOf(param) === -1;
  }).reduce(function (memo, param) {
    memo[param] = params[param];
    return memo;
  }, {});

  if (getType(params.use) === "array") {
    opts.globals = params.use.reduce(function (memo, plugin) {
      memo[plugin] = require(plugin);
      return memo;
    }, {});
  }

  console.log(opts.globals);

  gulp.src(params.search, { read: false }).pipe(plugins.mocha(opts)).pipe(new Notification().message("Mocha run!"));
};

MochaTask.prototype.generateWatcher = function (gulp, params) {
  return true;
};

module.exports = pruno.extend(MochaTask);