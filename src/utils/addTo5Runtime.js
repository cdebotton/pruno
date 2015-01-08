'use strict';

import through from 'through';

export default function (file) {
  var data = '';
  var header = 'require("pruno/node_modules/6to5ify/node_modules/6to5/polyfill");';
  var stream = through(write, end);

  function write(buf) {
    data += buf;
  }

  function end() {
    data = header + data;
    stream.queue(data);
    stream.queue(null);
  }

  return stream;
};
