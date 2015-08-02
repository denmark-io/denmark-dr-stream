
'use strict';
'use strong';

const drvideo = require('./index.js');
const endpoint = require('endpoint');
const test = require('tap').test;

test('concat buffer has correct length', function (t) {
  drvideo('https://www.dr.dk/tv/se/afslutningsdebat/danmarks-valg-partilederrunde/popup/')
    .pipe(endpoint(function (err, buffer) {
      t.ifError(err);
      t.equal(buffer, 292483632); // approx 237 MB
      t.end();
    }));
});
