/*global define, exports, require */
(function(definition) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(definition);
  } else if (typeof exports === tObject && typeof require === tFunction) {
    module.exports = definition();
  } else {
    this.hansi = definition();
  }
})(function() {
  'use strict';

  return {
  };
});
