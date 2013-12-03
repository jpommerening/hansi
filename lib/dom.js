/*global define, exports, require */
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
