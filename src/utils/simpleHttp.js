import express from 'express';
import serveStatic from 'serve-static';
import lr from 'connect-livereload';


var app = express();
app.use(lr());
app.use(serveStatic(process.env.DIST));

app.listen(3000, function(err, callback) {
  if (err) throw err;
  console.log('Simple HTTP server listening on port 3000');
});
