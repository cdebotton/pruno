import pruno from '..';
import path from 'path';
import compileCSS from '../utils/compileCSS';
import getType from '../utils/getType';

class StylusTask {
  constructor(params) {
    this.params = params;
  }

  static getDefaults() {
    return {
      'entry': '::src/stylus/index.styl',
      'dist': '::dist/stylesheets/app.css',
      'search': '::src/**/*.styl',
      'minify': false,
      'source-maps':true,
      'font-awesome': false,
      'normalize': false,
      'use': ['nib', 'jeet', 'rupture']
    };
  }

  enqueue(gulp, params = {}) {
    const defaults = Object.keys(StylusTask.getDefaults())
      .concat(['taskName']);

    var opts = Object.keys(params)
      .filter(param => defaults.indexOf(param) === -1)
      .reduce((memo, param) => {
        memo[param] = params[param];
        delete params[param];
        return memo;
      }, {});

    if (params['source-maps']) {
      opts.sourcemap = {
        inline: true,
        sourceRoot: '.'
      }
    }

    if (params.use && getType(params.use) === 'array') {
      opts.use = params.use.map(m => require(m)());
    }

    return compileCSS({
      gulp: gulp,
      compiler: 'stylus',
      opts: opts,
      params: params
    });
  }

  generateWatcher(gulp, params) {
    return true;
  }
}

export default pruno.extend(StylusTask);
