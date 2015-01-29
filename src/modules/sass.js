import pruno from '..';
import path from 'path';
import compileCSS from '../utils/compileCSS';
import getType from '../utils/getType';
import distillOptions from '../utils/distillOptions';

class SassTask {
  constructor(params) {
    this.params = params;
  }

  static getDefaults() {
    return {
      'entry': '::src/sass/index.sass',
      'dist': '::dist/stylesheets/app.css',
      'search': ['::src/**/*.sass', '::src/**/*.scss'],
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
      compiler: 'sass',
      opts: opts,
      params: params
    });
  }

  generateWatcher(gulp, params) {
    return true;
  }
}

export default pruno.extend(SassTask);
