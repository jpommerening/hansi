/*global describe, it, beforeEach */
describe('style([object])', function () {
  'use strict';

  var hansi = (typeof window !== 'undefined' ? window : global).hansi;

  describe('when called as a function', function () {

    it('takes an object parameter for initialization', function () {
      var next = hansi.style({'font-weight': 'bold'});
      next.should.be.an.instanceOf(Function);
    });

    it('returns a function', function () {
      var next = hansi.style();
      next.should.be.an.instanceOf(Function);
    });

    describe('the returned function', function () {

      it('returns an object of styles to be applied', function () {
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

  describe('#Style([object])', function () {

    it('creates a `Style` instance', function () {
      var style = new hansi.style.Style();
      style.should.be.an.instanceOf(hansi.style.Style);
    });

    it('allows `new` to be omitted', function () {
      var style = hansi.style.Style();
      style.should.be.an.instanceOf(hansi.style.Style);
    });

    it('can be initialized with an object', function () {
      var style = hansi.style.Style({'font-weight': 'bold'});
      style.state.should.eql({'font-weight': 'bold'});
    });

    describe('.set([styles])', function () {

      it('sets styles', function () {
        var style = hansi.style.Style();
        style.set({'font-weight': 'bold'});
        style.state.should.eql({'font-weight': 'bold'});
      });
    });

    describe('.next(n1[, n2[, n3..]])', function () {

      beforeEach(function () {
        this.style = new hansi.style.Style();
      });

      it('returns an object of styles to be applied', function () {
      });

    });

  });

});
