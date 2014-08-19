/*jshint node: true */
/*global describe, before, beforeEach, it */


var assert = require('assert'),
    path = require('path'),
    _ = require('lodash'),
    includeit = require('../');


describe('includeit()', function () {

    it('is function', function () {

        assert.ok(_.isFunction(includeit));
    });

    it('expects 1 parameter', function () {

        assert.strictEqual(includeit.length, 1);
    });

    it('throws with defaults', function () {

        assert.throws(function () {

            includeit();
        });
    });

    it('throws without file', function () {

        assert.throws(function () {

            includeit({content: 'x', charset: 'utf-8'});
        });
    });

    it('throws without content', function () {

        assert.throws(function () {

            includeit({file: 'x', charset: 'utf-8'});
        });
    });

    it('no includes', function () {

        var file = 'x';
        var content = 'x';
        var expected = 'x';

        var result = includeit({file: file, content: content, charset: 'utf-8'});
        assert.strictEqual(result, expected);
    });

    it('uncommented includes', function () {

        var file = 'x';
        var content = '@include "file"';
        var expected = '@include "file"';

        var result = includeit({file: file, content: content, charset: 'utf-8'});
        assert.strictEqual(result, expected);
    });

    it('correct syntax', function () {

        var file = path.resolve(__filename);
        var content = '// @include "assets/file"';
        var expected = 'file content;\n';

        var result = includeit({file: file, content: content, charset: 'utf-8'});
        assert.strictEqual(result, expected);
    });

    it('no space', function () {

        var file = path.resolve(__filename);
        var content = '//@include "assets/file"';
        var expected = 'file content;\n';

        var result = includeit({file: file, content: content, charset: 'utf-8'});
        assert.strictEqual(result, expected);
    });

    it('no space after include', function () {

        var file = path.resolve(__filename);
        var content = '// @include"assets/file"';
        var expected = '// @include"assets/file"';

        var result = includeit({file: file, content: content, charset: 'utf-8'});
        assert.strictEqual(result, expected);
    });

    it('space before comment', function () {

        var file = path.resolve(__filename);
        var content = ' // @include "assets/file"';
        var expected = ' file content;\n';

        var result = includeit({file: file, content: content, charset: 'utf-8'});
        assert.strictEqual(result, expected);
    });

    it('tab before comment', function () {

        var file = path.resolve(__filename);
        var content = '\t// @include "assets/file"';
        var expected = '\tfile content;\n';

        var result = includeit({file: file, content: content, charset: 'utf-8'});
        assert.strictEqual(result, expected);
    });

    it('context', function () {

        var file = path.resolve(__filename);
        var content = 'a\n// @include "assets/file"\nb';
        var expected = 'a\nfile content;\n\nb';

        var result = includeit({file: file, content: content, charset: 'utf-8'});
        assert.strictEqual(result, expected);
    });

    it('indent - spaces', function () {

        var file = path.resolve(__filename);
        var content = 'a\n  // @include "assets/file"\nb';
        var expected = 'a\n  file content;\n\nb';

        var result = includeit({file: file, content: content, charset: 'utf-8'});
        assert.strictEqual(result, expected);
    });

    it('indent - tabs', function () {

        var file = path.resolve(__filename);
        var content = 'a\n\t\t// @include "assets/file"\nb';
        var expected = 'a\n\t\tfile content;\n\nb';

        var result = includeit({file: file, content: content, charset: 'utf-8'});
        assert.strictEqual(result, expected);
    });

    it('multi line', function () {

        var file = path.resolve(__filename);
        var content = '// @include "assets/multi-line"';
        var expected = 'line 1\nline 2;\n';

        var result = includeit({file: file, content: content, charset: 'utf-8'});
        assert.strictEqual(result, expected);
    });

    it('multi line indent - spaces', function () {

        var file = path.resolve(__filename);
        var content = '  // @include "assets/multi-line"';
        var expected = '  line 1\n  line 2;\n';

        var result = includeit({file: file, content: content, charset: 'utf-8'});
        assert.strictEqual(result, expected);
    });

    it('multi line indent - tabs', function () {

        var file = path.resolve(__filename);
        var content = '\t\t// @include "assets/multi-line"';
        var expected = '\t\tline 1\n\t\tline 2;\n';

        var result = includeit({file: file, content: content, charset: 'utf-8'});
        assert.strictEqual(result, expected);
    });

    it('multi level includes', function () {

        var file = path.resolve(__filename);
        var content = '// @include "assets/include"';
        var expected = 'line a\nline 1\nline 2;\n\nline b;\n';

        var result = includeit({file: file, content: content, charset: 'utf-8'});
        assert.strictEqual(result, expected);
    });
});
