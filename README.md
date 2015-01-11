# pruno
A gulp task manager with cascading configuration. Pruno was inspired by Laravel Elixer and adds several features like a simplified task syntax and cascading configuration.

## Installation
Simply run `npm install -D pruno gulp` in your terminal.

## Use

### Supported commands
With pruno, you can run `gulp`, `gulp watch`, `gulp --production` or
`NODE_ENV={yourEnv} gulp (watch?)`. Gulp will run using the configuration
that matches your environment.

### Module support
- es6 (as a param in the js module)
- imagemin
- jade (with gulp-data support)
- koa
- less
- livereload
- mocha (with coffee and should support as params)
- react (as a param in the js module)
- sass/scss
- stylus
- swig (with gulp data support)

### Simple Configuration
Using pruno is as simple as telling it which tasks to run. It assumes a set of
default configuration options to let you get started quickly.
```js
'use strict';

/**
 * You must pass an instance of the projects local gulp so that the gulp cli
 * will take advantage of the pruno defined tasks.
 */

var pruno = require('pruno')
       .use(require('gulp'));

pruno(function(mix) {
  mix
    .assets()
    .publish()
    .stylus()
    .browserify()
    .koa()
    .livereload();
});
```

### Yaml Configuration

If you want to change the global defaults used by Pruno, you can point
it to a directory that holds the environment-based yaml configuration.
Pruno leverages [yaml-env-config](https://www.npmjs.com/package/yaml-env-config),
so any configuration must be stored in a pruno.yaml file.

```yaml
# config/pruno.yaml

browserify:
  es6: true
  runtime: true
  entry: ./src/javascripts/entry.js
  dist: ./dist/application.js
stylus:
  entry: ./src/styles/index.styl
  dist: ./dist/app.css
  normalize: true
  font-awesome: true
```

```yaml
# config/production/pruno.yaml

browserify:
  uglify: true
  source-maps: false
  dist: ./dist/application.min.js
stylus:
  source-maps: false
  minify: true
  dist: ./dist/app.min.css
```

To use these commands, in our pruno run block, we would start the calls off
with the following:

```js
pruno(function(mix) {
    mix.configure('./config')
      .assets()
      // ...
});
```

By running any of the `gulp` commands, gulp will compile your code based on
the parameters set in those config files.

### Inline Configuration
Lastly you can use inline configuration in your  Gulpfile to override your
env-configuration as well as the Pruno defaults. In our Gulpfile, let's do this:

```js
var pruno = require('pruno')
       .use(require('gulp'));

pruno(function(mix) {
  mix.configure('./config')
  .stylus({
    entry: './app/styles/client.styl',
    dist: './public/stylesheets/client.css'
  })
  .stylus({
    entry: './app/styles/admin.styl',
    dist: './pubic/stylesheets/admin.css'
  })
  .browserify()
  .publish({
    sources: [
      './node_modules/font-awesome/fonts/**/*'
    ],
    dist: './public/fonts/'
  });
});
```

### Writing custom modules
Writing custom modules is easy, just follow the boilerplate:
```js
// ES6
import pruno from 'puno';

class MyCustomTask {
  // Declare the default parameters for the module.
  static getDefaults() {
    return {moduleA: true, moduleB: false, search: ['./app/**/*.coffee']};
  }

  // Do initialization in the constructor.
  constructor(params = {}) {
    this.params = {};
  }

  // Action taken when running task a single time.
  // gulp is the reference to the project's gulp instance,
  // and params are the compiled cascaded configuration.
  enqueue(gulp, params = {}) {
    return gulp.src(params.entry)
      .pipe(someGulpPlugin())
      .pipe(gulp.dist(params.dist));
  }

  generateWatcher(gulp, params) {
    return () => {
      // Watch action
    }
  }
}

export default pruno.extend(MyCustomTask);
```

```js
var pruno = require('pruno');

// ES5
function MyCustomTask(params) {
  this.params = params;
}

MyCustomTask.getDefaults = function() {
  return {moduleA: true, moduleB: false, search: ['./app/**/*.coffee']};
};

MyCustomTask.prototype.enqueue = function(gulp, params) {
  return gulp.src(params.entry)
    .pipe(someGulpPlugin())
    .pipe(gulp.dist(params.dist));
};

MyCustomTask.prototype.generateWatcher = function(gulp, params) {
  return function() {
    // Do watching action.
  };
}

module.exports = pruno.extend(MyCustomTask);
```

A note on watchers, if you want to simply run a simple gulp.watch on the
files described in params.search, all you need to do is return true from
generateWatcher(...).

```js
class MyTask {
  // ...

  generateWatcher() {
    return true;
  }

  // ...
}
```

### Default configuration
#### Development Environment

```yaml
assets:
  sources:
    - '!./app/assets/images/**/*',
    - ./app/assets/**/*
  dist: ./public/

browserify:
  entry: ./app/index.js
  dist: ./public/bundle.js
  uglify: false
  source-maps: true
  es6: false
  runtime: false

del:
  - ./public/

images:
  src: ./app/assets/img/**/*
  dist: ./public/img/
  use:
    - imagemin-pngcrush

swig:
  data: ::src/templates/data
  entry: ::src/templates/**/*.jade
  dist: ::dist
  search:
    - ::src/templates/**/*.jade

koa:
  env: development
  server: ./server.js

less:
  entry: ./app/less/index.less
  dist: ./public/stylesheets/app.css
  search: ./app/**/*.less
  minify: false
  source-maps:true
  font-awesome: false
  normalize: false

mocha:
  search:
    - ./src/**/*.js
    - ./tests/**/*.js
    - ./tests/**/*.coffee
  coffee: false
  use:
    - should
  runner: spec

publish:
  src: null
  dist: null

sass:
  entry: ./app/sass/index.sass
  dist: ./public/stylesheets/app.css
  search:
    - ./app/**/*.sass
    - ./app/**/*.scss
  minify: false
  source-maps:true
  font-awesome: false
  normalize: false

stylus:
  entry: ./app/stylus/index.styl
  dist: ./public/stylesheets/app.css
  search: ./app/**/*.styl
  minify: false
  source-maps:true
  font-awesome: false
  normalize: false
  use:
    - nib
    - jeet
    - rupture

swig:
  data: ::src/templates/data
  entry: ::src/templates/**/*.html
  dist: ::dist
  search:
    - ::src/templates/**/*.html
```

#### Config variables
Pruno supports configuration variable using the '::var' syntax. To declare
a variable, it must be declared in yaml at the top level of the pruno
configuration object.

By default, two global config vars are set. `src: ./app` and `output: ./public`.

To use a variable, simply reference its variable name with a preceding '::'.
For example:

```yaml
# config/pruno

src: ./src
output: ./dist

stylus:
  entry: ::src/stylesheets/index.styl
  dist: ::output/scripts/bundle.js
```
