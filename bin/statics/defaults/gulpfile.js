"use strict";

var pruno = require('pruno');

pruno.plugins();

pruno(function(mix) {
  return mix
    .configure({dir: __dirname + '/config'});
});
