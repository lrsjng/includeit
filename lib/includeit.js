const fs = require('fs');
const glob = require('glob');
const path = require('path');

const GLOB_OPTIONS = {dot: true, silent: false, sync: true};
const RE_INCLUDE = /^([ \t]*)\/\/[ \t]*@include[ \t]+(["'])(.+?)\2[; \t]*$/gm;
const RE_EMPTY_LINE = /^\s+$/gm;
const RE_ENDS_FAIL_SAFE = /;?(\s*)$/;
const DEFAULTS = {
    file: undefined,
    content: undefined,
    charset: 'utf-8'
};

const throw_err = (message, stack, file, line, column) => {
    const err = new Error();
    err.message = message;
    err.inc_stack = stack;
    err.file = file;
    err.line = line;
    err.column = column;
    throw err;
};

const find_pos = (content, match) => {
    const pos = content.indexOf(match);

    content = content.slice(0, pos);
    content = content.split('\n');

    return {
        line: content.length,
        column: content[content.length - 1].length + match.indexOf('@include') + 1
    };
};

const paths_for_glob = pattern => {
    return glob(pattern, GLOB_OPTIONS).map(filepath => path.resolve(filepath));
};

const recursion = (settings, stack, file, content) => {
    if (stack.indexOf(file) >= 0) {
        throw_err(`circular reference: "${file}"`, stack);
    }
    stack.push(file);

    content = content.replace(RE_INCLUDE, (match, indent, quote, reference) => {
        const ref_pattern = path.normalize(path.resolve(path.dirname(file), reference));
        const ref_paths = paths_for_glob(ref_pattern);
        if (ref_paths.length === 0) {
            const pos = find_pos(content, match);
            throw_err(`not found: "${reference}"`, stack, file, pos.line, pos.column);
        }

        return ref_paths.map(ref_path => {
            let ref_content = fs.readFileSync(ref_path, settings.charset);
            ref_content = ref_content.replace(RE_ENDS_FAIL_SAFE, (_, white_end) => {
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

const includeit = options => {
    const settings = {...DEFAULTS, ...options};

    if (!settings.file || !settings.content) {
        throw_err('file and/or content undefined');
    }

    return recursion(settings, [], settings.file, settings.content);
};

module.exports = includeit;
