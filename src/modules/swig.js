import pruno from '..';
import distillOptions from '../utils/distillOptions';
import compileTemplates from '../utils/compileTemplates';

class SwigTask {
  static getDefaults() {
    return {
      data: '::src/templates/data',
      entry: '::src/templates/**/*.html',
      dist: '::dist',
      search: [
        '::src/templates/**/*.html'
      ],
      ignorePrefix: '_'
    }
  }

  constructor(params = {}) {
    this.params = params;
  }

  enqueue(gulp, params = {}) {
    var compiler = 'swig';
    var opts = distillOptions(SwigTask, params);

    return compileTemplates({gulp, compiler, params, opts});
  }

  generateWatcher() {
    return true;
  }
}

export default pruno.extend(SwigTask);
