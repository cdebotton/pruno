import pruno from '..';
import assign from 'object-assign';
import loadPlugins from 'gulp-load-plugins';
import getType from '../utils/getType'

import Notification from '../utils/notification';

var plugins = loadPlugins();

class MochaTask {
  static getDefaults() {
    return {
      search: ['./src/**/*.js', './tests/**/*.js', './tests/**/*.coffee'],
      coffee: false,
      use: ['should']
    };
  }

  constructor(params) {
    if (params.coffee) {
      require('coffee-script/register');
    }
    this.params = params;
  }

  enqueue(gulp, params) {
    var defaults = Object.keys(MochaTask.getDefaults())
      .concat(['taskName']);

    var opts = Object.keys(params)
      .filter((param) => defaults.indexOf(param) === -1)
      .reduce((memo, param) => {
        memo[param] = params[param];
        return memo;
      }, {});

    if (getType(params.use) === 'array') {
      opts.globals = params.use.reduce((memo, plugin) => {
        memo[plugin] = require(plugin);
        return memo;
      }, {});
    }

    return gulp.src(params.search, {read: false})
      .pipe(plugins.mocha(opts))
      .pipe(new Notification().message('Mocha run!'));
  }

  generateWatcher(gulp, params) {
    return true;
  }
}


export default pruno.extend(MochaTask);
