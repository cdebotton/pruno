import fs from 'fs';
import path from 'path';
import through from 'through2';
import loadPlugins from 'gulp-load-plugins';
import pruno from '..';

const plugins = loadPlugins();

export default function(args) {
  var {params, opts, gulp, compiler} = args;
  var topLevel = pruno.get('topLevel');
  var filters = [`!src/templates/_layout.html`, '*'];
  var IGNORE_SEARCH = new RegExp(`^${params.ignorePrefix}`);

  gulp.src(params.entry)
    .on('error', (err) => plugins.util.log(err))
    .pipe(through.obj((file, enc, cb) => {
      var fileName = path.basename(file.path);
      var isSys = IGNORE_SEARCH.test(fileName);
      cb(null, isSys ? null : file);
    }))
    .pipe(plugins.data((file, cb) => {
      var data;
      var dataFile = path.join(
        topLevel,
        params.data,
        path.basename(file.path).replace(/\.html$/, '')
      );

      if (fs.existsSync(`${dataFile}.js`)) {
        data = require(`${dataFile.js}`);
      }
      else if (fs.existsSync(`${dataFile}.json`)) {
        data = require(`${dataFile}.json`);
      }

      return typeof data === 'function' ? data(cb) : cb(data);
    }))
    .pipe(plugins[compiler](opts))
    .pipe(gulp.dest(params.dist));
};
