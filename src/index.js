import path from 'path';
import assign from 'object-assign';
import runSequence from 'run-sequence';
import callsite from 'callsite';
import util from 'gulp-util';
import requireDir from 'require-dir';

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
      if (typeof task.watch === 'function' && watchers.indexOf(watchName) === -1) {
        gulp.task(watchName, () => {

        });
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
        taskName = `${displayName}-${name}`;
      }

      var defaults = task.getDefaults();
      var params = compileParams(taskName, defaults, params);

      instance = new task(params);

      if (instance.enqueue) {
        queue[taskName] = {instance, params};
      }

      return tasks;
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
  opts || (opts = {});
  paramsList.push(opts);

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
