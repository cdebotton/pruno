var util = require('gulp-util');
var fs = require('fs');

var config = {
    production: !! util.env.production,
    srcDir: 'app',
    assetDir: 'assets/',
    cssOutput: 'stylesheets',
    output: './public/',
    tasks: [],
    watchers: { default: {} },
    duplicate: [],
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

config.setDefaultsFrom = function(file) {
    var defaults;

    if (fs.existsSync(file)) {
        defaults = JSON.parse(fs.readFileSync(file, 'utf8'));
        Object.assign(this, defaults);
    }
};

module.exports = config;
