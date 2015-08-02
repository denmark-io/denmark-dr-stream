
'use strict';
'use strong';

const videosource = require('denmark-dr-videosource');
const request = require('request');
const stream = require('stream');
const async = require('async');
const path = require('path');
const util = require('util');
const m3u8 = require('m3u8');

function DrVideoStream(href) {
  if (!(this instanceof DrVideoStream)) return new DrVideoStream(href);
  stream.PassThrough.call(this);

  const self = this;
  self._m3u8Source(href, function (err, sourceHref) {
    if (err) return self.emit('error', err);

    self._m3u8Stream(sourceHref, function (err, streamHref) {
      if (err) return self.emit('error', err);

      self._m3u8Fragments(streamHref, function (err, fragments) {
        if (err) return self.emit('error', err);

        self._startPipe(fragments);
      });
    });
  });
}
util.inherits(DrVideoStream, stream.PassThrough);

DrVideoStream.prototype._m3u8Source = function (href, callback) {
  // Gets the .m3u8 source, dr.dk also provides .f4m sources. But
  // there are almost no parsers for that format.
  videosource(href, function (err, manifest) {
    if (err) return callback(err, null);

    for (let sourceInfo of manifest.Links) {
      if (path.extname(sourceInfo.Uri) === '.m3u8') {
        callback(null, sourceInfo.Uri);
        break;
      }
    }
  });
};

DrVideoStream.prototype._m3u8Stream = function (href, callback) {
  // Fetch and parse a .m3u8 file and find the highest quality stream.
  // First the resolution is prioritized, then the bandwidth is prioritized.
  const parser = m3u8.createStream();
  request(href).pipe(parser);

  parser.on('m3u', function (items) {
    const StreamItem = items.items.StreamItem.sort(function (a, b) {
      const aAttr = a.attributes.attributes;
      const bAttr = b.attributes.attributes;

      const aBrandwidth = aAttr.bandwidth;
      const bBrandwidth = bAttr.bandwidth;

      const aResolution = aAttr.resolution[0] * aAttr.resolution[1];
      const bResolution = bAttr.resolution[0] * bAttr.resolution[1];

      if (aResolution > bResolution) {
        return -1;
      } else if (aResolution === bResolution && aBrandwidth > bBrandwidth) {
        return -1;
      } else if (aResolution === bResolution && aBrandwidth === bBrandwidth) {
        return 0;
      } else {
        return 1;
      }
    });

    callback(null, StreamItem[0].properties.uri);
  });
};

DrVideoStream.prototype._m3u8Fragments = function (href, callback) {
  // Get the fragments from a m3u8 stream
  const parser = m3u8.createStream();
  request(href).pipe(parser);

  parser.on('m3u', function (items) {
    const playlist = items.items.PlaylistItem.map(function (item) {
      return item.properties.uri;
    });

    callback(null, playlist);
  });
};

DrVideoStream.prototype._startPipe = function (fragments) {
  const self = this;

  async.eachSeries(fragments, function (href, done) {
    const source = request(href);
    source.pipe(self, { end: false });
    source.once('end', done);
  }, function (err) {
    if (err) return self.emit('error', err);
    self.end();
  });
};

module.exports = DrVideoStream;
