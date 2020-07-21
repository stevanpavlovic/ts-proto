"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const utils_1 = require("./utils");
const pbjs_1 = require("../build/pbjs");
const main_1 = require("./main");
const types_1 = require("./types");
var CodeGeneratorRequest = pbjs_1.google.protobuf.compiler.CodeGeneratorRequest;
var CodeGeneratorResponse = pbjs_1.google.protobuf.compiler.CodeGeneratorResponse;
// this would be the plugin called by the protoc compiler
async function main() {
    const stdin = await utils_1.readToBuffer(process.stdin);
    // const json = JSON.parse(stdin.toString());
    // const request = CodeGeneratorRequest.fromObject(json);
    const request = CodeGeneratorRequest.decode(stdin);
    const typeMap = types_1.createTypeMap(request, utils_1.optionsFromParameter(request.parameter));
    const files = request.protoFile.map((file) => {
        const spec = main_1.generateFile(typeMap, file, request.parameter);
        return new CodeGeneratorResponse.File({
            name: spec.path,
            content: prefixDisableLinter(spec),
        });
    });
    const response = new CodeGeneratorResponse({ file: files });
    const buffer = CodeGeneratorResponse.encode(response).finish();
    const write = util_1.promisify(process.stdout.write).bind(process.stdout);
    await write(Buffer.from(buffer));
}
main()
    .then(() => {
    process.stderr.write('DONE');
    process.exit(0);
})
    .catch((e) => {
    process.stderr.write('FAILED!');
    process.stderr.write(e.message);
    process.stderr.write(e.stack);
    process.exit(1);
});
// Comment block at the top of every source file, since these comments require specific
// syntax incompatible with ts-poet, we will hard-code the string and prepend to the
// generator output.
function prefixDisableLinter(spec) {
    return `/* eslint-disable */
${spec}`;
}
