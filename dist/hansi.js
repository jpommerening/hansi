/*! hansi - v0.1.0-alpha - 2014-06-01
* Copyright (c) 2014 Jonas Pommerening; Licensed MIT */
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
})((typeof window === 'undefined' ? this : window), function () {
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
    write: function write(str) {
      if (str)
        this.str += str;
      return this;
    },
    read: function read(length) {
      var str;
      if (typeof length === 'undefined') {
        str = this.str;
        this.str = '';
      } else {
        str = this.str.substring(0, length);
        this.str = this.str.substring(length);
      }
      return str;
    },
    next: function next(str) {
      var seq;
      if (str) this.write(str);
      if (!this.str) return null;
      if (!this.match) {
        this.match = ANSI.exec(this.str);
        if (!this.match) {
          return this.read();
        } else if (this.match.index) {
          return this.read(this.match.index);
        }
      }
      if (this.match) {
        seq = {
          start: this.match[1],
          args: this.match[2] ? splitArgs(this.match[2]) : [],
          end: this.match[3],
          str: this.read(this.match[0].length)
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
      var idx = obj[k] ? obj[k].indexOf(props[k]) : -1;
      if (!obj[k]) obj[k] = [];
      if (idx < 0) obj[k].push(props[k]);
    }
  }

  function remove(obj, props) {
    for (var k in props) {
      var idx = obj[k] ? obj[k].indexOf(props[k]) : -1;
      if (idx >= 0) obj[k].splice(idx, 1);
      if (typeof obj[k] === 'object' && obj[k].length === 0) delete obj[k];
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

(function (global, definition) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(definition);
  } else if (typeof exports === 'object' && typeof require === 'function') {
    module.exports = definition();
  } else {
    if (typeof global.hansi === 'undefined') global.hansi = {};
    global.hansi.dom = definition();
  }
})((typeof window === 'undefined' ? this : window), function() {
  'use strict';

  function DOM(elem) {
    if (!(this instanceof DOM))
      return new DOM(elem);

    this.elem = elem;
    this.live = [];
    this.shadow = [];
  }

  DOM.prototype = {
    constructor: DOM
  };

  function dom(elem) {
    var d = new DOM(elem);
    return function next() {
      return d.next.apply(d, arguments);
    };
  }

  dom.DOM = DOM;

  return dom;
});

(function (global, definition) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(definition);
  } else if (typeof exports === 'object' && typeof require === 'function') {
    module.exports = definition();
  } else {
    if (typeof global.hansi === 'undefined') global.hansi = {};
    global.hansi.html = definition();
  }
})((typeof window === 'undefined' ? this : window), function () {
  'use strict';

  /*
  function isEmpty(object) {
    if (typeof object !== 'object') return !object;
    for (var prop in object) if (object.hasOwnProperty(prop)) return false;
    return true;
  }
  */

  function HTML(tag, style, options) {
    if (!(this instanceof HTML))
      return new HTML();

    this.height = options.height || 24;
    this.width = options.width || 80;
    this.line = 0;
    this.column = 0;
    this.buffer = [];
    this.lines  = [];
    this.offset = 0;
    this.push(tag, style);
  }

  HTML.prototype = {
    constructor: HTML,
    push: function push(name, props, str) {
      this.buffer.push({
        tag: name,
        style: props,
        str: str || ''
      });
      return this;
    },
    pop: function pop() {
      return this.buffer.pop();
    },
    detach: function detach() {
      var buffer = this.buffer;
      var tail = buffer[buffer.length - 1];
      this.buffer = [];
      this.push(tail.tag, tail.style);
      return buffer;
    },
    tag: function tag(name) {
      var tail = this.pop();
      if (tail.str) this.push(tail.name, tail.props, tail.str);
      return this.push(name, tail.props);
    },
    style: function style(props) {
      var tail = this.pop();
      if (tail.str) this.push(tail.name, tail.props, tail.str);
      return this.push(tail.name, props);
    },
    write: function write(str) {
      this.buffer[this.buffer.length - 1].str += str;
      return this;
    },
    read: function read(length) {
      if (typeof length === 'undefined' || length >= this.buffer.length)
        return this.detach();
      return this.buffer.splice(0, length);
    }
  };

  function html(tag) {
    var h = new HTML(tag);
    return function next(str) {
      if (typeof str === 'object') {
        h.style(str);
      }
      if (typeof str === 'string') {
        h.write(str);
      }
      return h.read();
    };
  }

  html.HTML = HTML;

  return html;
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
  './style',
  './html'
], function (iter, style, html) {
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
  hansi.html = html;

  return hansi;
});
