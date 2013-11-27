/*! hansi - v0.1.0 - 2013-11-27
* Copyright (c) 2013 Jonas Pommerening; Licensed MIT */
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
