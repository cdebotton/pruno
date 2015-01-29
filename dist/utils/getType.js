"use strict";

var toString = Object.prototype.toString;
module.exports = function (obj) {
  return toString.call(obj).match(/^\[object (.+)\]$/i)[1].toLowerCase();
};