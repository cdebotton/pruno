var child_process = require('child_process'),
    merge = require('deepmerge'),
    lr = require('tiny-lr')();

import child_process from 'child_process';
import merge from 'deepmerge';
import tinyLr from 'tiny-lr';

var lr = tinyLr();

export default (function() {
    var service = null,
        defaultOptions = {
            env: 'development',
            file: 'app.js',
            port: 35729
        };

    var livereload = {
        start: function (port) {
            lr.listen(port);
        },
        reload: function (fileName) {
            lr.changed({body: { files: [fileName] }});
        }
    };
    return {
        run: function (newOptions) {
            var options = merge(defaultOptions, newOptions || {});

            if (service) {
                service.kill('SIGKILL');
                service = undefined;
            } else {
                livereload.start(options.port);
            }

            process.env.NODE_ENV = options.env;

            if( options.args == undefined ) {
                service = child_process.spawn('node', ['--harmony', options.file], {
                    NODE_ENV: options.env
                });
            } else {
                var args = options.args;
                args.push('--harmony');
                args.push( options.file );
                service = child_process.spawn('node', args, {
                    NODE_ENV: options.env
                });
            }


            service.stdout.setEncoding('utf8');
            service.stderr.setEncoding('utf8');
            service.stdout.on('data', function (data) {
                console.log(data.trim());
            });
            service.stderr.on('data', function (data) {
                console.log(data.trim());
            });
            service.on('exit', function (code, sig) {
                console.log('service process exit ... ', code, sig);
            });
            process.on('exit', function (code, sig) {
                console.log('main process exit ... ', code, sig);
                service.kill();
            });

            return service;
        },
        notify: function (event) {
            var fileName = require('path').relative(__dirname, event.path);
            livereload.reload(fileName);
        }
    };
})();
