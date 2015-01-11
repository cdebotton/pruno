"use strict";

var _slicedToArray = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else {
    var _arr = [];

    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  }
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

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
  var args = [];

  for (var _key = 0; _key < arguments.length; _key++) {
    args[_key] = arguments[_key];
  }

  var _args = _slicedToArray(args, 3);

  var vars = _args[0];
  var obj = _args[1];
  var param = _args[2];
  var val = obj[param];
  var type = getType(val);

  switch (type) {
    case "string":
      obj[param] = val.replace(/(\:\:([A-z0-9\s_-]+))/g, function () {
        var matches = [];

        for (var _key2 = 0; _key2 < arguments.length; _key2++) {
          matches[_key2] = arguments[_key2];
        }

        return vars[matches[2]] || "";
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
    var args = [];

    for (var _key3 = 0; _key3 < arguments.length; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var _args2 = _slicedToArray(args, 3);

    var memo = _args2[0];
    var p = _args2[1];
    var i = _args2[2];
    return compile(vars, memo, i);
  };
};