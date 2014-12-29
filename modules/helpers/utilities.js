'use strict';

function prefixDirToFiles(dir, files) {
  if (! Array.isArray(files)) {
    files = [files];
  }

  return files.map(function(file) {
    return dir + '/' + file.replace(dir, '');
  });
};

function buildGulpSrc(src, baseDir, search) {
  if (src) {
    return prefixDirToFiles(baseDir, src);
  }

  return baseDir + '/' + search;
};

module.exports = {
  buildGulpSrc: buildGulpSrc,
  prefixDirToFiles: prefixDirToFiles
};
