# pruno
Mix up gulp tasks like prison hooch. Pruno is a package that lifts heavily (takes most of the code) from Laravel Elixer.
Some slight tweaks were made to allow for it to run tasks that build more complex front-end applications.

## Sample Gulpfile
```js
'use strict';

var gulp = require('gulp');
var pruno = require('pruno').use(gulp);

pruno(function(runner) {
  runner.publish('./node_modules/font-awesome/fonts/*', '/fonts/');
  runner.images('/assets/images/**/*', 'images');
  runner.assets(['!/assets/images/**/*', '/assets/**/*']);
  runner.koa('api/index.js')
  runner.stylus('index.styl');
  runner.browserify();
  runner.livereload(['./public/**/*']);
});

```
