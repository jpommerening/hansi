/*global define, exports, require */
(function (global, deps, definition) {
  'use strict';

  if (typeof global.navigator === 'object') {
    deps.push('./browser');
  }
  if (typeof global.process === 'object' && global.process.version) {
    deps.push('./node');
  }

  if (typeof define === 'function' && define.amd) {
    define(deps, definition);
  } else if (typeof exports === 'object' && typeof require === 'function') {
    module.exports = definition.apply(global, deps.map(require));
  } else {
    for (var i=0; i<deps.length; i++) {
      if (deps[i].substring(0, 2) === './')
        deps[i] = global.hansi[deps[i].substring(2)];
      else
        deps[i] = global[deps[i]];
    }
    global.hansi = definition.apply(global, deps);
  }
})((typeof window === 'undefined' ? this : window), [
  './iter',
  './style'
], function (iter, style) {
  'use strict';

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
    }
  };

  function hansi(str) {
    var next = iter(str);
    var seq;
    var out = '';
    while ((seq = next()) !== null) {
      if (typeof seq === 'string') {
        out += seq;
      }
    }
    return out;
  }

  hansi.Hansi = Hansi;
  hansi.style = style;
  hansi.iter = iter;
 
  return hansi;
});
