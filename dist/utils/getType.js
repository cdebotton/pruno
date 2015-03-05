"use strict";

module.exports = getType;

function getType(obj) {
  return Object.prototype.toString.call(obj).match(/^\[object (.+)\]$/i)[1].toLowerCase();
}