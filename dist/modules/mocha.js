"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var pruno = _interopRequire(require(".."));

var assign = _interopRequire(require("object-assign"));

var loadPlugins = _interopRequire(require("gulp-load-plugins"));

var getType = _interopRequire(require("../utils/getType"));

var Notification = _interopRequire(require("../utils/notification"));

var plugins = loadPlugins();

var MochaTask = (function () {
  function MochaTask(params) {
    if (params.coffee) {
      require("coffee-script/register");
    }
    this.params = params;
  }

  _prototypeProperties(MochaTask, {
    getDefaults: {
      value: function getDefaults() {
        return {
          search: ["./src/**/*.js", "./tests/**/*.js", "./tests/**/*.coffee"],
          coffee: false,
          use: ["should"]
        };
      },
      writable: true,
      configurable: true
    }
  }, {
    enqueue: {
      value: function enqueue(gulp, params) {
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

        return gulp.src(params.search, { read: false }).pipe(plugins.plumber()).pipe(plugins.mocha(opts)).pipe(new Notification().message("Mocha run!"));
      },
      writable: true,
      configurable: true
    },
    generateWatcher: {
      value: function generateWatcher(gulp, params) {
        return true;
      },
      writable: true,
      configurable: true
    }
  });

  return MochaTask;
})();

module.exports = pruno.extend(MochaTask);