"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var path = _interopRequire(require("path"));

var runSequence = _interopRequire(require("run-sequence"));

var util = _interopRequire(require("gulp-util"));

var requireDir = _interopRequire(require("require-dir"));

var compileParams = _interopRequire(require("./utils/compileParams"));

var merge = _interopRequire(require("deepmerge"));

var tasks = {};
var queue = {};
var settings = { vars: { src: "./src", dist: "./dist" } };

var Pruno = function Pruno(cb) {
  var gulp = Pruno.gulp;


  if (!gulp) {
    throw new ReferenceError("Please define the instance of gulp for pruno to use by executing " + "pruno.use(gulp) before executing pruno's constructor");
  }

  requireDir("./modules");

  cb(tasks);

  var defaults = [];
  var gulpWatchers = [];
  var watchers = [];

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
    util.log("Starting '" + util.colors.cyan("~PRUNO~") + "'... (" + util.colors.green(defaults.join(", ")) + ")");

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
};

Pruno.use = function (gulp) {
  this.gulp = gulp;
  return this;
};

Pruno.extend = function (task) {
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
};

Pruno.setDefaults = function () {
  var opts = arguments[0] === undefined ? {} : arguments[0];
  settings = merge(settings, opts);
};

module.exports = Pruno;