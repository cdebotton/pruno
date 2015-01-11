import pruno from '..';

class JadeTask {
  static getDefaults() {
    return {
      entry: '::src/templates/**/*.jade',
      dist: '::output'
    };
  }

  constructor(params = {}) {
    this.params = params;
  }

  enqueue(gulp, params = {}) {
    gulp.src(params.entry)
      .pipe(plugins.jade(opts))
      .pipe(gulp.dest(params.dist));
  }

  generateWatcher() {
    return true;
  }
}

export default pruno.extend(JadeTask);
