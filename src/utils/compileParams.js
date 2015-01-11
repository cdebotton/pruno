'use strict';

import assign from 'object-assign';
import getType from './getType';

export default function compileParams(taskName, defaults, baseSettings, params, settings) {
  var paramsList  = [{}, defaults, baseSettings];
  var [taskName, methodName] = taskName.split(':');

  var methodSettings = baseSettings[methodName];
  if (methodSettings) {
    paramsList.push(methodSettings);
    delete taskSettings[methodName];
  }

  paramsList.push(params);

  var vars = assign({}, settings.vars);
  var params = assign.apply(null, paramsList);

  return Object.keys(params).reduce(compile.bind(null, vars), params);
};

var compile = (...args) => {
  var [vars, obj, param] = args;
  var val = obj[param];
  var type = getType(val);

  switch (type) {
    case 'string':
      obj[param] = val.replace(/(\:\:([A-z0-9\s_-]+))/g, (...matches) => {
        return vars[matches[2]] || '';
      });
      break;
    case 'array':
      obj[param] = val.reduce(inspectProperty(vars), val);
      break;
    case 'object':
      obj[param] = Object.keys(val).reduce(inspectProperty(vars), val);
      break;
  }

  return obj;
};

var inspectProperty = (vars) => {
  return (...args) => {
    var [memo, p, i] = args;
    return compile(vars, memo, i);
  }
};
