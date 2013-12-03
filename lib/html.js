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
})((typeof window === 'undefined' ? this : window), function() {
  'use strict';

  function HTML(elem) {
    if (!(this instanceof HTML))
      return new HTML(elem);

    this.elem = elem;
    this.live = [];
    this.shadow = [];
  }

  HTML.prototype = {
    constructor: HTML
  };

  function html(elem) {
    var h = new HTML(elem);
    return function next() {
      return h.next.apply(h, arguments);
    };
  }

  html.HTML = HTML;

  return html;
});
