import pruno from '..';
import path from 'path';
import compileCSS from '../utils/compileCSS';
import getType from '../utils/getType';
import distillOptions from '../utils/distillOptions';

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
    var opts = distillOptions(SassTask, params);

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
