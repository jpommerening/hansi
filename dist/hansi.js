/*! hansi - v0.1.0-alpha - 2013-12-02
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

  var ANSI = /(\0x1b[@-_])([0-?]*)([ -\/]*[@-~])/;

  function splitArgs(str) {
    var args = str.split(';');

    for (var i = 0; i < args.length; i++) {
      args[i] = parseInt(args[i], 10);
    }
    return args;
  }

  function Iter(str) {
    if (!(this instanceof Iter))
      return new Iter(str);

    this.str = str || '';
    this.match = null;
  }

  Iter.prototype = {
    constructor: Iter,
    push: function push(str) {
      if (str)
        this.str += str;
      return this;
    },
    pop: function pop(chars) {
      var str;
      if (typeof chars === 'undefined') {
        str = this.str;
        this.str = '';
      } else {
        str = this.str.substring(0, chars);
        this.str = this.str.substring(chars);
      }
      return str;
    },
    next: function next(str) {
      var seq;
      if (str) this.push(str);
      if (!this.str) return null;
      if (!this.match) {
        this.match = ANSI.exec(this.str);
        if (!this.match) {
          return this.pop();
        } else if (this.match.index) {
          return this.pop(this.match.index);
        }
      }
      if (this.match) {
        seq = {
          start: this.match[1],
          args: this.match[2] ? splitArgs(this.match[2]) : [],
          end: this.match[3],
          str: this.pop(this.match[0].length)
        };
        this.match = null;
        return seq;
      }
      throw new Error('this code should never be reached');
    }
  };

  function iter(str) {
    var i = new Iter(str);
    return function next() {
      return i.next.apply(i, arguments);
    };
  }

  iter.Iter = Iter;

  return iter;
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

  function asObject(args) {
    var obj = args[0];
    if (typeof args[0] === 'string') {
      obj = {};
      obj[args[0]] = args[1];
    }
    return obj;
  }

  function asArray(args) {
    var arr = args[0];
    if (typeof args[0] === 'string') {
      arr = [];
      arr[0] = args[0];
    }
    return arr;
  }

  function wrap(body) {
    return function (props) {
      return function () {
        return body(this, props);
      };
    };
  }

  function wrapMethod(args, body) {
    return function () {
      body(this.state, args(arguments));
      return this;
    };
  }

  function set(obj, props) {
    for (var k in props) {
      obj[k] = props[k];
    }
  }

  function unset(obj, props) {
    for (var i = 0; i < props.length; i++) {
      delete obj[props[i]];
    }
  }

  function add(obj, props) {
    for (var k in props) {
      if (!obj[k]) obj[k] = [];
      obj[k].push(props[k]);
    }
  }

  function remove(obj, props) {
    for (var k in props) {
      if (props[k] in obj[k]) obj[k].splice(obj[k].indexOf(props[k]));
      if (!obj[k]) delete obj[k];
    }
  }

  var set_ = wrap(set);
  var unset_ = wrap(unset);
  var add_ = wrap(add);
  var remove_ = wrap(remove);

  var styles = [
    unset_(['font-weight', 'font-style', 'background-color', 'color', 'text-decoration',
            'animation', 'animation-duration', 'visibility']),
    set_({'font-weight': 'bold'}),
    set_({'font-weight': 'lighter'}),
    set_({'font-style': 'italic'}),
    add_({'text-decoration': 'underline'}),
    add_({'animation': 'blink', 'animation-duration': 0.8}),
    add_({'animation': 'blink', 'animation-duration': 2.4}),
    function () {
      // invert fg, bg
    },
    set_({'visibility': 'hidden'}),
    add_({'text-decoration': 'line-through'}),
    // 10, 11, ... 20
    unset_(['font-weight']),
    unset_(['font-weight']),
    unset_(['font-style']),
    remove_({'text-decoration': 'line-through'}),
    remove_({'animation': 'blink'})
  ];

  function Style(state) {
    if (!(this instanceof Style))
      return new Style(state);

    this.state = state || {};
  }

  Style.prototype = {
    constructor: Style,
    set: wrapMethod(asObject, set),
    unset: wrapMethod(asArray, unset),
    add: wrapMethod(asObject, add),
    remove: wrapMethod(asObject, remove),
    apply: function apply(num) {
      if ((typeof num !== 'undefined') && (num >= 0) && (num < this.styles.length)) {
        this.styles[num].apply(this.state, arguments);
      }
      return this;
    },
    next: function next() {
      this.apply.apply(this, arguments);
      return this.state;
    },
    styles: styles
  };

  function style(state) {
    var s = new Style(state);
    return function next() {
      return s.next.apply(s, arguments);
    };
  }

  style.Style = Style;
  style.styles = styles;

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
