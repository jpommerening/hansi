/*global describe, it, hansi */
describe('hansi', function () {
  'use strict';

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
