'use strict';

import pruno from '..';
import pkg from '../utils/pkg';

class PublishTask {
  static getDefaults() {
    return {
      pkg: false,
      src: [
        '!::src/assets/images/**/*',
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

    gulp.src(sources)
      .pipe(gulp.dest(params.dist));
  }

  generateWatcher(gulp, params = {}) {
    return true;
  }
}

export default pruno.extend(PublishTask);
