import pruno from '..';
import path from 'path';
import fs from 'fs';
import loadPlugins from 'gulp-load-plugins';
import distillOptions from '../utils/distillOptions';

var plugins = loadPlugins();

class JadeTask {
  static getDefaults() {
    return {
      entry: '::src/templates/**/*.jade',
      dist: '::dist',
      search: [
        '::src/templates/**/*.jade'
      ]
    };
  }

  constructor(params = {}) {
    this.params = params;
  }

  enqueue(gulp, params = {}) {
    var opts = distillOptions(JadeTask, params);

    gulp.src(params.entry)
      .pipe(plugins.jade(opts))
      .pipe(gulp.dest(params.dist));
  }

  generateWatcher() {
    return true;
  }
}

export default pruno.extend(JadeTask);
