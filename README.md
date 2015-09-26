#denmark-dr-stream [![Build Status](https://travis-ci.org/denmark-io/denmark-dr-stream.svg?branch=master)](https://travis-ci.org/denmark-io/denmark-dr-stream)

> Creates a download stream from a dr.dk url

## Installation

```sheel
npm install denmark-dr-stream
```

## Documentation

```javascript
const drvideo = require('denmark-dr-stream');
```

Given a programcard urn, this module will extract the manifest information,
find the video source of the highest quality and then pipe that to the stream.  

The programcard urn can for example be found using the
[denmark-dr-programcard](https://github.com/denmark-io/denmark-dr-programcard)
module.

```javascript
const fs = require('fs');
const urn = 'urn:dr:mu:programcard:55f8aaa7a11f9f17c87b7254';
drvideo(urn).pipe(fs.createWriteStream('./video.mp4'));
```
