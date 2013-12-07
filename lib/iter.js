
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
