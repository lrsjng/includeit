'use strict';

var fs = require('fs');
var glob = require('glob');
var path = require('path');

var GLOB_OPTIONS = {
    dot: true,
    silent: false,
    sync: true
};
var RE_INCLUDE = /^([ \t]*)\/\/[ \t]*@include[ \t]+(["'])(.+?)\2[; \t]*$/gm;
var RE_EMPTY_LINE = /^\s+$/gm;
var RE_ENDS_FAIL_SAFE = /;?(\s*)$/;
var DEFAULTS = {
    file: undefined,
    content: undefined,
    charset: 'utf-8'
};

var throwError = function throwError(message, stack, file, line, column) {
    var err = new Error();
    err.message = message;
    err.includeStack = stack;
    err.file = file;
    err.line = line;
    err.column = column;
    throw err;
};

var findPos = function findPos(content, match) {
    var pos = content.indexOf(match);

    content = content.slice(0, pos);
    content = content.split('\n');

    return {
        line: content.length,
        column: content[content.length - 1].length + match.indexOf('@include') + 1
    };
};

var pathsForGlob = function pathsForGlob(pattern) {
    return glob(pattern, GLOB_OPTIONS).map(function (filepath) {
        return path.resolve(filepath);
    });
};

var recursion = function recursion(settings, stack, file, content) {
    if (stack.indexOf(file) >= 0) {
        throwError('circular reference: "' + file + '"', stack);
    }
    stack.push(file);

    content = content.replace(RE_INCLUDE, function (match, indent, quote, reference) {
        var refPattern = path.normalize(path.resolve(path.dirname(file), reference));
        var refPaths = pathsForGlob(refPattern);
        if (refPaths.length === 0) {
            var pos = findPos(content, match);
            throwError('not found: "' + reference + '"', stack, file, pos.line, pos.column);
        }

        return refPaths.map(function (refPath) {
            var refContent = fs.readFileSync(refPath, settings.charset);
            refContent = refContent.replace(RE_ENDS_FAIL_SAFE, function (_, whiteEnd) {
                return ';' + whiteEnd;
            });
            refContent = recursion(settings, stack, refPath, refContent);
            refContent = indent + refContent.replace(/\n/g, '\n' + indent);
            refContent = refContent.replace(RE_EMPTY_LINE, '');

            return refContent;
        }).join('\n\n');
    });

    stack.pop();
    return content;
};

var includeit = function includeit(options) {
    var settings = Object.assign({}, DEFAULTS, options);

    if (!settings.file || !settings.content) {
        throwError('file and/or content undefined');
    }

    return recursion(settings, [], settings.file, settings.content);
};

module.exports = includeit;