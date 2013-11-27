/*global define, exports, require */
(function (definition) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(definition);
  } else if (typeof exports === 'object' && typeof require === 'function') {
    module.exports = definition();
  } else {
    this.hansi = definition();
  }
})(function () {
  'use strict';

  var styles = {
  };

  return {
    styles: styles
  };
});
