var pruno = require('../..');
var config = pruno.config;
var defaultOptions = config.defaultOptions;

var isType = function(obj, type) {
  var str = Object.prototype.toString.call(obj);
  return str.toLowerCase() === '[object ' + type.toLowerCase() + ']';
};

var optionSearch = /(\:\:([A-z0-9\s-_]*))/g;

function replaceString(val) {
  return val.replace(optionSearch, function(str, p1, p2) {
    return defaultOptions[p2] || '';
  });
}

function mapArray(val) {
  return val.map(function(n) {
    if (isType(n, 'object')) {
      return assignVars(n);
    }
    else if(isType(n, 'array')) {
      return mapArray(n);
    }
    else if(! isType(n, 'string')) {
      return n;
    }
    else if (isType(n, 'string')) {
      return replaceString(n);
    }
  });
}

var assignVars = module.exports = function assignVars(options) {
  return Object.keys(options).reduce(function(obj, option) {
    var val = options[option];

    if (isType(val, 'object')) {
      obj[option] = assignVars(val);
    }
    else if(isType(val, 'array')) {
      obj[option] = mapArray(val);
    }
    else if(! isType(val, 'string')) {
      obj[option] = val;
    }
    else if(isType(val, 'string')) {
      obj[option] = replaceString(val);
    }

    return obj;
  }, {});
};

assignVars.mapArray = mapArray;
