/*! hansi - v0.1.0-alpha - 2013-11-28
* Copyright (c) 2013 Jonas Pommerening; Licensed MIT */
(function() {
  'use strict';

  if (typeof define === 'function' && define.amd) {
  } else if (typeof exports === 'object' && typeof require === 'function') {
  } else {
  }
})(function() {
  'use strict';

});

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

(function (global, definition) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(definition);
  } else if (typeof exports === 'object' && typeof require === 'function') {
    module.exports = definition();
  } else {
    if (typeof global.hansi === 'undefined') global.hansi = {};
    global.hansi.style = definition();
  }
})((typeof window === 'undefined' ? this : window), function() {
  'use strict';

  function add(value) {
    return function(current, prop) {
      var arr = prop || [];
      if (arr.indexOf(value) < 0) {
        arr.push(value);
      }
      return arr;
    };
  }

  function remove(value) {
    return function(current, prop) {
      var arr = prop || [];
      var idx = arr.indexOf(value);
      if (idx > 0) {
        arr.splice(idx);
      }
      return arr;
    };
  }

  var styles = [
    { // 0: reset
      'font-weight': null,
      'font-style': null,
      'background-color': null,
      'color': null,
      'text-decoration': null,
      'animation': null,
      'animation-duration': null
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
    { // 4: underline
      'text-decoration': add('underline')
    },
    { // 5: blink (slow)
      'animation': 'blink',
      'animation-duration': 0.8
    },
    { // 6: blink (rapid)
      'animation': 'blink',
      'animation-duration': 2.4
    },
    { // 7: image: negative
      'background-color': function() {
      },
      'color': function() {
      }
    },
    { // 8: conceal
      'visibility': 'hidden'
    },
    { // 9: crossed out
      'text-decoration': add('line-through')
    }
  ];

  remove('test');

  function style() {
    var current = {};
    return function next(num) {
      var obj;
      var key;
      var value;

      if (num > 0 && num <= styles.length) {
        obj = styles[num];

        for (key in obj) {
          value = (typeof obj[key] === 'function') ? obj[key](current, key) : obj[key];

          if (value === null) {
            delete current[key];
          } else {
            current[key] = value;
          }
        }
      }
      return current;
    };
  }

  return style;
});

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
