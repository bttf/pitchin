var fs = require('fs');
var express = require('express');
var app = express();
var engines = require('consolidate');
var path = require('path');
var wav = require('wav');
var collect = require('collect-stream');
var detectPitch = require('detect-pitch');
var pk = require('./lib/pitch-kit');

var signal = [];
var pitch = '';

app.engine('html', engines.handlebars);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/elmo', function(req, res) {
  res.render('elmo');
});

app.get('/getPitch', function(req, res) {
  res.send(200, pitch);
});

app.get('/getNotes', function(req, res) {
  var str = '';
  var notes = pk.getMajorScale(pitch);
  str += '<ul>';
  for (var i = 0; i < notes.length; i++) {
    str += '<li>' + i + ' ' + notes[i] + '</li>';
  }
  str += '</ul>';
  res.send(200, str);
});

app.post('/audio', function(req, res, next) {
  if (req.get('Content-Type') !== 'audio/x-wav') return;
  var reader = new wav.Reader();
  reader.on('format', function(format) {
    collect(reader, function(err, data) {
      var period = detectPitch(data);
      pitch = pk.getPitch(22050 / period);
    });
  });

  req.pipe(reader);
  next();
});

app.listen(3000);

console.log('Listening on port 3000 ...');

