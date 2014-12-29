'use strict';

var path = require('path');
var callsite = require('callsite');

var Pruno = function(callback) {
  var stack = callsite();
  Pruno.config.rootDir = path.dirname(stack[1].getFileName());

  if ('undefined' === typeof Pruno.config.gulp) {
    throw ReferenceError('You must define a gulp instace with Pruno.use(...)');
  }

  require('require-dir')('./modules');
  callback(Pruno.config);
};

Pruno.config = require('./config');
Pruno.config.setDefaultsFrom('pruno.json');

Pruno.use = function(gulp) {
  Pruno.config.gulp = gulp;
  return this;
};

Pruno.extend = function(name, callback) {
  Pruno.config[name] = callback;
};

module.exports = Pruno;
