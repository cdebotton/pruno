"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _path = require("path");

var path = _interopRequire(_path);

var runSequence = _interopRequire(require("run-sequence"));

var path = _interopRequire(_path);

var fs = _interopRequire(require("fs"));

var compileParams = _interopRequire(require("./utils/compileParams"));

var merge = _interopRequire(require("deepmerge"));

var callsite = _interopRequire(require("callsite"));

var colors = _interopRequire(require("colors"));

var Notification = _interopRequire(require("./utils/notification"));

var pwd = require("shelljs").pwd;
var assign = _interopRequire(require("object-assign"));

var tasks = {};
var queue = {};
var settings = { vars: { src: "./src", dist: "./dist" } };

var Pruno = (function () {
  function Pruno(cb) {
    try {
      var parent = module.parent;
      var gulp = parent.require("gulp");
    } catch (err) {
      throw new Error("Gulp is not currently installed. Please run `npm install -D gulp`.");
    }

    var stack = callsite();
    settings.topLevel = path.dirname(stack[1].getFileName());

    if (!gulp) {
      throw new ReferenceError("Please define the instance of gulp for pruno to use by executing " + "pruno.use(gulp) before executing pruno's constructor");
    }

    require("./modules/configure");

    var defaults = [];
    var gulpWatchers = [];
    var watchers = [];

    cb(tasks);

    Object.keys(queue).forEach(function (taskName) {
      var task = queue[taskName].instance;
      if (typeof task.enqueue === "function" && defaults.indexOf(taskName) === -1) {
        gulp.task(taskName, task.enqueue.bind(null, gulp, task.params));
        defaults.push(taskName);
      }

      var watchName = "" + taskName + ":watch";
      var watcher = task.generateWatcher ? task.generateWatcher(gulp, task.params) : false;

      if (watchers.indexOf(watchName) === -1) {
        if (typeof watcher === "function") {
          gulp.task(watchName, watcher);
          watchers.push(watchName);
        } else if (watcher === true) {
          var search = task.params.search;
          gulp.task(watchName, task.enqueue.bind(null, gulp, task.params));
          gulpWatchers.push({ search: search, watchName: watchName });
        }
      }
    });

    runSequence = runSequence.use(gulp);

    gulp.task("default", function () {
      var tasks = defaults.map(function (task) {
        return task.underline.yellow;
      }).join(", ");
      Pruno.notify("Starting", tasks);

      runSequence(defaults);
    });

    if (watchers.length + gulpWatchers.length > 0) {
      gulp.task("watch", function () {
        if (watchers.length > 0) {
          runSequence(watchers);
        }

        gulpWatchers.forEach(function (watcher) {
          runSequence(watcher.watchName);
          gulp.watch(watcher.search, [watcher.watchName]);
        });
      });
    }
  }

  _prototypeProperties(Pruno, {
    plugins: {
      value: function plugins(cb) {
        var _module$parent$require = module.parent.require(path.join(pwd(), "package.json"));

        var dependencies = _module$parent$require.dependencies;
        var devDependencies = _module$parent$require.devDependencies;


        var modules = Object.keys(assign({}, dependencies || {}, devDependencies || {})).filter(function (mod) {
          return /^pruno\-(.+)/.exec(mod);
        }).forEach(function (mod) {
          var mix = module.parent.require(mod);
        });

        return Pruno;
      },
      writable: true,
      configurable: true
    },
    extend: {
      value: function extend(task) {
        var displayName = (task.displayName || task.name).toLowerCase().replace(/Task$/i, "");

        var taskName, instance;
        tasks[displayName] = function () {
          var name = arguments[0] === undefined ? null : arguments[0];
          var params = arguments[1] === undefined ? {} : arguments[1];
          if (typeof name === "object") {
            params = name;
            taskName = displayName;
          } else {
            taskName = "" + displayName + "-" + name;
          }

          var defaults = typeof task.getDefaults === "function" ? task.getDefaults() : {};

          var baseSettings = settings[displayName] || {};

          var opts = compileParams(taskName, defaults, baseSettings, params, settings);
          opts.taskName = taskName;

          instance = new task(opts);
          queue[taskName] = { instance: instance, opts: opts };

          return tasks;
        };
      },
      writable: true,
      configurable: true
    },
    use: {
      value: function use(gulp) {
        throw new Error("pruno.use(...) has been deprecated. The parent modules gulp instance " + "is now automatically inferred.");
      },
      writable: true,
      configurable: true
    },
    setDefaults: {
      value: function setDefaults() {
        var opts = arguments[0] === undefined ? {} : arguments[0];
        settings = merge(settings, opts);
      },
      writable: true,
      configurable: true
    },
    notify: {
      value: function notify(plugin) {
        for (var _len = arguments.length, parts = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          parts[_key - 1] = arguments[_key];
        }

        var timestamp = new Date();
        var stamp = "[pruno - " + timestamp + "]";
        var pluginLabel = "[" + plugin + "]";

        parts = Array.isArray(parts) ? parts : [parts];

        console.log.apply(console, [stamp.bold.green, pluginLabel.bold.magenta].concat(parts));

        new Notification().message(parts.join(" "));
      },
      writable: true,
      configurable: true
    },
    error: {
      value: function error(plugin) {
        for (var _len = arguments.length, parts = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          parts[_key - 1] = arguments[_key];
        }

        var timestamp = new Date();
        var stamp = "[pruno - " + timestamp + "]";
        var pluginLabel = "[" + plugin + "]";

        parts = Array.isArray(parts) ? parts : [parts];

        console.error.apply(console, [stamp.bold.red, pluginLabel.bold.magenta].concat(parts));

        new Notification().error(parts.join(" "));
      },
      writable: true,
      configurable: true
    },
    get: {
      value: function get(property) {
        if (!property) {
          throw new TypeError("You must define a property go get.");
        }

        return settings[property];
      },
      writable: true,
      configurable: true
    }
  });

  return Pruno;
})();

module.exports = Pruno;