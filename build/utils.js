"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeAddComment = exports.optionsFromParameter = exports.defaultOptions = exports.upperFirst = exports.lowerFirst = exports.singular = exports.fail = exports.readToBuffer = void 0;
const main_1 = require("./main");
function readToBuffer(stream) {
    return new Promise((resolve) => {
        const ret = [];
        let len = 0;
        stream.on('readable', () => {
            let chunk;
            while ((chunk = stream.read())) {
                ret.push(chunk);
                len += chunk.length;
            }
        });
        stream.on('end', () => {
            resolve(Buffer.concat(ret, len));
        });
    });
}
exports.readToBuffer = readToBuffer;
function fail(message) {
    throw new Error(message);
}
exports.fail = fail;
function singular(name) {
    return name.substring(0, name.length - 1); // drop the 's', which is extremely naive
}
exports.singular = singular;
function lowerFirst(name) {
    return name.substring(0, 1).toLowerCase() + name.substring(1);
}
exports.lowerFirst = lowerFirst;
function upperFirst(name) {
    return name.substring(0, 1).toUpperCase() + name.substring(1);
}
exports.upperFirst = upperFirst;
function defaultOptions() {
    return {
        useContext: false,
        snakeToCamel: true,
        forceLong: main_1.LongOption.NUMBER,
        useOptionals: false,
        oneof: main_1.OneofOption.PROPERTIES,
        lowerCaseServiceMethods: true,
        outputEncodeMethods: false,
        outputJsonMethods: false,
        outputClientImpl: false,
        returnObservable: false,
        addGrpcMetadata: false,
        nestJs: true,
        env: main_1.EnvOption.BOTH,
    };
}
exports.defaultOptions = defaultOptions;
function optionsFromParameter(parameter) {
    const options = defaultOptions();
    if (parameter) {
        if (parameter.includes('context=true')) {
            options.useContext = true;
        }
        if (parameter.includes('snakeToCamel=false')) {
            options.snakeToCamel = false;
        }
        if (parameter.includes('forceLong=true') || parameter.includes('forceLong=long')) {
            options.forceLong = main_1.LongOption.LONG;
        }
        if (parameter.includes('forceLong=string')) {
            options.forceLong = main_1.LongOption.STRING;
        }
        if (parameter.includes('useOptionals=true')) {
            options.useOptionals = true;
        }
        if (parameter.includes('oneof=properties')) {
            options.oneof = main_1.OneofOption.PROPERTIES;
        }
        if (parameter.includes('oneof=unions')) {
            options.oneof = main_1.OneofOption.UNIONS;
        }
        if (parameter.includes('lowerCaseServiceMethods=true')) {
            options.lowerCaseServiceMethods = true;
        }
        if (parameter.includes('outputEncodeMethods=false')) {
            options.outputEncodeMethods = false;
        }
        if (parameter.includes('outputJsonMethods=false')) {
            options.outputJsonMethods = false;
        }
        if (parameter.includes('outputClientImpl=false')) {
            options.outputClientImpl = false;
        }
        if (parameter.includes('nestJs=true')) {
            options.nestJs = true;
            options.lowerCaseServiceMethods = true;
            options.outputEncodeMethods = false;
            options.outputJsonMethods = false;
            options.outputClientImpl = false;
            if (parameter.includes('addGrpcMetadata=true')) {
                options.addGrpcMetadata = true;
            }
            if (parameter.includes('returnObservable=true')) {
                options.returnObservable = true;
            }
        }
        if (parameter.includes('env=node')) {
            options.env = main_1.EnvOption.NODE;
        }
        if (parameter.includes('env=browser')) {
            options.env = main_1.EnvOption.BROWSER;
        }
    }
    return options;
}
exports.optionsFromParameter = optionsFromParameter;
// addJavadoc will attempt to expand unescaped percent %, so we replace these within source comments.
const PercentAll = /\%/g;
// Since we don't know what form the comment originally took, it may contain closing block comments.
const CloseComment = /\*\//g;
/**
 * Removes potentially harmful characters from comments and calls the provided expression
 * @param desc {SourceDescription} original comment information
 * @param process {(comment: string) => void} called if a comment exists
 * @returns {string} scrubbed text
 */
function maybeAddComment(desc, process) {
    if (desc.leadingComments || desc.trailingComments) {
        return process((desc.leadingComments || desc.trailingComments || '').replace(PercentAll, '%%').replace(CloseComment, '* /'));
    }
}
exports.maybeAddComment = maybeAddComment;
