import pruno from '..';
import compileTemplates from '../utils/compileTemplates';
import distillOptions from '../utils/distillOptions';

class JadeTask {
  static getDefaults() {
    return {
      data: '::src/templates/data',
      entry: '::src/templates/**/*.jade',
      dist: '::dist',
      search: [
        '::src/templates/**/*.jade',
        '::src/templates/data/**/*'
      ],
      ignorePrefix: '_'
    };
  }

  constructor(params = {}) {
    this.params = params;
  }

  enqueue(gulp, params = {}) {
    var compiler = 'jade';
    var opts = distillOptions(JadeTask, params);

    return compileTemplates({gulp, compiler, params, opts});
  }

  generateWatcher() {
    return true;
  }
}

export default pruno.extend(JadeTask);
