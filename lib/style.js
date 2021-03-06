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
