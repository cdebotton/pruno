"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

module.exports = compileParams;

var assign = _interopRequire(require("object-assign"));

var getType = _interopRequire(require("./getType"));

function compileParams(taskName, defaults, baseSettings, params, settings) {
  var paramsList = [{}, defaults, baseSettings];

  var _taskName$split = taskName.split(":");

  var _taskName$split2 = _slicedToArray(_taskName$split, 2);

  var taskName = _taskName$split2[0];
  var methodName = _taskName$split2[1];

  var methodSettings = baseSettings[methodName];
  if (methodSettings) {
    paramsList.push(methodSettings);
    delete taskSettings[methodName];
  }

  paramsList.push(params);

  var vars = assign({}, settings.vars);
  var params = assign.apply(null, paramsList);

  return Object.keys(params).reduce(compile.bind(null, vars), params);
}

var compile = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var vars = args[0];
  var obj = args[1];
  var param = args[2];

  var val = obj[param];
  var type = getType(val);

  switch (type) {
    case "string":
      obj[param] = val.replace(/(\:\:([A-z0-9\s_-]+))/g, function () {
        return vars[arguments[2]] || "";
      });
      break;
    case "array":
      obj[param] = val.reduce(inspectProperty(vars), val);
      break;
    case "object":
      obj[param] = Object.keys(val).reduce(inspectProperty(vars), val);
      break;
  }

  return obj;
};

var inspectProperty = function (vars) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var memo = args[0];
    var p = args[1];
    var i = args[2];

    return compile(vars, memo, i);
  };
};