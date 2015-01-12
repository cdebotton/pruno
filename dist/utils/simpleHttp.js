"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var express = _interopRequire(require("express"));

var serveStatic = _interopRequire(require("serve-static"));

var lr = _interopRequire(require("connect-livereload"));




var app = express();
app.use(lr());
app.use(serveStatic(process.env.DIST));

app.listen(3000, function (err, callback) {
  if (err) throw err;
  console.log("Simple HTTP server listening on port 3000");
});