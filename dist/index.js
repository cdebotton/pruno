"use strict";

var _slicedToArray = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else {
    var _arr = [];

    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  }
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var path = _interopRequire(require("path"));

var assign = _interopRequire(require("object-assign"));

var runSequence = _interopRequire(require("run-sequence"));

var callsite = _interopRequire(require("callsite"));

var util = _interopRequire(require("gulp-util"));

var requireDir = _interopRequire(require("require-dir"));

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
    if (typeof task.watch === "function" && watchers.indexOf(watchName) === -1) {
      gulp.task(watchName, function () {});
    }
  });

  runSequence = runSequence.use(gulp);

  gulp.task("default", function () {
    util.log("Starting '" + util.colors.cyan("~PRUNO~") + "'... (" + util.colors.green(defaults.join(", ")) + ")");

    runSequence(defaults);
  });
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
    var params = compileParams(taskName, defaults, params);

    instance = new task(params);

    if (instance.enqueue) {
      queue[taskName] = { instance: instance, params: params };
    }

    return tasks;
  };
};

module.exports = Pruno;


var compileParams = function (taskName, defaults, opts) {
  var paramsList = [{}, defaults];
  var _taskName$split = taskName.split(":");

  var _taskName$split2 = _slicedToArray(_taskName$split, 2);

  var taskName = _taskName$split2[0];
  var methodName = _taskName$split2[1];


  var taskSettings = settings[taskName];
  if (taskSettings) {
    paramsList.push(taskSettings);

    var methodSettings = taskSettings[methodName];
    if (methodSettings) {
      paramsList.push(methodSettings);
      delete taskSettings[methodName];
    }
  }
  opts || (opts = {});
  paramsList.push(opts);

  var vars = assign({}, settings.vars);
  var params = assign.apply(null, paramsList);

  return Object.keys(params).reduce(function (obj, param) {
    var val = params[param];
    if (typeof val === "string") {
      obj[param] = val.replace(/(\:\:([A-z0-9\s_-]+))/g, function (str, p1, p2) {
        return vars[p2] || "";
      });
    }

    return obj;
  }, params);
};