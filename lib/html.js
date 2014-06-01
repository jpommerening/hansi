/*global define, exports, require */
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
      return new HTML(tag, style, options);

    options = options || {};

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
