#denmark-dr-stream

> Creates a download stream from a dr.dk url

## Installation

```sheel
npm install denmark-dr-stream
```

## Documentation

```javascript
const drvideo = require('denmark-dr-stream');
```

Given a popup url, this module will extract the manifest information using [denmark-dr-videosource](github.com/AndreasMadsen/denmark-dr-download). It will then find the video fragments using [node-m3u8](http://github.com/tedconf/node-m3u8). Finally it will read
the fragments and output them sequentially though the stream.

```javascript
const fs = require('fs');
const href = 'https://www.dr.dk/tv/se/afslutningsdebat/danmarks-valg-partilederrunde/popup/';
drvideo(href).pipe(fs.createWriteStream('./video.mp4'));
```

##License

**The software is license under "MIT"**

> Copyright (c) 2015 Andreas Madsen
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
