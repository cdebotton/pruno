import path from 'path';
import runSequence from 'run-sequence';
import util from 'gulp-util';
import requireDir from 'require-dir';
import path from 'path';
import compileParams from './utils/compileParams';
import merge from 'deepmerge';
import callsite from 'callsite';

var tasks = {};
var queue = {};
var settings = {vars: {src: './src', dist: './dist'}};

export default class Pruno {
  constructor(cb) {
    try {
      let parent = module.parent;
      var gulp = parent.require('gulp');
    }
    catch (err) {
      throw new Error('Gulp is not currently installed. Please run `npm install -D gulp`.');
    }

    var stack = callsite();
    settings.topLevel = path.dirname(stack[1].getFileName());

    if (! gulp) {
      throw new ReferenceError(
        'Please define the instance of gulp for pruno to use by executing ' +
        'pruno.use(gulp) before executing pruno\'s constructor'
      );
    }

    requireDir('./modules');

    cb(tasks);

    var defaults = [];
    var gulpWatchers = [];
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
        if (typeof watcher === 'function') {
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

    if (watchers.length + gulpWatchers.length > 0) {
      gulp.task('watch', function() {
        if (watchers.length > 0) {
          runSequence(watchers);
        }

        gulpWatchers.forEach(watcher => {
          runSequence(watcher.watchName);
          gulp.watch(watcher.search, [watcher.watchName]);
        });
      });
    }
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
      queue[taskName] = {instance, opts};

      return tasks;
    }
  }

  static use(gulp) {
    throw new Error(
      'pruno.use(...) has been deprecated. The parent modules gulp instance ' +
      'is now automatically inferred.'
    );
  }

  static setDefaults(opts = {}) {
    settings = merge(settings, opts);
  }

  static get(property) {
    if (! property) {
      throw new TypeError('You must define a property go get.');
    }

    return settings[property];
  }
}
