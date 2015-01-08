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

function compileParams(taskName, defaults, opts, settings) {
  var paramsList = [{}, defaults];
  var _taskName$split = taskName.split(":");

  var _taskName$split2 = _slicedToArray(_taskName$split, 2);

  var taskName = _taskName$split2[0];
  var methodName = _taskName$split2[1];


  var taskSettings = settings[taskName];
  if (taskSettings) {
    paramsList.push(taskSettings);

    var methodSettings = taskSettings[methodName];
    if (methodSettings) {
      paramsList.push(methodSettings);
      delete taskSettings[methodName];
    }
  }
  opts || (opts = {});
  paramsList.push(opts);

  var vars = assign({}, settings.vars);
  var params = assign.apply(null, paramsList);

  return Object.keys(params).reduce(function (obj, param) {
    var val = params[param];
    if (typeof val === "string") {
      obj[param] = val.replace(/(\:\:([A-z0-9\s_-]+))/g, function (str, p1, p2) {
        return vars[p2] || "";
      });
    }

    return obj;
  }, params);
}