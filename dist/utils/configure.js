"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var pruno = _interopRequire(require(".."));

var yamlConfig = _interopRequire(require("yaml-env-config"));

var ConfigureTask = function ConfigureTask(params) {
  _classCallCheck(this, ConfigureTask);

  var config = yamlConfig(params.dir, { absolute: true });
  pruno.setDefaults(config.pruno);
};

module.exports = pruno.extend(ConfigureTask);