# includeit

[![license][license-img]][github] [![web][web-img]][web] [![github][github-img]][github] [![npm][npm-img]][npm]
[![downloads][npm-dm-img]][npm] [![dependencies Status][david-img]][david] [![build status][travis-img]][travis]

Preprocessor to include one js file into another js file.


## Install

    > npm install includeit


## Usage

    includeit = require('includeit');
    newContent = includeit(options);

with

    options = {
        // a full file path for relative lookup (does not need to exist)
        file: undefined,

        // and the file's content
        content: undefined,

        charset: 'utf-8'
    }


## License
The MIT License (MIT)

Copyright (c) 2014 Lars Jung (http://larsjung.de)

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


[web]: http://larsjung.de/includeit/
[github]: https://github.com/lrsjng/includeit
[npm]: https://www.npmjs.org/package/includeit
[david]: https://david-dm.org/lrsjng/includeit
[travis]: https://travis-ci.org/lrsjng/includeit

[license-img]: http://img.shields.io/badge/license-MIT-a0a060.svg?style=flat-square
[web-img]: http://img.shields.io/badge/web-larsjung.de/includeit-a0a060.svg?style=flat-square
[github-img]: http://img.shields.io/badge/github-lrsjng/includeit-a0a060.svg?style=flat-square
[npm-img]: http://img.shields.io/badge/npm-includeit-a0a060.svg?style=flat-square

[npm-v-img]: http://img.shields.io/npm/v/includeit.svg?style=flat-square
[npm-dm-img]: http://img.shields.io/npm/dm/includeit.svg?style=flat-square
[npm-l-img]: http://img.shields.io/npm/l/includeit.svg?style=flat-square
[david-img]: http://img.shields.io/david/lrsjng/includeit.svg?style=flat-square
[travis-img]: http://img.shields.io/travis/lrsjng/includeit.svg?style=flat-square
