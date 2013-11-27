/*! hansi - v0.1.0 - 2013-11-27
* Copyright (c) 2013 Jonas Pommerening; Licensed MIT */
(function(definition) {
  'use strict';

  var tObject = 'object';
  var tFunction = 'function';

  if (typeof define === tFunction && define.amd) {
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

(function(adapter) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    require(['hansi'], adapter);
  } else if (typeof exports === 'object' && typeof require === 'function') {
    adapter(require('hansi'));
  } else {
    adapter(this.hansi);
  }
})(function(hansi) {
  'use strict';

  console.log('adapter', hansi);
});
