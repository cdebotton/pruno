# pruno
Mix up gulp tasks like prison hooch. Pruno is a package that lifts heavily (takes most of the code) from Laravel Elixer.
Some slight tweaks were made to allow for it to run tasks that build more complex front-end applications.

## Installation
Simply run `npm install -D pruno gulp` in your terminal.

## Sample Gulpfile
```js
'use strict';

/**
 * You must pass an instance of the projects local gulp so that the gulp cli
 * will take advantage of the pruno defined tasks.
 */

var gulp = require('gulp');
var pruno = require('pruno').use(gulp);

pruno(function(runner) {
  // Publish npm files.
  runner.publish('./node_modules/font-awesome/fonts/*', '/fonts/');

  // Copy and optimize image assets.
  runner.images('/assets/images/**/*', 'images');

  // Move other assets
  runner.assets(['!/assets/images/**/*', '/assets/**/*']);

  // Spin up the specified koa server.
  runner.koa('api/index.js')

  // Compile stylus files.
  runner.stylus('index.styl');

  // Run browserify.
  runner.browserify();

  // Use livereload to refresh koa server when files change.
  runner.livereload(['./public/**/*']);
});
```

## Module support
1. Stylus
2. SASS
3. LESS
4. React (through browserify)
5. 6to5 (es6 support through browserify)
6. imagemin
7. livereload
8. koa

### Writing custom modules
Writing custom modules is easy, just follow the boilerplate:
```js
var pruno = require('pruno');
var config = pruno.config;
var gulp = config.gulp;

pruno.extend('mytask', function(src, output, params) {
    gulp.task('mytask', function() {
      // Do some stuff
    });

    config.registerWatcher('mytask', './path/to/files/**/*.ext');
    return config.queueTask('mytask');
});
```
