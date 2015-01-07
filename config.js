var util = require('gulp-util');
var fs = require('fs');

var config = {
    production: !! util.env.production,
    tasks: [],
    watchers: { default: {} },
    duplicate: [],
    defaultOptions: {
        src: './app',
        output: './public'
    },
    concatenate: { css: [], js: [] }
};

config.registerWatcher = function(task, search, group) {
    group = group || 'default';

    this.watchers[group] = this.watchers[group] || {};
    this.watchers[group][task] = search;

    return this;
};

config.queueTask = function(task) {
    if (this.tasks.indexOf(task) == -1) {
        this.tasks.push(task);
    }

    return this;
};

config.setDefaults = function(defaults) {
    Object.assign(this.defaultOptions, defaults);
};

module.exports = config;
