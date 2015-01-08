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

  return Object.keys(params).reduce(function compile(...args) {
    var [obj, param, key, arr] = args;
    var val = obj[param];
    var type = getType(val);

    switch (type) {
      case 'string':
        obj[param] = val.replace(/(\:\:([A-z0-9\s_-]+))/g, (str, p1, p2) => {
          return vars[p2] || '';
        });
        break;
      case 'array':
        obj[param] = val.reduce(function(...arrArgs) {
          var [arr, p, i] = arrArgs;
          return compile(arr, i);
        }, obj[param]);
        break;
    }

    return obj;
  }, params);
}
