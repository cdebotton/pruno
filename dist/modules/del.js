"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var pruno = _interopRequire(require(".."));

var del = _interopRequire(require("del"));

var DelTask = function DelTask() {
  var params = arguments[0] === undefined ? {} : arguments[0];
  this.params = params;
};

DelTask.getDefaults = function () {
  return { dirs: ["::dist"] };
};

DelTask.prototype.enqueue = function (gulp, params) {
  return del(params.dirs);
};

module.exports = pruno.extend(DelTask);