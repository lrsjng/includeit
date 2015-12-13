const fs = require('fs');
const glob = require('glob');
const path = require('path');

const GLOB_OPTIONS = {
    dot: true,
    silent: false,
    sync: true
};
const RE_INCLUDE = /^([ \t]*)\/\/[ \t]*@include[ \t]+(["'])(.+)\2[; \t]*$/gm;
const RE_EMPTY_LINE = /^\s+$/gm;
const RE_ENDS_FAIL_SAFE = /;?(\s*)$/;
const DEFAULTS = {
    file: undefined,
    content: undefined,
    charset: 'utf-8'
};

const throwError = (message, stack, file, line, column) => {
    const err = new Error();
    err.message = message;
    err.includeStack = stack;
    err.file = file;
    err.line = line;
    err.column = column;
    throw err;
};

const findPos = (content, match) => {
    const pos = content.indexOf(match);

    content = content.slice(0, pos);
    content = content.split('\n');

    return {
        line: content.length,
        column: content[content.length - 1].length + match.indexOf('@include') + 1
    };
};

const pathsForGlob = pattern => {
    return glob(pattern, GLOB_OPTIONS).map(filepath => {
        return path.resolve(filepath);
    });
};

const recursion = (settings, stack, file, content) => {
    if (stack.indexOf(file) >= 0) {
        throwError('circular reference: "' + file + '"', stack);
    }
    stack.push(file);

    content = content.replace(RE_INCLUDE, (match, indent, quote, reference) => {
        const refPattern = path.normalize(path.resolve(path.dirname(file), reference));
        const refPaths = pathsForGlob(refPattern);
        if (refPaths.length === 0) {
            const pos = findPos(content, match);
            throwError('not found: "' + reference + '"', stack, file, pos.line, pos.column);
        }

        return refPaths.map(refPath => {
            let refContent = fs.readFileSync(refPath, settings.charset);
            refContent = refContent.replace(RE_ENDS_FAIL_SAFE, (_, whiteEnd) => {
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

const includeit = options => {
    const settings = Object.assign({}, DEFAULTS, options);

    if (!settings.file || !settings.content) {
        throwError('file and/or content undefined');
    }

    return recursion(settings, [], settings.file, settings.content);
};

module.exports = includeit;
