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

  generateWatcher(gulp, params) {
    livereload.listen();

    return () => {
      gulp.watch(params.search, function() {
        gulp.src(params.search)
          .pipe(livereload())
          .pipe(new Notification().message('Server Reload Started'));
      });
    };
  }
}

export default pruno.extend(LiveReloadTask);
