import fs from "fs";
import path from "path";
import {pwd} from "shelljs";
import colors from "colors";
import merge from "deepmerge";
import watch from "gulp-watch";
import callsite from "callsite";
import assign from "object-assign";
import runSequence from "run-sequence";
import compileParams from "./utils/compileParams";
import Notification from "./utils/notification";

var tasks = {};
var queue = {};
var settings = {vars: {src: "./src", dist: "./dist"}};

let Pruno = (cb) => {
  // Create reference to parent gulp.
  try {
    var parent = module.parent;
    var gulp = parent.require("gulp");
  }
  catch (err) {
    throw new Error("Gulp is not currently installed. Please run `npm install -D gulp`.");
  }

  // Load installed plugins automagically.
  var {dependencies, devDependencies} = module.parent.require(
    path.join(pwd(), "package.json")
  );

  var modules = Object.keys(
      assign({}, (dependencies || {}), (devDependencies || {})
    ))
    .filter(mod => /^pruno\-(.+)/.exec(mod))
    .forEach(mod => Pruno.extend(module.parent.require(mod)));

  // Create reference to topLevel of application.
  var stack = callsite();
  settings.topLevel = path.dirname(stack[1].getFileName());

  // Fail to proceed if gulp doesn"t exist.
  if (! gulp) {
    throw new ReferenceError(
      "Please define the instance of gulp for pruno to use by executing " +
      "pruno.use(gulp) before executing pruno\"s constructor"
    );
  }

  // Require the configure mix.
  require("./utils/configure");

  var defaults = [];
  var gulpWatchers = [];
  var watchers = [];

  // Run the callback for pruno, assigning mix tasks to our dynamic
  // gulpfile.
  cb(tasks);

  // Assign instance of gulp to run-sequence.
  runSequence = runSequence.use(gulp);

  // Parse the results of the callback for tasks to run.
  Object.keys(queue).forEach((taskName) => {
    var task = queue[taskName].instance;
    if (typeof task.enqueue === "function" && defaults.indexOf(taskName) === -1) {
      gulp.task(taskName, task.enqueue.bind(null, gulp, task.params));
      defaults.push(taskName);
    }

    var watchName = `${taskName}:watch`;
    var watcher = task.generateWatcher ?
      task.generateWatcher(gulp, task.params) :
      false;

    if (watchers.indexOf(watchName) === -1) {
      if (typeof watcher === "function") {
        gulp.task(watchName, watcher);
        watchers.push(watchName);
      }
      else if (watcher === true) {
        var {search} = task.params;
        gulp.task(watchName, task.enqueue.bind(null, gulp, task.params));
        gulpWatchers.push({search, watchName});
      }
    }
  });

  // Create a default task.
  gulp.task("default", function() {
    var tasks = defaults.map(task => task.underline.yellow).join(", ");
    Pruno.notify("Starting", tasks);

    runSequence(defaults);
  });

  // Parse the callback for watchers.
  if (watchers.length + gulpWatchers.length > 0) {
    gulp.task("watch", function() {
      if (watchers.length > 0) {
        runSequence(watchers);
      }

      gulpWatchers.forEach(watcher => {
        const verbose = true;
        const events = ["add", "change", "unlink", "unlinkDir", "raw"];

        runSequence(watcher.watchName);

        watch(watcher.search, { verbose, events }, function(files) {
          runSequence(watcher.watchName);
        });
      });
    });
  }
};

Pruno.extend = (task) => {
  var displayName = (task.displayName || task.name).toLowerCase()
    .replace(/Task$/i, "");

  var taskName, instance;
  tasks[displayName] = (name = null, params = {}) => {
    if (typeof name === "object") {
      params = name;
      taskName = displayName;
    }
    else {
      taskName = `${displayName}-${name}`;
    }

    var defaults = typeof task.getDefaults === "function" ?
      task.getDefaults() : {};

    var baseSettings = settings[displayName] || {};

    var opts = compileParams(taskName, defaults, baseSettings, params, settings);
    opts.taskName = taskName;

    instance = new task(opts);
    queue[taskName] = {instance, opts};

    return tasks;
  }
};

Pruno.setDefaults = (opts = {}) => {
  settings = merge(settings, opts);
};

Pruno.notify = (plugin, ...parts) => {
  var timestamp = new Date();
  var stamp = `[pruno - ${timestamp}]`;
  var pluginLabel = `[${plugin}]`;

  parts = Array.isArray(parts) ? parts : [parts];

  console.log.apply(console, [
    stamp.bold.green,
    pluginLabel.bold.magenta
  ].concat(parts));

  new Notification().message(parts.join(" "));
};

Pruno.error = (plugin, ...parts) => {
  var timestamp = new Date();
  var stamp = `[pruno - ${timestamp}]`;
  var pluginLabel = `[${plugin}]`;

  parts = Array.isArray(parts) ? parts : [parts];

  console.error.apply(console, [
    stamp.bold.red,
    pluginLabel.bold.magenta
  ].concat(parts));

  new Notification().error(parts.join(" "));
};

Pruno.get = (property) => {
  if (! property) {
    throw new TypeError("You must define a property go get.");
  }

  return settings[property];
};

export default Pruno;
