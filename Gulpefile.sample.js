'use strict';

var pruno = require('pruno')
  .use(require('gulp'));

pruno(function(mix) {
  mix
    .configure('./config')
    .del({ dirs: ['::output'] })
    .js({ es6: true, runtime: true })
    .stylus('client', {
      entry: '::src/stylus/index.styl',
      dist: '::dist/public/styles/client.css'
    })
    .stylus('admin', {
      entry: '::src/stylus/admin.styl',
      dist: '::dist/public/styles/admin.css'
    })
    .koa()
    .livereload();
});
