import pruno from '..';
import koaServer from '../utils/koaServer';
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
    return () => {
      gulp.watch(params.search, function(...args) {
        koaServer.notify.apply(koaServer, args);
        new Notification().message('Server Reload Started');
      });
    }
  }
}

export default pruno.extend(LiveReloadTask);
