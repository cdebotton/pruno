import path from 'path';
import assign from 'object-assign';
import callsite from 'callsite';
import requireDir from 'require-dir';
import Config from './config';

var tasks = {};
var queue = {};
var watchers = {};
var settings = {
  vars: {
    src: './src',
    dist: './dist'
  }
};

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

    Object.keys(queue).forEach(function(taskName) {
      var task = queue[taskName].instance;

      if (task.enqueue) {
        gulp.task(taskName, task.enqueue.bind(null, gulp, task.params));
      }
    });

    gulp.task('default', Object.keys(queue));
  }

  static use(gulp) {
    this.gulp = gulp;
    return this;
  }

  static extend(task) {
    var displayName = (task.displayName || task.name).toLowerCase();
    var taskName, instance;

    tasks[displayName] = (name = null, params = {}) => {
      if (typeof name === 'object') {
        params = displayName;
        taskName = displayName;
      }
      else {
        taskName = `${displayName}:${name}`;
      }

      var defaults = task.getDefaults();
      var params = compileParams(taskName, defaults, params);
      instance = new task(params);

      if (instance.enqueue) {
        queue[taskName] = {instance, params};
      }

      if (instance.watch) {
        watchers[taskName] = {instance, params};
      }

      return this;
    }
  }
}

var compileParams = (taskName, defaults, opts) => {
  var paramsList  = [{}, defaults];
  var [taskName, methodName] = taskName.split(':');

  var taskSettings = settings[taskName];
  if (taskSettings) {
    paramsList.push(taskSettings);

    var methodSettings = taskSettings[methodName];
    if (methodSettings) {
      paramsList.push(methodSettings);
      delete taskSettings[methodName];
    }
  }

  var vars = assign({}, settings.vars);
  var params = assign.apply(null, paramsList);

  return Object.keys(params).reduce((obj, param) => {
    var val = params[param];
    if (typeof val === 'string') {
      obj[param] = val.replace(/(\:\:([A-z0-9\s_-]+))/g, (str, p1, p2) => {
        return vars[p2] || '';
      });
    }

    return obj;
  }, params);
};
