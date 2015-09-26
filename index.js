
'use strict';
'use strong';

const request = require('request');
const stream = require('stream');
const util = require('util');

function DrVideoStream(urn) {
  if (!(this instanceof DrVideoStream)) return new DrVideoStream(urn);
  stream.PassThrough.call(this);

  const self = this;
  this._fetchProgramcard(urn, function (err, programcard) {
    if (err) return self.emit('error', err);

    if (!programcard.PrimaryAsset) {
      return self.emit('error', new Error('could not assert information'));
    }

    self._fetchManifest(programcard, function (err, manifest) {
      if (err) return self.emit('error', err);

      const source = self._selectBestSource(manifest);
      self._startPipe(source);
    });
  });
}
util.inherits(DrVideoStream, stream.PassThrough);

DrVideoStream.prototype._fetchProgramcard = function (urn, callback) {
  request(`http://www.dr.dk/mu-online/api/1.3/programcard/${urn}`, function (err, res, content) {
    if (err) return callback(err);
    callback(null, JSON.parse(content));
  });
};

DrVideoStream.prototype._fetchManifest = function (programcard, callback) {
  request(programcard.PrimaryAsset.Uri, function (err, res, content) {
    if (err) return callback(err);
    callback(null, JSON.parse(content));
  });
};

DrVideoStream.prototype._selectBestSource = function (manifest) {
  let bestBitrate = 0;
  let bestSource = null;

  for (const source of manifest.Links) {
    const bitrate = source.Bitrate | 0;
    if (bitrate > bestBitrate) {
      bestBitrate = bitrate;
      bestSource = source;
    }
  }

  return bestSource;
};

DrVideoStream.prototype._startPipe = function (source) {
  request(source.Uri).pipe(this);
};

module.exports = DrVideoStream;
