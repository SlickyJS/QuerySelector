"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inputStream_1 = require("./inputStream");
var tokenizer_1 = require("./tokenizer");
var parser_1 = require("./parser");
function createInputStreamFromString(input) {
    return new inputStream_1.InputStream(input);
}
exports.createInputStreamFromString = createInputStreamFromString;
function createTokenizerFromInputStream(input) {
    return new tokenizer_1.Tokenizer(input);
}
exports.createTokenizerFromInputStream = createTokenizerFromInputStream;
function createTokenizerFromString(input) {
    return new tokenizer_1.Tokenizer(createInputStreamFromString(input));
}
exports.createTokenizerFromString = createTokenizerFromString;
function createParserFromTokenizer(input) {
    return new parser_1.Parser(input);
}
exports.createParserFromTokenizer = createParserFromTokenizer;
function createParserFromInputStream(input) {
    return createParserFromTokenizer(createTokenizerFromInputStream(input));
}
exports.createParserFromInputStream = createParserFromInputStream;
function createParserFromString(input) {
    return createParserFromInputStream(createInputStreamFromString(input));
}
exports.createParserFromString = createParserFromString;
