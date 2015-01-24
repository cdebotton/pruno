import pruno from '..';
import distillOptions from '../utils/distillOptions';

let plugins = require('gulp-load-plugins')();

class LintTask {
  static getDefaults() {
    return {
      search: [
        '::src/**/*.js',
        '::src/**/*.jsx',
        '::src/**/*.es6'
      ]
    };
  }

  constructor(params = {}) {
    this.params = params;
  }

  enqueue(gulp, params) {
    var opts = distillOptions(LintTask, params);

    gulp.src(params.search)
      .pipe(plugins.plumber())
      .pipe(plugins.eslint(opts))
      .pipe(plugins.eslint.format())
      .pipe(plugins.eslint.failOnError());
  }

  generateWatcher(gulp, params) {
    return true;
  }
}

export default pruno.extend(LintTask);
