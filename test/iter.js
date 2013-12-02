/*global describe, it */
describe('iter(str)', function () {
  'use strict';

  var hansi = (typeof window !== 'undefined' ? window : global).hansi;

  describe('when called as a function', function () {

    it('takes a string parameter for initialization', function () {
      var next = hansi.iter('hansi');
      next.should.be.an.instanceOf(Function);
    });

    it('returns a function', function () {
      var next = hansi.iter();
      next.should.be.an.instanceOf(Function);
    });

    describe('the returned function', function () {

      it('returns one string for plaintext', function () {
        var next = hansi.iter('hansi');
        next().should.equal('hansi');
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
        var next = hansi.iter('hansi');
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

      it('contains the original string in the `str` property', function () {
        reset.should.have.property('str', '\0x1b[m');
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

  describe('#Iter(str)', function () {

    it('creates an `Iter` instance', function () {
      var iter = new hansi.iter.Iter();
      iter.should.be.an.instanceOf(hansi.iter.Iter);
    });

    it('allows `new` to be omitted', function () {
      var iter = hansi.iter.Iter();
      iter.should.be.an.instanceOf(hansi.iter.Iter);
    });

    it('can be initialized with a string', function () {
      var iter = hansi.iter.Iter('hansi');
      iter.str.should.equal('hansi');
    });

    describe('.push([str])', function () {

      it('appends the given string to the end of `.str`', function () {
        var iter = new hansi.iter.Iter('hansi');
        iter.push(', hallo!');
        iter.str.should.equal('hansi, hallo!');
      });

      it('sets `.str` when called on an empty iterator', function () {
        var iter = new hansi.iter.Iter();
        iter.push('hallo hansi!');
        iter.str.should.equal('hallo hansi!');
      });

      it('does not modify `.str` wen called without parameters', function () {
        var iter = new hansi.iter.Iter('hansi');
        iter.push();
        iter.str.should.equal('hansi');
      });

    });

    describe('.pop([chars])', function () {

      it('returns the given number of characters from the beginning of `.str`', function () {
        var iter = new hansi.iter.Iter('hallo hansi!');
        iter.pop(5).should.equal('hallo');
      });

      it('removes the given number of characters from the beginning or `.str`', function () {
        var iter = new hansi.iter.Iter('hallo hansi!');
        iter.pop(6);
        iter.str.should.equal('hansi!');
      });

      it('returns and clears `.str` when called without parameters', function () {
        var iter = new hansi.iter.Iter('hallo hansi!');
        iter.pop().should.equal('hallo hansi!');
        iter.str.should.equal('');
      });

    });

    describe('.next([str])', function () {

    });

  });

});
