"use strict";

module.exports = function (Task, params) {
  var defaults = Object.keys(Task.getDefaults()).concat(["taskName"]);

  return Object.keys(params).filter(function (param) {
    return defaults.indexOf(param) === -1;
  }).reduce(function (memo, param) {
    memo[param] = params[param];
    delete params[param];
    return memo;
  }, {});
};