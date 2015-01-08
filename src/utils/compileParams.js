'use strict';

import assign from 'object-assign';

export default function compileParams(taskName, defaults, opts, settings) {
  var paramsList  = [{}, defaults];
  var [taskName, methodName] = taskName.split(':');

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

  return Object.keys(params).reduce((obj, param) => {
    var val = params[param];
    if (typeof val === 'string') {
      obj[param] = val.replace(/(\:\:([A-z0-9\s_-]+))/g, (str, p1, p2) => {
        return vars[p2] || '';
      });
    }

    return obj;
  }, params);
}
