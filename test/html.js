/*global describe, it, beforeEach, hansi */
describe('html()', function () {

  'use strict';

  describe('when called as a function', function () {

    it('takes a string parameter for initialization', function () {
      var next = hansi.html('samp');
      next.should.be.an.instanceOf(Function);
    });

    it('returns a function', function () {
      var next = hansi.html();
      next.should.be.an.instanceOf(Function);
    });

    describe('the returned function', function () {

    });

  });

  describe('#HTML()', function () {

    beforeEach(function () {
    });

    it('creates a new `HTML` instance', function () {
      var html = new hansi.html.HTML();
      html.should.be.an.instanceOf(hansi.html.HTML);
    });

    it('allows `new` to be omitted', function () {
      var html = hansi.html.HTML();
      html.should.be.an.instanceOf(hansi.html.HTML);
    });

    describe('.write([str])', function () {

    });

    describe('.read([length])', function () {

    });

  });

});
