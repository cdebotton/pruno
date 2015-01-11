import fs from 'fs';
import path from 'path';
import loadPlugins from 'gulp-load-plugins';
import pruno from '..';

const plugins = loadPlugins();

export default function(args) {
  var {params, opts, gulp, compiler} = args;
  var topLevel = pruno.get('topLevel');

  gulp.src(params.entry)
    // .pipe(
    //   plugins.if(
    //     params.data,
    //     plugins.data(collectData(params.data))
    //   )
    // )
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

var collectData = (dataDir) => {
  return (file, cb) => {
    var fileRoot = path.join(dataDir, path.basename(file.path));
    var json = `${fileRoot}.json`;
    var js = `${fileRoot}.js`;
    var file;

    if (fs.existsSync(js)) {
      file = require(js);
    }
    else if (fs.existsSync(json)) {
      file = require(json);
    }

    if (file) {
      cb(file);
    }
  };
};
