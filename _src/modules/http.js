import pruno from '..';
import koaServer from '../utils/koaServer';
import Notification from '../utils/notification';
import path from 'path';

class HttpTask {
  static getDefaults() {
    return {
      listen: 3000,
      env: 'development',
      dist: '::dist',
      file: path.join(__dirname, '../utils/simpleHttp.js')
    };
  }

  constructor(params = {}) {
    this.params = params;
  }

  generateWatcher(gulp, params) {
    return () => {
      koaServer.run(params);

      gulp.watch(params.dist + '/**/*', koaServer.notify);
      return new Notification().message('Koa Server Started!');
    }
  }
}

export default pruno.extend(HttpTask);
