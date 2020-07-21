"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectMapType = exports.toTypeName = exports.messageToTypeName = exports.valueTypeName = exports.isEmptyType = exports.isValueType = exports.isTimestamp = exports.isMapType = exports.isLong = exports.isRepeated = exports.isWithinOneOf = exports.isEnum = exports.isMessage = exports.isBytes = exports.isPrimitive = exports.createTypeMap = exports.defaultValue = exports.packedType = exports.toReaderCall = exports.basicTypeName = exports.basicLongWireType = exports.basicWireType = void 0;
const pbjs_1 = require("../build/pbjs");
const ts_poet_1 = require("ts-poet");
const main_1 = require("./main");
const utils_1 = require("./utils");
var FieldDescriptorProto = pbjs_1.google.protobuf.FieldDescriptorProto;
const sourceInfo_1 = require("./sourceInfo");
/** Based on https://github.com/dcodeIO/protobuf.js/blob/master/src/types.js#L37. */
function basicWireType(type) {
    switch (type) {
        case FieldDescriptorProto.Type.TYPE_DOUBLE:
            return 1;
        case FieldDescriptorProto.Type.TYPE_FLOAT:
            return 5;
        case FieldDescriptorProto.Type.TYPE_INT32:
        case FieldDescriptorProto.Type.TYPE_ENUM:
        case FieldDescriptorProto.Type.TYPE_UINT32:
        case FieldDescriptorProto.Type.TYPE_SINT32:
            return 0;
        case FieldDescriptorProto.Type.TYPE_FIXED32:
        case FieldDescriptorProto.Type.TYPE_SFIXED32:
            return 5;
        case FieldDescriptorProto.Type.TYPE_INT64:
        case FieldDescriptorProto.Type.TYPE_UINT64:
        case FieldDescriptorProto.Type.TYPE_SINT64:
            return 0;
        case FieldDescriptorProto.Type.TYPE_FIXED64:
        case FieldDescriptorProto.Type.TYPE_SFIXED64:
            return 1;
        case FieldDescriptorProto.Type.TYPE_BOOL:
            return 0;
        case FieldDescriptorProto.Type.TYPE_STRING:
        case FieldDescriptorProto.Type.TYPE_BYTES:
            return 2;
        default:
            throw new Error('Invalid type ' + type);
    }
}
exports.basicWireType = basicWireType;
function basicLongWireType(type) {
    switch (type) {
        case FieldDescriptorProto.Type.TYPE_INT64:
        case FieldDescriptorProto.Type.TYPE_UINT64:
        case FieldDescriptorProto.Type.TYPE_SINT64:
            return 0;
        case FieldDescriptorProto.Type.TYPE_FIXED64:
        case FieldDescriptorProto.Type.TYPE_SFIXED64:
            return 1;
        default:
            return undefined;
    }
}
exports.basicLongWireType = basicLongWireType;
/** Returns the type name without any repeated/required/etc. labels. */
function basicTypeName(typeMap, field, options, typeOptions = {}) {
    switch (field.type) {
        case FieldDescriptorProto.Type.TYPE_DOUBLE:
        case FieldDescriptorProto.Type.TYPE_FLOAT:
        case FieldDescriptorProto.Type.TYPE_INT32:
        case FieldDescriptorProto.Type.TYPE_UINT32:
        case FieldDescriptorProto.Type.TYPE_SINT32:
        case FieldDescriptorProto.Type.TYPE_FIXED32:
        case FieldDescriptorProto.Type.TYPE_SFIXED32:
            return ts_poet_1.TypeNames.NUMBER;
        case FieldDescriptorProto.Type.TYPE_INT64:
        case FieldDescriptorProto.Type.TYPE_UINT64:
        case FieldDescriptorProto.Type.TYPE_SINT64:
        case FieldDescriptorProto.Type.TYPE_FIXED64:
        case FieldDescriptorProto.Type.TYPE_SFIXED64:
            // this handles 2^53, Long is only needed for 2^64; this is effectively pbjs's forceNumber
            if (options.forceLong === main_1.LongOption.LONG) {
                return ts_poet_1.TypeNames.anyType('Long*long');
            }
            else if (options.forceLong === main_1.LongOption.STRING) {
                return ts_poet_1.TypeNames.STRING;
            }
            else {
                return ts_poet_1.TypeNames.NUMBER;
            }
        case FieldDescriptorProto.Type.TYPE_BOOL:
            return ts_poet_1.TypeNames.BOOLEAN;
        case FieldDescriptorProto.Type.TYPE_STRING:
            return ts_poet_1.TypeNames.STRING;
        case FieldDescriptorProto.Type.TYPE_BYTES:
            if (options.env === main_1.EnvOption.NODE) {
                return ts_poet_1.TypeNames.BUFFER;
            }
            else {
                return ts_poet_1.TypeNames.anyType('Uint8Array');
            }
        case FieldDescriptorProto.Type.TYPE_MESSAGE:
        case FieldDescriptorProto.Type.TYPE_ENUM:
            return messageToTypeName(typeMap, field.typeName, options, { ...typeOptions, repeated: isRepeated(field) });
        default:
            return ts_poet_1.TypeNames.anyType(field.typeName);
    }
}
exports.basicTypeName = basicTypeName;
/** Returns the Reader method for the primitive's read/write call. */
function toReaderCall(field) {
    switch (field.type) {
        case FieldDescriptorProto.Type.TYPE_DOUBLE:
            return 'double';
        case FieldDescriptorProto.Type.TYPE_FLOAT:
            return 'float';
        case FieldDescriptorProto.Type.TYPE_INT32:
        case FieldDescriptorProto.Type.TYPE_ENUM:
            return 'int32';
        case FieldDescriptorProto.Type.TYPE_UINT32:
            return 'uint32';
        case FieldDescriptorProto.Type.TYPE_SINT32:
            return 'sint32';
        case FieldDescriptorProto.Type.TYPE_FIXED32:
            return 'fixed32';
        case FieldDescriptorProto.Type.TYPE_SFIXED32:
            return 'sfixed32';
        case FieldDescriptorProto.Type.TYPE_INT64:
            return 'int64';
        case FieldDescriptorProto.Type.TYPE_UINT64:
            return 'uint64';
        case FieldDescriptorProto.Type.TYPE_SINT64:
            return 'sint64';
        case FieldDescriptorProto.Type.TYPE_FIXED64:
            return 'fixed64';
        case FieldDescriptorProto.Type.TYPE_SFIXED64:
            return 'sfixed64';
        case FieldDescriptorProto.Type.TYPE_BOOL:
            return 'bool';
        case FieldDescriptorProto.Type.TYPE_STRING:
            return 'string';
        case FieldDescriptorProto.Type.TYPE_BYTES:
            return 'bytes';
        default:
            throw new Error(`Not a primitive field ${field}`);
    }
}
exports.toReaderCall = toReaderCall;
function packedType(type) {
    switch (type) {
        case FieldDescriptorProto.Type.TYPE_DOUBLE:
            return 1;
        case FieldDescriptorProto.Type.TYPE_FLOAT:
            return 5;
        case FieldDescriptorProto.Type.TYPE_INT32:
        case FieldDescriptorProto.Type.TYPE_ENUM:
        case FieldDescriptorProto.Type.TYPE_UINT32:
        case FieldDescriptorProto.Type.TYPE_SINT32:
            return 0;
        case FieldDescriptorProto.Type.TYPE_FIXED32:
        case FieldDescriptorProto.Type.TYPE_SFIXED32:
            return 5;
        case FieldDescriptorProto.Type.TYPE_INT64:
        case FieldDescriptorProto.Type.TYPE_UINT64:
        case FieldDescriptorProto.Type.TYPE_SINT64:
            return 0;
        case FieldDescriptorProto.Type.TYPE_FIXED64:
        case FieldDescriptorProto.Type.TYPE_SFIXED64:
            return 1;
        case FieldDescriptorProto.Type.TYPE_BOOL:
            return 0;
        default:
            return undefined;
    }
}
exports.packedType = packedType;
function defaultValue(typeMap, field, options) {
    switch (field.type) {
        case FieldDescriptorProto.Type.TYPE_DOUBLE:
        case FieldDescriptorProto.Type.TYPE_FLOAT:
        case FieldDescriptorProto.Type.TYPE_INT32:
        case FieldDescriptorProto.Type.TYPE_UINT32:
        case FieldDescriptorProto.Type.TYPE_SINT32:
        case FieldDescriptorProto.Type.TYPE_FIXED32:
        case FieldDescriptorProto.Type.TYPE_SFIXED32:
            return 0;
        case FieldDescriptorProto.Type.TYPE_ENUM:
            // proto3 enforces enums starting at 0, however proto2 does not, so we have
            // to probe and see if zero is an allowed value. If it's not, pick the first one.
            // This is probably not great, but it's only used in fromJSON and fromPartial,
            // and I believe the semantics of those in the proto2 world are generally undefined.
            const enumProto = typeMap.get(field.typeName)[2];
            const hasZero = enumProto.value.find((v) => v.number === 0);
            return hasZero ? 0 : enumProto.value[0].number;
        case FieldDescriptorProto.Type.TYPE_UINT64:
        case FieldDescriptorProto.Type.TYPE_FIXED64:
            if (options.forceLong === main_1.LongOption.LONG) {
                return ts_poet_1.CodeBlock.of('%T.UZERO', 'Long*long');
            }
            else if (options.forceLong === main_1.LongOption.STRING) {
                return '"0"';
            }
            else {
                return 0;
            }
        case FieldDescriptorProto.Type.TYPE_INT64:
        case FieldDescriptorProto.Type.TYPE_SINT64:
        case FieldDescriptorProto.Type.TYPE_SFIXED64:
            if (options.forceLong === main_1.LongOption.LONG) {
                return ts_poet_1.CodeBlock.of('%T.ZERO', 'Long*long');
            }
            else if (options.forceLong === main_1.LongOption.STRING) {
                return '"0"';
            }
            else {
                return 0;
            }
        case FieldDescriptorProto.Type.TYPE_BOOL:
            return false;
        case FieldDescriptorProto.Type.TYPE_STRING:
            return '""';
        case FieldDescriptorProto.Type.TYPE_BYTES:
        case FieldDescriptorProto.Type.TYPE_MESSAGE:
        default:
            return 'undefined';
    }
}
exports.defaultValue = defaultValue;
/** Scans all of the proto files in `request` and builds a map of proto typeName -> TS module/name. */
function createTypeMap(request, options) {
    const typeMap = new Map();
    for (const file of request.protoFile) {
        // We assume a file.name of google/protobuf/wrappers.proto --> a module path of google/protobuf/wrapper.ts
        const moduleName = file.name.replace('.proto', '');
        // So given a fullName like FooMessage_InnerMessage, proto will see that as package.name.FooMessage.InnerMessage
        function saveMapping(tsFullName, desc, s, protoFullName) {
            // package is optional, but make sure we have a dot-prefixed type name either way
            const prefix = file.package.length === 0 ? '' : `.${file.package}`;
            typeMap.set(`${prefix}.${protoFullName}`, [moduleName, tsFullName, desc]);
        }
        main_1.visit(file, sourceInfo_1.default.empty(), saveMapping, options, saveMapping);
    }
    return typeMap;
}
exports.createTypeMap = createTypeMap;
function isPrimitive(field) {
    return !isMessage(field);
}
exports.isPrimitive = isPrimitive;
function isBytes(field) {
    return field.type === FieldDescriptorProto.Type.TYPE_BYTES;
}
exports.isBytes = isBytes;
function isMessage(field) {
    return field.type === FieldDescriptorProto.Type.TYPE_MESSAGE;
}
exports.isMessage = isMessage;
function isEnum(field) {
    return field.type === FieldDescriptorProto.Type.TYPE_ENUM;
}
exports.isEnum = isEnum;
function isWithinOneOf(field) {
    return field.hasOwnProperty('oneofIndex');
}
exports.isWithinOneOf = isWithinOneOf;
function isRepeated(field) {
    return field.label === FieldDescriptorProto.Label.LABEL_REPEATED;
}
exports.isRepeated = isRepeated;
function isLong(field) {
    return basicLongWireType(field.type) !== undefined;
}
exports.isLong = isLong;
function isMapType(typeMap, messageDesc, field, options) {
    return detectMapType(typeMap, messageDesc, field, options) !== undefined;
}
exports.isMapType = isMapType;
const valueTypes = {
    '.google.protobuf.StringValue': ts_poet_1.TypeNames.STRING,
    '.google.protobuf.Int32Value': ts_poet_1.TypeNames.NUMBER,
    '.google.protobuf.Int64Value': ts_poet_1.TypeNames.NUMBER,
    '.google.protobuf.UInt32Value': ts_poet_1.TypeNames.NUMBER,
    '.google.protobuf.UInt64Value': ts_poet_1.TypeNames.NUMBER,
    '.google.protobuf.BoolValue': ts_poet_1.TypeNames.BOOLEAN,
    '.google.protobuf.DoubleValue': ts_poet_1.TypeNames.NUMBER,
    '.google.protobuf.FloatValue': ts_poet_1.TypeNames.NUMBER,
    '.google.protobuf.BytesValue': ts_poet_1.TypeNames.anyType('Uint8Array'),
};
const mappedTypes = {
    '.google.protobuf.Timestamp': ts_poet_1.TypeNames.DATE,
};
function isTimestamp(field) {
    return field.typeName === '.google.protobuf.Timestamp';
}
exports.isTimestamp = isTimestamp;
function isValueType(field) {
    return field.typeName in valueTypes;
}
exports.isValueType = isValueType;
function isEmptyType(typeName) {
    return typeName === '.google.protobuf.Empty';
}
exports.isEmptyType = isEmptyType;
function valueTypeName(field) {
    if (!isValueType(field)) {
        throw new Error('Type is not a valueType: ' + field.typeName);
    }
    return valueTypes[field.typeName];
}
exports.valueTypeName = valueTypeName;
/** Maps `.some_proto_namespace.Message` to a TypeName. */
function messageToTypeName(typeMap, protoType, options, typeOptions = {}) {
    // Watch for the wrapper types `.google.protobuf.*Value`. If we're mapping
    // them to basic built-in types, we union the type with undefined to
    // indicate the value is optional. Exceptions:
    // - If the field is repeated, values cannot be undefined.
    // - If useOptionals=true, all non-scalar types are already optional
    //   properties, so there's no need for that union.
    if (!typeOptions.keepValueType && protoType in valueTypes) {
        let typeName = valueTypes[protoType];
        if (!!typeOptions.repeated || options.useOptionals) {
            return typeName;
        }
        return ts_poet_1.TypeNames.unionType(typeName, ts_poet_1.TypeNames.UNDEFINED);
    }
    // Look for other special prototypes like Timestamp that aren't technically wrapper types
    if (!typeOptions.keepValueType && protoType in mappedTypes) {
        return mappedTypes[protoType];
    }
    const [module, type] = toModuleAndType(typeMap, protoType);
    return ts_poet_1.TypeNames.importedType(`${type}@./${module}`);
}
exports.messageToTypeName = messageToTypeName;
/** Breaks `.some_proto_namespace.Some.Message` into `['some_proto_namespace', 'Some_Message', Descriptor]. */
function toModuleAndType(typeMap, protoType) {
    return typeMap.get(protoType) || utils_1.fail(`No type found for ${protoType}`);
}
/** Return the TypeName for any field (primitive/message/etc.) as exposed in the interface. */
function toTypeName(typeMap, messageDesc, field, options) {
    let type = basicTypeName(typeMap, field, options, { keepValueType: false });
    if (isRepeated(field)) {
        const mapType = detectMapType(typeMap, messageDesc, field, options);
        if (mapType) {
            const { keyType, valueType } = mapType;
            return ts_poet_1.TypeNames.anonymousType(new ts_poet_1.Member(`[key: ${keyType}]`, valueType));
        }
        return ts_poet_1.TypeNames.arrayType(type);
    }
    if (isValueType(field)) {
        // google.protobuf.*Value types are already unioned with `undefined`
        // in messageToTypeName, so no need to consider them for that here.
        return type;
    }
    // By default (useOptionals=false, oneof=properties), non-scalar fields
    // outside oneofs and all fields within a oneof clause need to be unioned
    // with `undefined` to indicate the value is optional.
    //
    // When useOptionals=true, non-scalar fields are translated to optional
    // properties, so no need for the union with `undefined` here.
    //
    // When oneof=unions, we generate a single property for the entire `oneof`
    // clause, spelling each option out inside a large type union. No need for
    // union with `undefined` here, either.
    if ((!isWithinOneOf(field) && isMessage(field) && !options.useOptionals) ||
        (isWithinOneOf(field) && options.oneof === main_1.OneofOption.PROPERTIES)) {
        return ts_poet_1.TypeNames.unionType(type, ts_poet_1.TypeNames.UNDEFINED);
    }
    return type;
}
exports.toTypeName = toTypeName;
function detectMapType(typeMap, messageDesc, fieldDesc, options) {
    var _a;
    if (fieldDesc.label === FieldDescriptorProto.Label.LABEL_REPEATED &&
        fieldDesc.type === FieldDescriptorProto.Type.TYPE_MESSAGE) {
        const mapType = typeMap.get(fieldDesc.typeName)[2];
        if (!((_a = mapType.options) === null || _a === void 0 ? void 0 : _a.mapEntry))
            return undefined;
        const keyType = toTypeName(typeMap, messageDesc, mapType.field[0], options);
        // use basicTypeName because we don't need the '| undefined'
        const valueType = basicTypeName(typeMap, mapType.field[1], options);
        return { messageDesc: mapType, keyType, valueType };
    }
    return undefined;
}
exports.detectMapType = detectMapType;
