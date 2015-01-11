import pruno from '..';
import koaServer from '../utils/koaServer';
import Notification from '../utils/notification';
import path from 'path';

class HttpTask {
  static getDefaults() {
    return {
      port: 3000,
      env: 'development',
      dist: '::output',
      file: path.join(__dirname, '../utils/simpleHttp.js')
    };
  }

  constructor(params = {}) {
    this.params = params;
  }

  generateWatcher(gulp, params) {
    return () => {
      koaServer.run(params);

      return new Notification().message('Koa Server Started!');
    }
  }
}

export default pruno.extend(HttpTask);
