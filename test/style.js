/*global describe, it, beforeEach, hansi */
describe('style([object])', function () {

  'use strict';

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

  describe('.Style([object])', function () {

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

      beforeEach(function () {
        this.style = new hansi.style.Style();
      });

      it('sets the given property on the `.state` object', function () {
        this.style.set('font-weight', 'bold');
        this.style.state.should.eql({'font-weight': 'bold'});
      });

      it('allows passing styles as an object', function () {
        this.style.set({'font-weight': 'bold'});
        this.style.state.should.eql({'font-weight': 'bold'});
      });

      it('can handle multiple styles at once', function () {
        this.style.set({'font-weight': 'bold', 'color': 'black'});
        this.style.state.should.eql({'font-weight': 'bold', 'color': 'black'});
      });

      it('returns the style instance', function () {
        this.style.set('font-weight', 'bold').should.equal(this.style);
      });

    });

    describe('.unset([styles])', function () {

      beforeEach(function () {
        this.style = new hansi.style.Style({'font-weight': 'bold', 'color': 'black'});
      });

      it('removes the given property from the `.state` object', function () {
        this.style.unset('font-weight');
        this.style.state.should.eql({'color': 'black'});
      });

      it('allows passing styles as an array', function () {
        this.style.unset(['font-weight']);
        this.style.state.should.eql({'color': 'black'});
      });

      it('can handle multiple styles at once', function () {
        this.style.unset(['font-weight', 'color']);
        this.style.state.should.eql({});
      });

      it('returns the style instance', function () {
        this.style.unset('font-weight').should.equal(this.style);
      });

    });

    describe('.add([styles])', function () {

      beforeEach(function () {
        this.style = new hansi.style.Style();
      });

      it('adds the given value to the property of the `.state` object', function () {
        this.style.add('font-family', 'arial');
        this.style.state.should.eql({'font-family': ['arial']});
        this.style.add('font-family', 'sans-serif');
        this.style.state.should.eql({'font-family': ['arial', 'sans-serif']});
      });

      it('does not create duplicate values', function () {
        this.style.add('font-family', 'arial');
        this.style.state.should.eql({'font-family': ['arial']});
        this.style.add('font-family', 'arial');
        this.style.state.should.eql({'font-family': ['arial']});
      });

      it('allows passing styles as an object', function () {
        this.style.add({'font-family': 'arial'});
        this.style.state.should.eql({'font-family': ['arial']});
      });

      it('can handle multiple styles at once', function () {
        this.style.add({'font-family': 'arial', 'text-decoration': 'line-through'});
        this.style.state.should.eql({'font-family': ['arial'], 'text-decoration': ['line-through']});
      });

      it('returns the style instance', function () {
        this.style.add('font-family', 'arial').should.equal(this.style);
      });

    });

    describe('.remove([styles])', function () {

      beforeEach(function () {
        this.style = new hansi.style.Style({'font-family': ['arial', 'sans-serif'], 'text-decoration': ['line-through']});
      });

      it('removes the given value from the property of the `.state` object', function () {
        this.style.remove('font-family', 'arial');
        this.style.state.should.eql({'font-family': ['sans-serif'], 'text-decoration': ['line-through']});
      });

      it('removes empty lists from the `.state` object', function () {
        this.style.remove('text-decoration', 'line-through');
        this.style.state.should.eql({'font-family': ['arial', 'sans-serif']});
      });

      it('allows passing styles as an object', function () {
        this.style.remove({'font-family': 'arial'});
        this.style.state.should.eql({'font-family': ['sans-serif'], 'text-decoration': ['line-through']});
      });

      it('can handle multiple styles at once', function () {
        this.style.remove({'font-family': 'arial', 'text-decoration': 'line-through'});
        this.style.state.should.eql({'font-family': ['sans-serif']});
      });

      it('returns the style instance', function () {
        this.style.remove('font-family', 'arial').should.equal(this.style);
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
