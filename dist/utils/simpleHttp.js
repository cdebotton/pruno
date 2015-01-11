"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var express = _interopRequire(require("express"));

var app = express();

console.log(JSON.stringify(process.env.STATICS));