import loadPlugins from 'gulp-load-plugins';
import streamqueue from 'streamqueue';
import Notification from './notification';
import getType from './getType';
import pkg from './pkg';
import path from 'path';

var plugins = loadPlugins();

export default function compileCSS(args) {
  var {gulp, compiler, opts, params} = args;

  var [dist, distDir, fileName] = params.dist.match(/^(.+\/)(.+\.css)$/);

  var stream = streamqueue({objectMode: true});

  stream.pipe(
    plugins.if(
      params['source-maps'],
      plugins.sourcemaps.init({loadMaps: true})
    )
  );

  if (params.normalize) {
    stream.queue(
      gulp.src(pkg('normalize.css', 'normalize.css'))
    );
  }

  if (params['font-awesome']) {
    stream.queue(
      gulp.src(pkg('font-awesome', 'css/font-awesome.css'))
    );
  }

  stream.pipe(
    gulp.src(params.entry)
      .pipe(plugins.plumber())
      .pipe(plugins[compiler](opts))
      .pipe(plugins.plumber.stop())
  );

  return stream.done()
    .pipe(plugins.concat(fileName))
    .pipe(plugins.if(params.minify, plugins.minifyCss()))
    .pipe(plugins.if(params['source-maps'], plugins.sourcemaps.write()))
    .pipe(gulp.dest(distDir))
    .pipe(new Notification().message(
      `Task \`${compiler.replace(/^(.)/, (...parts) => parts[1].toUpperCase())}\` Compiled!`
    ));
};
