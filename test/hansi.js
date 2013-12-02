/*global describe, it, require, define */
(function (name, spec) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    require('hansi', function(hansi) { describe(name, spec(hansi)); });
  } else if (typeof exports === 'object' && typeof require === 'function') {
    module.exports = describe(name, function () { return spec(require('../lib/index.js')); });
  } else {
    describe(name, function () { return spec(window.hansi); });
  }
})('hansi', function(hansi) {

  describe('#iter(str)', function () {

    it('returns a function', function () {
      var next = hansi.iter('test');
      next.should.be.an.instanceOf(Function);
    });

    describe('the returned function', function () {

      it('returns one string for plaintext', function () {
        var next = hansi.iter('test');
        next().should.equal('test');
      });

      it('returns an object if an escape sequence was given', function () {
        var next = hansi.iter('\033[1m');
        next().should.be.an.instanceOf(Object);
      });

      it('returns `null` if an empty string was given', function () {
        var next = hansi.iter('');
        (next() === null).should.equal(true);
      });

      it('returns `null` after all elements have been consumed', function () {
        var next = hansi.iter('test');
        next();
        (next() === null).should.equal(true);
      });

      it('does not return empty strings between adjacend escape sequences', function () {
        var next = hansi.iter('\033[1mbold\033[m\033[4munderline');

        next().should.be.an.instanceOf(Object);
        next().should.equal('bold');
        next().should.be.an.instanceOf(Object);
        next().should.be.an.instanceOf(Object);
        next().should.equal('underline');
        (next() === null).should.equal(true);
      });

      it('accepts unknown escape sequences', function () {
        var next = hansi.iter('\033@1235~\033_123@');

        next.should.not.throwError();
        next.should.not.throwError();
        (next() === null).should.equal(true);
      });

    });

    describe('the value returned for escape sequences', function () {
      var reset = hansi.iter('\033[m')();
      var bold = hansi.iter('\033[1m')();
      var color = hansi.iter('\033[38;5;172m')();
      var unknown = hansi.iter('\033@123/~')();

      it('is an object', function () {
        reset.should.be.an.instanceOf(Object);
        bold.should.be.an.instanceOf(Object);
        color.should.be.an.instanceOf(Object);
      });

      it('contains the CSI in the `start` property', function () {
        reset.should.have.property('start', '\033[');
      });

      it('contains the command identifier in the `end` property', function () {
        reset.should.have.property('end', 'm');
        bold.should.have.property('end', 'm');
        color.should.have.property('end', 'm');
      });

      it('contains arguments in the `args` property', function () {
        reset.should.have.property('args');
        bold.should.have.property('args');
        color.should.have.property('args');
      });

      it('stores arguments as numbers', function () {
        reset.should.have.property('args').eql([]);
        bold.should.have.property('args').eql([1]);
        color.should.have.property('args').eql([38, 5, 172]);
      });

      it('has meaningful values even for unknown sequences', function () {
        unknown.should.be.an.instanceOf(Object);
        unknown.should.have.property('start', '\033@');
        unknown.should.have.property('args').eql([123]);
        unknown.should.have.property('end', '/~');
      });

    });

  });

  describe('#style(options)', function () {

    it('returns a function', function () {
      var next = hansi.style();
      next.should.be.an.instanceOf(Function);
    });

    it('takes an object parameter for initialization', function() {
      var next = hansi.style({'font-weight': 'bold'});
      next.should.be.an.instanceOf(Function);
    });

    describe('the returned function', function () {

      it('returns a object of styles to be applied', function () {
        var next = hansi.style();
        next().should.be.an.instanceOf(Object);
      });

      it('does not modify the current state if no parameters were given', function () {
        var next = hansi.style({'font-weight': 'bold'});
        var bold = next();
        bold.should.have.property('font-weight', 'bold');
      });

      it('applies styles when called with a numeric parameter', function () {
        var next = hansi.style();
        var bold = next(1);
        bold.should.have.property('font-weight', 'bold');
      });

      it('resets all styles when called with ´0´', function () {
        var next = hansi.style({'font-weight': 'bold'});
        var empty = next(0);
        empty.should.eql({});
      });

    });

  });

});
