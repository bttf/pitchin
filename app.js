var fs = require('fs');
var express = require('express');
var app = express();
var engines = require('consolidate');
var path = require('path');
var wav = require('wav');
var collect = require('collect-stream');
var detectPitch = require('detect-pitch');
var pk = require('./lib/pitch-kit');

var filename = 'temp.wav';
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

app.post('/audio', function(req, res, next) {
  if (req.get('Content-Type') !== 'audio/x-wav') {
    return;
  }
  var reader = new wav.Reader();
  console.log('receiving audio request ...');

  //console.log('opening stream for ' + path);
  //var stream = fs.createWriteStream(filename);
 
  reader.on('format', function(format) {
    console.log('calling collect ..');
    collect(reader, function(err, data) {
      var period;
      console.log('piping request ...');
      signal = data;
      period = detectPitch(signal);
      pitch = pk.getPitch(22050 / period);
      console.log('signal length is ' + signal.length);
      console.log('period is ' + period);
      console.log(22050 / period);
      console.log('note is ' + pk.getPitch(22050 / period));
      console.log('should be exiting collect now ...');
    });
    console.log('collect exited ...');
  });

  console.log('piping request ...');
  req.pipe(reader);
  console.log('calling next() ...');
  res.send(200, 'shit shit shit shit shit');
  //next();
});

app.listen(3000);

console.log('Listening on port 3000 ...');

