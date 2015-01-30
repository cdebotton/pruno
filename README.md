# pruno
Pruno is a globally installed build tool manager and project scaffolding tool that is configured by environment-based yaml files. It currently has several modules for compiling project resources, running servers, minifying images, and more. Pruno will also scaffold out projects with various generators. Currently, React is the primary focus.

Pruno is modular, so you only need to install what you need. This package includes scaffolding tools as well as an abstraction on top of gulp for making writing your gulpfiles dead simple.

### Build tool
To use pruno to build assets, install pruno and gulp as devDependencies with `npm install -D pruno gulp`. Then create a `gulpfile.js` in the root of your project. Instead of interacting directly with gulp, you will use pruno to generate your gulp tasks.

```js
"use strict";

var pruno = require('pruno');

pruno(function(mix) {
  return mix;
});
```

Pruno does not come with mixes (task groups), to add functionality, you need to install one or more of the different mixes on npm as `"dependencies"` or `"devDependencies"`.

#### Mixes
- `npm install -s pruno-js` [[npm]](http://npmjs.com/package/pruno-js)
  - Provides the `.js(...)` mix, which will use browserify to build your javascript assets with browserify providing sourcemaps, uglification, ES6 transforms, React transforms, and env transforms.
- `npm install -s pruno-stylus` [[npm]](http://npmjs.com/package/pruno-stylus)
  - Provides the `.stylus(...)` mix, which compiles stylus files with normalize.css, font-awesome, nib, jeet, and rupture.
- `npm install -s pruno-less` [[npm]](http://npmjs.com/package/pruno-less)
  - Provides the `.less(...)` mix, which compiles LESS files with normalize.css, and font-awesome.
- `npm install -s pruno-sass` [[npm]](http://npmjs.com/package/pruno-sass)
  - Provides the `.sass(...)` mix, which compiles SASS files with normalize.css, and font-awesome.
- `npm install -s pruno-http` [[npm]](http://npmjs.com/package/pruno-http)
  - Provides the `.http(...)` mix, which provides a static server for prototyping, or allows you to run your own server with node `--harmony` flags.
- `npm install -s pruno-publish` [[npm]](http://npmjs.com/package/pruno-publish)
  - Provides the `.publish(...)` mix, which publishes assets to your public directory.
- `npm install -s pruno-jade` [[npm]](http://npmjs.com/package/pruno-jade)
  - Provides the `.jade(...)` mix, which compiles jade templates.
- `npm install -s pruno-swig` [[npm]](http://npmjs.com/package/pruno-swig)
  - Provides the `.swig(...)` mix, which compiles swig templates.
- `npm install -s pruno-livereload` [[npm]](http://npmjs.com/package/pruno-livereload)
  - Provides the `.livereload(...)` mix, which provides livereload to non-node server environments.
- `npm install -s pruno-lint` [[npm]](http://npmjs.com/package/pruno-lint)
  - Provides the `.lint(...)` mix, which runs ESLint.
- `npm install -s pruno-mocha` [[npm]](http://npmjs.com/package/pruno-mocha)
  - Provides the `.mocha(...)` mix, which runs mocha tests.

To install and use some mixes, try this:

In your terminal, after installing gulp and pruno, install the following mixes: `npm install -D pruno-js`, `npm install -D pruno-stylus`, `npm install pruno-mocha`, `npm install -D pruno-http`. Then in your gulpfile.js, use the following code.

```js
"use strict";

var pruno = require('pruno');

// Load all pruno-mixes that are installed as dependencies or devDependencies.
pruno.plugins();

pruno(function(mix) {
    return mix
      .js({ es6: true })
      .stylus({normalize: true, 'font-awesome': true})
      .mocha()
      .http();
});
```

With this, running `gulp` will run all non-lasting tasks (`js`, `stylus`, `mocha`). These are the scripts that only need to be run once. It will compile Javascript with es6 and react transforms, compile stylus, prepending font-awesome and normalize.css, and run mocha tests.

With `gulp watch`, it will continually run the one-off tasks when the files they watch change, it will run the tasks that continue to run. In this case, it will spin up a simple static server accessible at `http://localhost:3000`.


### Configuration
Pruno comes with a configure mix, it is used to point to the configuration file for the project. Pruno.configure(...) will read cascaded yaml files based on environment. To use the configure mix, in your gulpfile, use the following command:

```js
// ...

pruno(function(mix) {
    mix
      .configure({dir: __dirname + '/config'});
});

// ...
```

This will tell pruno to look at your `./config` directory and read yaml files organized by environment. Files found in the root of the folder are set as defaults, and overridden by the contents of the yaml files in nested environment folders. These files should be organized in this structure:

```yaml
# ./config/pruno.yaml
vars:
  dist: ./public
  src: ./app

js:
  es6: true
  dist: '::dist/bundle.js'

stylus:
  font-awesome: true
  normalize: true
  dist: '::dist/stylesheets/app.css'
```

```yaml
# ./config/production/yaml

js:
  uglify: true
  source-maps: false
  dist: '::dist/bundle.min.js'

stylus:
  minify: true
  source-maps: false
  dist: '::dist/stylesheets/app.min.css'
```

These yaml files will compile down to configuration objects for pruno-js and pruno-stylus mixes in development and production environments. To run pruno in a specific environment, set the NODE_ENV while running gulp. Eg, `NODE_ENV=production gulp`. Given the following gulpfile.js:

```js
// ...
pruno(function(mix) {
  return mix
    .configure({dir: __dirname + '/config'})
    .stylus()
    .js();
});
// ...
```

If gulp is run in the production environment, stylus will be run with default values extended by the environment specific configuration. One important thing to note is the user of `::dist` and `::src`, they reference the vars defined in your pruno.yaml file. You can define any variables you want, and variables can differ from environment to environment.

## CLI tool (global)

### Commands
By running `npm install -g pruno`, you will be given access to the pruno terminal command.
Executing `pruno --help` will list the available commands.

```
  Usage: pruno [options] [command]


  Commands:

    init [options] <name> [scaffold]  Initialize Pruno for this project.
    [...commands] [options]           undefined

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

### Client tools

To initialize a React/Flux project, run `pruno init react`. This will setup the proper folder structure and create your boilerplate files. It will also require the following dependencies:

#### Libraries
- react
- react-router
- fluxd

#### Build
- gulp
- pruno
- pruno-js
- pruno-stylus
- pruno-http
- pruno-publish
- pruno-images

### Server tools

To initialize a koa/sql server, use `pruno init koa`. This will setup a koa backend with routes, models, and a sequelize database scaffold. It will install the following dependencies:

#### Http
- koa
- koa-bodyparser
- koa-compress
- koa-json
- koa-static
- koa-mount
- koa-router
- koa-isomorphic

#### Database
- sequelize
- sequelize-cli
- pg
- pg-hstore
