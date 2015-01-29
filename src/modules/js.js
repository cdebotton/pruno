import pruno from '..';
import assign from 'object-assign';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import browserify from 'browserify';
import watchify from 'watchify';
import envify from 'envify/custom';
import to6ify from '6to5ify';
import loadPlugins from 'gulp-load-plugins';
import to5Runtime from '../utils/addTo5Runtime';
import Notification from '../utils/notification';
import koaServer from '../utils/koaServer';

const plugins = loadPlugins();

class JSTask {
  static getDefaults() {
    return {
      'entry': '::src/index.js',
      'dist': '::dist/bundle.js',
      'uglify': false,
      'source-maps': true,
      'es6': false,
      'runtime': false
    };
  }

  constructor(params) {
    this.params = params;
  }

  enqueue(gulp, params = {}) {
    var args = assign({}, watchify.args, {
      entry: true,
      fullPaths: false
    });

    var bundler = transform(browserify(params.entry, args), params);

    return bundle(gulp, bundler, params);
  }

  generateWatcher(gulp, params = {}) {
    return () => {
      var args = assign({}, watchify.args, {
        entry: true,
        fullPaths: true,
        debug: true
      });

      var bundler = transform(watchify(browserify(params.entry, args)), params);
      bundler.on('update', bundle.bind(bundle, gulp, bundler, params));

      return bundle(gulp, bundler, params);
    }
  }
};

var onError = function(e) {
  new Notification().error(e, 'Browserify Compilation Failed!');
  this.emit('end');
};

var bundle = (gulp, bundler, params = {}) => {
  var path = params.dist.split('/');
  var fileName = path.pop();
  var dist = path.join('/');

  new Notification().message(`Task \`${params.taskName}\` started!`)

  return bundler.bundle()
    .on('error', onError)
    .pipe(source(fileName))
    .pipe(buffer())
    .pipe(
      plugins.if(
        params.uglify, plugins.uglify()
      )
    )
    .pipe(
      plugins.if(
        params['source-maps'], plugins.sourcemaps.init({loadMaps: true})
      )
    )
    .pipe(
      plugins.if(
        params['source-maps'], plugins.sourcemaps.write()
      )
    )
    .pipe(gulp.dest(dist))
    .pipe(new Notification().message(`Task \`${params.taskName}\` completed!`));
};

function transform(bundler, params) {
  if (params.runtime) {
    bundler.transform(to5Runtime);
  }

  bundler.transform(envify({NODE_ENV: 'development'}));

  if (params.es6 || params.harmony || params.react) {
    bundler.transform(to6ify);
  }

  return bundler;
}

export default pruno.extend(JSTask);
