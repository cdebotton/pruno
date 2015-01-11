export default function(Task, params) {
  const defaults = Object.keys(Task.getDefaults())
    .concat(['taskName']);

  return Object.keys(params)
    .filter(param => defaults.indexOf(param) === -1)
    .reduce((memo, param) => {
      memo[param] = params[param];
      delete params[param];
      return memo;
    }, {});
}
