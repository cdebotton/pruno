'use strict';

var {toString} = Object.prototype;

export default function (obj) {
  return toString.call(obj)
    .match(/^\[object (.+)\]$/i)[1]
    .toLowerCase();
}
