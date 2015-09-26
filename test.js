
'use strict';
'use strong';

const drvideo = require('./index.js');
const endpoint = require('endpoint');
const test = require('tap').test;

test('dead page', function (t) {
  drvideo('urn:dr:mu:programcard:558363a4a11f9f11f85e8dac')
    .pipe(endpoint(function (err, buffer) {
      t.equal(err.message, 'could not assert information');
      t.end();
    }));
});

test('live page', function (t) {
  let length = 0;
  drvideo('urn:dr:mu:programcard:55f8aaa7a11f9f17c87b7254')
    .on('data', function (buffer) {
      length += buffer.length;
    })
    .once('end', function () {
      console.log(length);
      t.equal(length, 489738248);
      t.end();
    });
});
