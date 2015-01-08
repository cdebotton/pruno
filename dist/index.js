"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var path = _interopRequire(require("path"));

var assign = _interopRequire(require("object-assign"));

var runSequence = _interopRequire(require("run-sequence"));

var callsite = _interopRequire(require("callsite"));

var util = _interopRequire(require("gulp-util"));

var requireDir = _interopRequire(require("require-dir"));

var compileParams = _interopRequire(require("./utils/compileParams"));

var tasks = {};
var queue = {};
var settings = { vars: { src: "./src", dist: "./dist" } };

var Pruno = function Pruno(cb) {
  var gulp = Pruno.gulp;
  var stack = callsite();
  var src = path.dirname(stack[1].getFileName());

  if (!gulp) {
    throw new ReferenceError("Please define the instance of gulp for pruno to use by executing " + "pruno.use(gulp) before executing pruno's constructor");
  }

  requireDir("./modules");

  cb(tasks);

  var defaults = [];
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
      watchers.push(watchName);
      if (typeof watcher === "function") {
        gulp.task(watchName, watcher);
      }
    }
  });

  runSequence = runSequence.use(gulp);

  gulp.task("default", function () {
    util.log("Starting '" + util.colors.cyan("~PRUNO~") + "'... (" + util.colors.green(defaults.join(", ")) + ")");

    runSequence(defaults);
  });

  if (watchers.length > 0) {
    gulp.task("watch", watchers);
  }
};

Pruno.use = function (gulp) {
  this.gulp = gulp;
  return this;
};

Pruno.extend = function (task) {
  var displayName = (task.displayName || task.name).toLowerCase();
  var taskName, instance;

  tasks[displayName] = function () {
    var name = arguments[0] === undefined ? null : arguments[0];
    var params = arguments[1] === undefined ? {} : arguments[1];
    if (typeof name === "object") {
      params = displayName;
      taskName = displayName;
    } else {
      taskName = "" + displayName + "-" + name;
    }

    var defaults = task.getDefaults();
    var params = compileParams(taskName, defaults, params, settings);

    instance = new task(params);

    if (instance.enqueue) {
      queue[taskName] = { instance: instance, params: params };
    }

    return tasks;
  };
};

module.exports = Pruno;