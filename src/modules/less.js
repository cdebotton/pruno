import pruno from '..';
import path from 'path';
import compileCSS from '../utils/compileCSS';
import getType from '../utils/getType';

class LessTask {
  constructor(params) {
    this.params = params;
  }

  static getDefaults() {
    return {
      'entry': '::src/less/index.less',
      'dist': '::dist/stylesheets/app.css',
      'search': '::src/**/*.less',
      'minify': false,
      'source-maps':true,
      'font-awesome': false,
      'normalize': false
    };
  }

  enqueue(gulp, params = {}) {
    const defaults = Object.keys(LessTask.getDefaults())
      .concat(['taskName']);

    var opts = Object.keys(params)
      .filter(param => defaults.indexOf(param) === -1)
      .reduce((memo, param) => {
        memo[param] = params[param];
        delete params[param];
        return memo;
      }, {});

    return compileCSS({
      gulp: gulp,
      compiler: 'less',
      opts: opts,
      params: params
    });
  }

  generateWatcher(gulp, params) {
    return true;
  }
}

export default pruno.extend(LessTask);
