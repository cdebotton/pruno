import pruno from '..';
import livereload from 'gulp-livereload';
import Notification from '../utils/notification';

class LiveReloadTask {
  constructor(params = {}) {
    this.params = params;
  }

  static getDefaults() {
    return {
      search: ['::dist/**/*', './api/**/*']
    };
  }

  enqueue(gulp, params = {}) {
    gulp.src(params.search)
      .pipe(livereload())
      .pipe(new Notification().message('Server Reload Started'));
  }

  generateWatcher(gulp, params) {
    livereload.listen();

    return true;
  }
}

export default pruno.extend(LiveReloadTask);
