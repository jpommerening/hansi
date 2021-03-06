/*global describe, it, beforeEach, hansi */
describe('iter(str)', function () {

  'use strict';

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

      it('returns a string for plaintext', function () {
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

        (function () {
          next().should.be.an.instanceOf(Object);
          next().should.be.an.instanceOf(Object);
        }).should.not.throwError();

        (next() === null).should.equal(true);
      });

      it('takes an optional string parameter to append more text', function () {
        var next = hansi.iter('hansi');

        next(', \0x1b[1mha').should.equal('hansi, ');
        next('llo\0x1b[m').should.be.an.instanceOf(Object);
        next().should.equal('hallo');
        next('!').should.be.an.instanceOf(Object);
        next().should.equal('!');
      });

    });

  });

  describe('.Iter(str)', function () {

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

    describe('.write([str])', function () {

      it('appends the given string to the end of `.str`', function () {
        var iter = new hansi.iter.Iter('hansi');
        iter.write(', hallo!');
        iter.str.should.equal('hansi, hallo!');
      });

      it('sets `.str` when called on an empty iterator', function () {
        var iter = new hansi.iter.Iter();
        iter.write('hallo hansi!');
        iter.str.should.equal('hallo hansi!');
      });

      it('does not modify `.str` wen called without parameters', function () {
        var iter = new hansi.iter.Iter('hansi');
        iter.write();
        iter.str.should.equal('hansi');
      });

    });

    describe('.read([length])', function () {

      it('returns the given number of characters from the beginning of `.str`', function () {
        var iter = new hansi.iter.Iter('hallo hansi!');
        iter.read(5).should.equal('hallo');
      });

      it('removes the given number of characters from the beginning or `.str`', function () {
        var iter = new hansi.iter.Iter('hallo hansi!');
        iter.read(6);
        iter.str.should.equal('hansi!');
      });

      it('returns and clears `.str` when called without parameters', function () {
        var iter = new hansi.iter.Iter('hallo hansi!');
        iter.read().should.equal('hallo hansi!');
        iter.str.should.equal('');
      });

    });

    describe('.next([str])', function () {

      it('returns a string for plaintext', function () {
        var iter = new hansi.iter.Iter('hansi');
        iter.next().should.equal('hansi');
      });

      it('returns an object if an escape sequence was given', function () {
        var iter = new hansi.iter.Iter('\0x1b[1m');
        iter.next().should.be.an.instanceOf(Object);
      });

      it('returns `null` if an empty string was given', function () {
        var iter = new hansi.iter.Iter('');
        (iter.next() === null).should.equal(true);
      });

      it('returns `null` after all elements have been consumed', function () {
        var iter = new hansi.iter.Iter('hansi');
        iter.next();
        (iter.next() === null).should.equal(true);
      });

      it('does not return empty strings between adjacend escape sequences', function () {
        var iter = new hansi.iter.Iter('\0x1b[1mbold\0x1b[m\0x1b[4munderline');

        iter.next().should.be.an.instanceOf(Object);
        iter.next().should.equal('bold');
        iter.next().should.be.an.instanceOf(Object);
        iter.next().should.be.an.instanceOf(Object);
        iter.next().should.equal('underline');
        (iter.next() === null).should.equal(true);
      });

      it('accepts unknown escape sequences', function () {
        var iter = new hansi.iter.Iter('\0x1b@1235~\0x1b_123@');

        (function () {
          iter.next().should.be.an.instanceOf(Object);
          iter.next().should.be.an.instanceOf(Object);
        }).should.not.throwError();

        (iter.next() === null).should.equal(true);
      });

      it('takes an optional string parameter to append more text', function () {
        var iter = new hansi.iter.Iter('hansi');

        iter.next(', \0x1b[1mha').should.equal('hansi, ');
        iter.next('llo\0x1b[m').should.be.an.instanceOf(Object);
        iter.next().should.equal('hallo');
        iter.next('!').should.be.an.instanceOf(Object);
        iter.next().should.equal('!');
      });

      describe('the value returned for escape sequences', function () {

        beforeEach(function () {
          var iter = new hansi.iter.Iter('\0x1b[m\0x1b[1m\0x1b[38;5;172m\0x1b@123/~');
          this.reset = iter.next();
          this.bold = iter.next();
          this.color = iter.next();
          this.unknown = iter.next();
        });

        it('is an object', function () {
          this.reset.should.be.an.instanceOf(Object);
          this.bold.should.be.an.instanceOf(Object);
          this.color.should.be.an.instanceOf(Object);
        });

        it('contains the original string in the `str` property', function () {
          this.reset.should.have.property('str', '\0x1b[m');
        });

        it('contains the CSI in the `start` property', function () {
          this.reset.should.have.property('start', '\0x1b[');
        });

        it('contains the command identifier in the `end` property', function () {
          this.reset.should.have.property('end', 'm');
          this.bold.should.have.property('end', 'm');
          this.color.should.have.property('end', 'm');
        });

        it('contains arguments in the `args` property', function () {
          this.reset.should.have.property('args');
          this.bold.should.have.property('args');
          this.color.should.have.property('args');
        });

        it('stores arguments as numbers', function () {
          this.reset.should.have.property('args').eql([]);
          this.bold.should.have.property('args').eql([1]);
          this.color.should.have.property('args').eql([38, 5, 172]);
        });

        it('has meaningful values even for unknown sequences', function () {
          this.unknown.should.be.an.instanceOf(Object);
          this.unknown.should.have.property('start', '\0x1b@');
          this.unknown.should.have.property('args').eql([123]);
          this.unknown.should.have.property('end', '/~');
        });

      });

    });

  });

});
