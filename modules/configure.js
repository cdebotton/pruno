var pruno = require('..');

pruno.extend('configure', function(dir) {
  var config = require('yaml-env-config')(dir, {absolute: true});
  pruno.config.setDefaults(config.pruno);
});
