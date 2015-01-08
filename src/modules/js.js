import pruno from '..';
import assign from 'object-assign';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import browserify from 'browserify';
import watchify from 'watchify';
import envify from 'envify/custom';
import to6ify from '6to5ify';
// import to5Runtime from './helpers/addTo5Runtime';
import loadPlugins from 'gulp-load-plugins';
// import Notification from './helpers/Notification';
// import koaServer from './helpers/koa-server';


const plugins = loadPlugins();

class JS {
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
    var args = assign({}, watchify.args);
    args.entry = true;
    args.fullPaths = false;

    var bundler = browserify(params.entry, args);

    return bundle(gulp, bundler, params);
  }

  generateWatcher(gulp, params = {}) {
    return () => {
      var args = assign({}, watchify.args);
      args.entry = true;
      args.fullPaths = true;
      args.debug = true;

      var bundler = watchify(browserify(params.entry, args));
      bundler.on('update', bundle.bind(bundle, gulp, bundler, params));

      return bundle(gulp, bundler, params);
    }
  }
};

var onError = (e) => {
  console.error(e);
};

var bundle = (gulp, bundler, params = {}) => {
  var path = params.dist.split('/');
  var fileName = path.pop();
  var dist = path.join('/');

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
};

export default pruno.extend(JS);
