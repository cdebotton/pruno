"use strict";

module.exports = pkg;
function pkg(pkgName, path) {
  return "./node_modules/pruno/node_modules/" + pkgName + "/" + path;
}