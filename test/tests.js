const {resolve} = require('path');
const {test, assert} = require('scar');
const includeit = require('../lib/includeit');

test('includeit is function', () => {
    assert.equal(typeof includeit, 'function');
});

test('throws with defaults', () => {
    assert.throws(() => {
        includeit();
    }, /file and\/or content undefined/);
});

test('throws without file', () => {
    assert.throws(() => {
        includeit({content: 'x', charset: 'utf-8'});
    }, /file and\/or content undefined/);
});

test('throws without content', () => {
    assert.throws(() => {
        includeit({file: 'x', charset: 'utf-8'});
    }, /file and\/or content undefined/);
});

test('no includes', () => {
    const file = 'x';
    const content = 'x';
    const expected = 'x';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('uncommented includes', () => {
    const file = 'x';
    const content = '@include "file"';
    const expected = '@include "file"';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('double quotes', () => {
    const file = resolve(__filename);
    const content = '// @include "assets/file"';
    const expected = 'file content;\n';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('single quotes', () => {
    const file = resolve(__filename);
    const content = '// @include \'assets/file\'';
    const expected = 'file content;\n';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('mixed quotes', () => {
    const file = resolve(__filename);
    const content = '// @include "assets/file\'';
    const expected = '// @include "assets/file\'';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('mixed quotes', () => {
    const file = resolve(__filename);
    const content = '// @include \'assets/file"';
    const expected = '// @include \'assets/file"';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('no space', () => {
    const file = resolve(__filename);
    const content = '//@include "assets/file"';
    const expected = 'file content;\n';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('no space after include', () => {
    const file = resolve(__filename);
    const content = '// @include"assets/file"';
    const expected = '// @include"assets/file"';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('space before comment', () => {
    const file = resolve(__filename);
    const content = ' // @include "assets/file"';
    const expected = ' file content;\n';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('tab before comment', () => {
    const file = resolve(__filename);
    const content = '\t// @include "assets/file"';
    const expected = '\tfile content;\n';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('context', () => {
    const file = resolve(__filename);
    const content = 'a\n// @include "assets/file"\nb';
    const expected = 'a\nfile content;\n\nb';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('indent - spaces', () => {
    const file = resolve(__filename);
    const content = 'a\n  // @include "assets/file"\nb';
    const expected = 'a\n  file content;\n\nb';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('indent - tabs', () => {
    const file = resolve(__filename);
    const content = 'a\n\t\t// @include "assets/file"\nb';
    const expected = 'a\n\t\tfile content;\n\nb';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('multi line', () => {
    const file = resolve(__filename);
    const content = '// @include "assets/multi-line"';
    const expected = 'line 1\nline 2;\n';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('multi line indent - spaces', () => {
    const file = resolve(__filename);
    const content = '  // @include "assets/multi-line"';
    const expected = '  line 1\n  line 2;\n';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('multi line indent - tabs', () => {
    const file = resolve(__filename);
    const content = '\t\t// @include "assets/multi-line"';
    const expected = '\t\tline 1\n\t\tline 2;\n';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('multi line empty indent - spaces', () => {
    const file = resolve(__filename);
    const content = '  // @include "assets/multi-line-empty"';
    const expected = '  line 1\n\n  line 2;\n';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('multi line empty indent - tabs', () => {
    const file = resolve(__filename);
    const content = '\t\t// @include "assets/multi-line-empty"';
    const expected = '\t\tline 1\n\n\t\tline 2;\n';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('multi level includes', () => {
    const file = resolve(__filename);
    const content = '// @include "assets/include"';
    const expected = 'line a\nline 1\nline 2;\n\nline b;\n';

    const result = includeit({file, content, charset: 'utf-8'});
    assert.equal(result, expected);
});

test('throws when not found', () => {
    const file = resolve(__filename);
    const content = '// @include "assets/notfound"';

    assert.throws(() => {
        includeit({file, content, charset: 'utf-8'});
    }, /not found/);
});

test('throws on circular includes', () => {
    const file = resolve(__filename);
    const content = '// @include "assets/circular"';

    assert.throws(() => {
        includeit({file, content, charset: 'utf-8'});
    }, /circular reference/);
});

test.cli();
