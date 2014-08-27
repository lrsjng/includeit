/*jshint node: true */
'use strict';

var _ = require('lodash');
var fs = require('fs');
var glob = require('glob');
var path = require('path');

var globOptions = {
        dot: true,
        silent: false,
        sync: true
    };

var reInclude = /^([ \t]*)\/\/[ \t]*@include[ \t]+(["'])(.+)\2[; \t]*$/gm;
var reEmptyLine = /^\s+$/gm;
var reEndsFailSafe = /;?(\s*)$/;

var defaults = {
        file: undefined,
        content: undefined,
        charset: 'utf-8'
    };


function Err(message, stack, file, line, column) {

    this.message = message;
    this.stack = stack;
    this.file = file;
    this.line = line;
    this.column = column;
}

function findPos(content, match) {

    var character = content.indexOf(match);

    content = content.slice(0, character);
    content = content.split('\n');

    return {
        line: content.length,
        column: content[content.length - 1].length + match.indexOf('@include') + 1
    };
}

function pathsForGlob(pattern) {

    return _.map(glob(pattern, globOptions), function (filepath) {

        return path.resolve(filepath);
    });
}

function recursion(settings, stack, file, content) {

    if (_.indexOf(stack, file) >= 0) {
        throw new Err('circular reference: "' + file + '"', stack);
    }
    stack.push(file);

    content = content.replace(reInclude, function (match, indent, quote, reference) {

        var refPattern = path.normalize(path.resolve(path.dirname(file), reference)),
            refPaths = pathsForGlob(refPattern);

        return _.map(refPaths, function (refPath) {

            try {
                var refContent = fs.readFileSync(refPath, settings.charset);
                refContent = refContent.replace(reEndsFailSafe, function (match, whiteEnd) {
                    return ';' + whiteEnd;
                });
                refContent = recursion(settings, stack, refPath, refContent);
                refContent = indent + refContent.replace(/\n/g, '\n' + indent);
                refContent = refContent.replace(reEmptyLine, '');

                return refContent;
            } catch (err) {
                if (err instanceof Err) {
                    throw err;
                }

                var pos = findPos(content, match);
                throw new Err('not found: "' + reference + '"', stack, file, pos.line, pos.column);
            }
        }).join('\n\n');
    });

    stack.pop();
    return content;
}

function includeit(options) {

    var settings = _.extend({}, defaults, options);

    if (!settings.file || !settings.content) {
        throw new Err('file and/or content undefined');
    }

    return recursion(settings, [], settings.file, settings.content);
}

module.exports = includeit;
