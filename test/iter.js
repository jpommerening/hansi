/*global describe, it, hansi */
describe('hansi', function () {
  'use strict';

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
        var next = hansi.iter('\0x1b[1m');
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
        var next = hansi.iter('\0x1b[1mbold\0x1b[m\0x1b[4munderline');

        next().should.be.an.instanceOf(Object);
        next().should.equal('bold');
        next().should.be.an.instanceOf(Object);
        next().should.be.an.instanceOf(Object);
        next().should.equal('underline');
        (next() === null).should.equal(true);
      });

      it('accepts unknown escape sequences', function () {
        var next = hansi.iter('\0x1b@1235~\0x1b_123@');

        next.should.not.throwError();
        next.should.not.throwError();
        (next() === null).should.equal(true);
      });

    });

    describe('the value returned for escape sequences', function () {
      var reset = hansi.iter('\0x1b[m')();
      var bold = hansi.iter('\0x1b[1m')();
      var color = hansi.iter('\0x1b[38;5;172m')();
      var unknown = hansi.iter('\0x1b@123/~')();

      it('is an object', function () {
        reset.should.be.an.instanceOf(Object);
        bold.should.be.an.instanceOf(Object);
        color.should.be.an.instanceOf(Object);
      });

      it('contains the CSI in the `start` property', function () {
        reset.should.have.property('start', '\0x1b[');
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
        unknown.should.have.property('start', '\0x1b@');
        unknown.should.have.property('args').eql([123]);
        unknown.should.have.property('end', '/~');
      });

    });

  });

});
