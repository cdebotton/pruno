# pruno
A gulp task manager with cascading configuration. Pruno was inspired by Laravel Elixer and adds several features like a simplified task syntax and cascading configuration.

## Installation
Simply run `npm install -D pruno gulp` in your terminal.

## Use

### Supported commands
With pruno, you can run `gulp`, `gulp watch`, `gulp --production` or
`NODE_ENV={yourEnv} gulp (watch?)`. Gulp will run using the configuration
that matches your environment.

### Simple Configuration
Using pruno is as simple as telling it which tasks to run. It assumes a set of
default configuration options to let you get started quickly.
```js
'use strict';

/**
 * You must pass an instance of the projects local gulp so that the gulp cli
 * will take advantage of the pruno defined tasks.
 */

var gulp = require('gulp');
var pruno = require('pruno').use(gulp);

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
var gulp = require('gulp');
var pruno = require('pruno').use(gulp);

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

koa:
  env: development
  server: ./server.js

publish:
  src: null
  dist: null

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
```

#### Production Environment
