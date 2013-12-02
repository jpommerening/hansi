/*global describe */
describe('hansi', function () {
  'use strict';

  global.hansi = require('../lib/index.js');

  require('should');
  require('./iter');
  require('./style');
});
