/*global define, exports, require */
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
