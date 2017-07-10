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

var throw_err = function throw_err(message, stack, file, line, column) {
    var err = new Error();
    err.message = message;
    err.inc_stack = stack;
    err.file = file;
    err.line = line;
    err.column = column;
    throw err;
};

var find_pos = function find_pos(content, match) {
    var pos = content.indexOf(match);

    content = content.slice(0, pos);
    content = content.split('\n');

    return {
        line: content.length,
        column: content[content.length - 1].length + match.indexOf('@include') + 1
    };
};

var paths_for_glob = function paths_for_glob(pattern) {
    return glob(pattern, GLOB_OPTIONS).map(function (filepath) {
        return path.resolve(filepath);
    });
};

var recursion = function recursion(settings, stack, file, content) {
    if (stack.indexOf(file) >= 0) {
        throw_err('circular reference: "' + file + '"', stack);
    }
    stack.push(file);

    content = content.replace(RE_INCLUDE, function (match, indent, quote, reference) {
        var ref_pattern = path.normalize(path.resolve(path.dirname(file), reference));
        var ref_paths = paths_for_glob(ref_pattern);
        if (ref_paths.length === 0) {
            var pos = find_pos(content, match);
            throw_err('not found: "' + reference + '"', stack, file, pos.line, pos.column);
        }

        return ref_paths.map(function (ref_path) {
            var ref_content = fs.readFileSync(ref_path, settings.charset);
            ref_content = ref_content.replace(RE_ENDS_FAIL_SAFE, function (_, white_end) {
                return ';' + white_end;
            });
            ref_content = recursion(settings, stack, ref_path, ref_content);
            ref_content = indent + ref_content.replace(/\n/g, '\n' + indent);
            ref_content = ref_content.replace(RE_EMPTY_LINE, '');

            return ref_content;
        }).join('\n\n');
    });

    stack.pop();
    return content;
};

var includeit = function includeit(options) {
    var settings = Object.assign({}, DEFAULTS, options);

    if (!settings.file || !settings.content) {
        throw_err('file and/or content undefined');
    }

    return recursion(settings, [], settings.file, settings.content);
};

module.exports = includeit;