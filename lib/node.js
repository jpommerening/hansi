var util = require('util');
var stream = require('stream');

function HansiStream(options) {
  if (!(this instanceof HansiStream))
    return new HansiStream(options);

  stream.Transform.call(this, options);
}
util.inherits(HansiStream, stream.Transform);

HansiStream.prototype._transform = function(chunk, encoding, done) {
  done();
};

module.exports = {
  HansiStream: HansiStream
};
