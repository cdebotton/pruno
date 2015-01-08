import pruno from '..';
import del from 'del';

class DelTask {
  static getDefaults() {
    return {dirs: ['::dist']}
  }

  constructor(params = {}) {
    this.params = params;
  }

  enqueue(gulp, params) {
    del(params.dirs);
  }

}

export default pruno.extend(DelTask);
