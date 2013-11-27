/*! hansi - v0.1.0 - 2013-11-28
* Copyright (c) 2013 Jonas Pommerening; Licensed MIT */
(function (definition) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(definition);
  } else if (typeof exports === 'object' && typeof require === 'function') {
    module.exports = definition();
  } else {
    this.hansi = definition();
  }
})(function () {
  'use strict';

  var ANSI = /(\033[@-_])([0-?]*)([ -\/]*[@-~])/;

  function iter(str) {
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
          args: match[2] ? match[2].split(';') : [],
          end: match[3]
        };
        str = str.substring(match[0].length);
        match = null;
        return seq;
      }
      // This should never, ever happen
      throw ['oh shit.', 'im so in trouble'];
    };
  }

  function Hansi(options) {
    if (!(this instanceof Hansi))
      return new Hansi(options);

    this.chunks = [];
    this.cursor = { ln: 0, ch: 0 };
  }

  function or(a, b) { return (a === undefined) ? b : a; }

  function CUU(n) { this.cursor.ln -= or(n, 1); }
  function CUD(n) { this.cursor.ln += or(n, 1); }
  function CUF(n) { this.cursor.ch += or(n, 1); }
  function CUB(n) { this.cursor.ch -= or(n, 1); }
  function CNL(n) { this.cursor.ln += or(n, 1); this.cursor.ch = 0; }
  function CPL(n) { this.cursor.ln -= or(n, 1); this.cursor.ch = 0; }
  function CHA(n) { this.cursor.ch = or(n, 0); }
  function CUP(x, y) { this.cursor.ln = x; this.cursor.ch = y; }
  function ED() {
  }
  function EL() {
  }
  function SU() {
  }
  function SD() {
  }
  var HVP = CUP;
  function SGR() {
  }
  function DSR(n) {
    if (n === 6) {
    }
  }
  function SCP() {
  }
  function RCP() {
  }

  Hansi.prototype = {
    constructor: Hansi,
    esc: '\0x33',
    seq: {
      A: CUU,
      B: CUD,
      C: CUF,
      D: CUB,
      E: CNL,
      F: CPL,
      G: CHA,
      H: CUP,
      J: ED,
      K: EL,
      S: SU,
      T: SD,
      f: HVP,
      m: SGR,
      n: DSR,
      s: SCP,
      u: RCP,
      l: undefined,
      h: undefined
    },
    styles: [
      { // 0: reset/normal
      },
      { // 1: bold
        'font-weight': 'bold'
      },
      { // 2: light
        'font-weight': 'lighter'
      },
      { // 3: italic/inverse
        'font-style': 'italic'
      },
      { // 4:
      }
    ],
    iter: iter
  };

  return Hansi;
});

(function(adapter) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    require(['hansi'], adapter);
  } else if (typeof exports === 'object' && typeof require === 'function') {
    adapter(require('hansi'));
  } else {
    adapter(this.hansi);
  }
})(function(hansi) {
  'use strict';

  console.log('adapter', hansi);
});
