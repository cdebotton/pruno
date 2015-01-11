import fs from 'fs';
import path from 'path';
import loadPlugins from 'gulp-load-plugins';
import pruno from '..';

const plugins = loadPlugins();

export default function(args) {
  var {params, opts, gulp, compiler} = args;
  var topLevel = pruno.get('topLevel');

  gulp.src(params.entry)
    .pipe(plugins.data((file, cb) => {
      var data;
      var dataFile = path.join(
        topLevel,
        params.data,
        path.basename(file.path).replace(/\.html$/, '')
      );

      if (fs.existsSync(`${dataFile}.js`)) {
        data = require(`${dataFile.js}`);
        if (typeof data === 'function') {
          data = data(params, opts);
        }
      }
      else if (fs.existsSync(`${dataFile}.json`)) {
        data = require(`${dataFile}.json`);
      }

      if (data) {
        return cb(data);
      }
    }))
    .pipe(plugins[compiler](opts))
    .pipe(gulp.dest(params.dist));
};
