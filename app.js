var fs = require('fs');
var express = require('express');
var app = express();
var path = 'temp.wav';

app.post('/audio', function(req, res, next) {
  if (req.get('Content-Type') !== 'audio/x-wav') {
    return;
  }

  console.log('opening stream for ' + path);
  var stream = fs.createWriteStream(path);
  req.pipe(stream);
  req.on('end', next);
});

app.listen(3000);

