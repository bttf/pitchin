(function() {
  "use strict";

  var leftBound = 220;
  var rightBound = 438;
  var tones = [ 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C' ];

  function amplifyBetweenMinMax(freq) {
    while (freq < leftBound) {
      freq *= 2;
    }
    while (freq > rightBound) {
      freq /= 2;
    }
    return freq;
  }
  
  exports.getMajorScale = function(root) {
    var index;
    var notes = [];
    for (var i = 0; i < tones.length; i++) {
      if (tones[i] === root) {
        index = i;
        break;
      }
    }
    for (var i = 0; i < 7; i++) {
      var offset = (index + tones.length) % tones.length;
      notes[i] = tones[offset];
      if (i == 0 ||
          i == 1 ||
          i == 3 ||
          i == 4 ||
          i == 5) {
        index += 2;
      }
      else {
        index++;
      }
    }
    return notes;
  };

  exports.getFrequencies = function() {
    var freqs = [];
    for (var i = 0; i < tones.length; i++) {
      freqs[i] = Math.pow(Math.pow(2, 1/12), i) * 220;
    }
    return freqs;
  };

  function midPoint(x, y) {
    if (x < y) {
      return((((y-x)/2)+x));
    }
    if (x > y) {
      return((((x-y)/2)+y));
    }
    if (x == y) {
      return 0;
    }
  }

  exports.getPitch = function(freq) {
    var index;
    var pitch = this.getFrequencies();
    freq = amplifyBetweenMinMax(freq);
    for (var i = 0; i < pitch.length; i++) {
      if (i-1 >= 0) {
        if (freq >= midPoint(pitch[i], pitch[i-1])) {
          index = i;
        }
      }
      else {
        index = i;
      }
    }
    if (index !== undefined) {
      return tones[index];
    }
  };

}());

