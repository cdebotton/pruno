import path from 'path';
import runSequence from 'run-sequence';
import callsite from 'callsite';
import util from 'gulp-util';
import requireDir from 'require-dir';
import compileParams from './utils/compileParams';
import merge from 'deepmerge';

var tasks = {};
var queue = {};
var settings = {vars: {src: './src', dist: './dist'}};

export default class Pruno {
  constructor(cb) {
    var {gulp} = Pruno;
    var stack = callsite();
    var src = path.dirname(stack[1].getFileName());

    if (! gulp) {
      throw new ReferenceError(
        'Please define the instance of gulp for pruno to use by executing ' +
        'pruno.use(gulp) before executing pruno\'s constructor'
      );
    }

    requireDir('./modules');

    cb(tasks);

    var defaults = [];
    var watchers = [];

    Object.keys(queue).forEach((taskName) => {
      var task = queue[taskName].instance;

      if (typeof task.enqueue === 'function' && defaults.indexOf(taskName) === -1) {
        gulp.task(taskName, task.enqueue.bind(null, gulp, task.params));
        defaults.push(taskName);
      }

      var watchName = `${taskName}:watch`;
      var watcher = task.generateWatcher ? task.generateWatcher(gulp, task.params) : false;
      if (watchers.indexOf(watchName) === -1) {
        watchers.push(watchName);
        if (typeof watcher === 'function') {
          gulp.task(watchName, watcher);
        }
      }
    });

    runSequence = runSequence.use(gulp);

    gulp.task('default', function() {
      util.log(
        'Starting \'' +
        util.colors.cyan('~PRUNO~') +
        '\'... (' +
        util.colors.green(defaults.join(', ')) +
        ')'
      );

      runSequence(defaults);
    });

    if (watchers.length > 0) {
      gulp.task('watch', watchers);
    }
  }

  static use(gulp) {
    this.gulp = gulp;
    return this;
  }

  static extend(task) {
    var displayName = (task.displayName || task.name).toLowerCase()
      .replace(/Task$/i, '');

    var taskName, instance;

    tasks[displayName] = (name = null, params = {}) => {
      if (typeof name === 'object') {
        params = name;
        taskName = displayName;
      }
      else {
        taskName = `${displayName}-${name}`;
      }

      var defaults = typeof task.getDefaults === 'function' ?
        task.getDefaults() : {};

      var baseSettings = settings[displayName] || {};

      var opts = compileParams(taskName, defaults, baseSettings, params, settings);
      opts.taskName = taskName;

      instance = new task(opts);
      if (instance.enqueue) {
        queue[taskName] = {instance, opts};
      }

      return tasks;
    }
  }

  static setDefaults(opts) {
    settings = merge(settings, opts);
  }
}
