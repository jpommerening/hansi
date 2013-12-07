/*global describe */
describe('hansi', function () {
  'use strict';

  global.hansi = require('../lib/index.js');

  require('./iter');
  require('./style');
  require('./html');
});
