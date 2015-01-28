'use strict';

import pruno from '..';
import loadPlugins from 'gulp-load-plugins';
import pngcrush from 'imagemin-pngcrush';
import pkg from '../utils/pkg';

var plugins = loadPlugins();

class PublishTask {
  static getDefaults() {
    return {
      pkg: false,
      'image-min': true,
      src: [
        '::src/assets/**/*'
      ],
      dist: '::dist'
    };
  }

  constructor(params) {
    this.params = params;
  }

  enqueue(gulp, params = {}) {
    var sources = Array.isArray(params.src) ? params.src : [params.src];
    if (params.pkg) {
      sources = sources.map(src => pkg(params.pkg, src));
    }

    return gulp.src(sources)
      .pipe(
        plugins.if(
          params['image-min'],
          plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewbox: false}],
            use: [pngcrush()]
          })
        )
      )
      .pipe(gulp.dest(params.dist));
  }

  generateWatcher(gulp, params = {}) {
    return true;
  }
}

export default pruno.extend(PublishTask);
