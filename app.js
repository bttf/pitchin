var fs = require('fs');
var express = require('express');
var app = express();
var engines = require('consolidate');
var path = require('path');
var wav = 'temp.wav';

app.engine('html', engines.handlebars);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/elmo', function(req, res) {
  // don't ask questions
  res.render('elmo');
});

app.post('/audio', function(req, res, next) {
  if (req.get('Content-Type') !== 'audio/x-wav') {
    return;
  }

  console.log('opening stream for ' + path);
  var stream = fs.createWriteStream(wav);
  req.pipe(stream);
  req.on('end', next);
});

app.listen(3000);

console.log('Listening at http://localhost:3000 ...');

