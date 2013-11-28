
/*global define, exports, require */
(function (global, definition) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(definition);
  } else if (typeof exports === 'object' && typeof require === 'function') {
    module.exports = definition();
  } else {
    if (typeof global.hansi === 'undefined') global.hansi = {};
    global.hansi.iter = definition();
  }
})((typeof window === 'undefined' ? this : window), function() {
  'use strict';

  var ANSI = /(\033[@-_])([0-?]*)([ -\/]*[@-~])/;

  function splitArgs(str) {
    var args = str.split(';');

    for (var i=0; i<args.length; i++) {
      args[i] = parseInt(args[i]);
    }
    return args;
  }

  return function iter(str) {
    var match = null;
    return function next() {
      var seq;
      if (!str) return null;
      if (!match) {
        match = ANSI.exec(str);
        if (!match) {
          seq = str;
          str = null;
          return seq;
        } else if (match.index) {
          seq = str.substring(0, match.index);
          str = str.substring(match.index);
          return seq;
        }
      }
      if (match) {
        seq = {
          start: match[1],
          args: match[2] ? splitArgs(match[2]) : [],
          end: match[3]
        };
        str = str.substring(match[0].length);
        match = null;
        return seq;
      }
      throw new Error('this code should never be reached');
    };
  };

});
