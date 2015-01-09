import pruno from '..';
import koaServer from '../utils/koaServer';
import Notification from '../utils/notification';

class KoaTask {
  constructor(params) {
    this.params = params;
  }

  static getDefaults() {
    return {
      env: 'development',
      file: './server.js'
    };
  }

  generateWatcher(gulp, params) {
    return () => {
      koaServer.run(params);

      return new Notification().message('Koa Server Started!');
    }
  }
}

export default pruno.extend(KoaTask);
