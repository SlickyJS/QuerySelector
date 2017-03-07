"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var factories_1 = require("./factories");
function tokenizeFromString(input) {
    return factories_1.createTokenizerFromString(input).tokenize();
}
exports.tokenizeFromString = tokenizeFromString;
function parseFromString(input) {
    return factories_1.createParserFromString(input).parse();
}
exports.parseFromString = parseFromString;
