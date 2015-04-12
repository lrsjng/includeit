# includeit

[![license][license-img]][github] [![github][github-img]][github] [![npm][npm-img]][npm]  
[![version][npm-v-img]][npm] [![downloads][npm-dm-img]][npm] [![dependencies status][gemnasium-img]][gemnasium] [![build status][travis-img]][travis]

Preprocessor to include one js file into another js file. The syntax is

~~~javascript
// @include "some/file.js"
// @include 'some/other/file.js'
~~~

Those lines will be replaced with the content of the target files. The lookup
is always relative to the file containing the `@include` line.


## Install

~~~sh
> npm install includeit
~~~


## Usage

~~~javascript
var includeit = require('includeit');
var newContent = includeit(options);
~~~

with

~~~javascript
options = {
    // a full file path for relative lookup (does not need to exist)
    file: undefined,

    // and the file's content
    content: undefined,

    charset: 'utf-8'
}
~~~


## License
The MIT License (MIT)

Copyright (c) 2015 Lars Jung (http://larsjung.de)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


[github]: https://github.com/lrsjng/includeit
[npm]: https://www.npmjs.org/package/includeit
[gemnasium]: https://gemnasium.com/lrsjng/includeit
[travis]: https://travis-ci.org/lrsjng/includeit

[license-img]: https://img.shields.io/badge/license-MIT-a0a060.svg?style=flat-square
[github-img]: https://img.shields.io/badge/github-lrsjng/includeit-a0a060.svg?style=flat-square
[npm-img]: https://img.shields.io/badge/npm-includeit-a0a060.svg?style=flat-square

[npm-v-img]: https://img.shields.io/npm/v/includeit.svg?style=flat-square
[npm-dm-img]: https://img.shields.io/npm/dm/includeit.svg?style=flat-square
[gemnasium-img]: https://img.shields.io/gemnasium/lrsjng/includeit.svg?style=flat-square
[travis-img]: https://img.shields.io/travis/lrsjng/includeit.svg?style=flat-square
