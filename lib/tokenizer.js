"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var tokenizer_1 = require("@slicky/tokenizer");
var data_1 = require("./data");
var TokenType;
(function (TokenType) {
    TokenType[TokenType["NAME"] = 0] = "NAME";
    TokenType[TokenType["STRING"] = 1] = "STRING";
    TokenType[TokenType["PUNCTUATION"] = 2] = "PUNCTUATION";
    TokenType[TokenType["OPERATOR"] = 3] = "OPERATOR";
    TokenType[TokenType["WHITESPACE"] = 4] = "WHITESPACE";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
var Tokenizer = (function (_super) {
    __extends(Tokenizer, _super);
    function Tokenizer(input) {
        return _super.call(this, input, {
            skipWhitespaces: false,
        }) || this;
    }
    Tokenizer.prototype.isPunctuation = function (ch) {
        return this.isCurrentToken(TokenType.PUNCTUATION, ch);
    };
    Tokenizer.prototype.isOperator = function (operator) {
        return this.isCurrentToken(TokenType.OPERATOR, operator);
    };
    Tokenizer.prototype.isName = function () {
        return this.isCurrentToken(TokenType.NAME);
    };
    Tokenizer.prototype.isString = function () {
        return this.isCurrentToken(TokenType.STRING);
    };
    Tokenizer.prototype.isWhitespace = function () {
        return this.isCurrentToken(TokenType.WHITESPACE);
    };
    Tokenizer.prototype.matchPunctuation = function (ch) {
        if (!this.isPunctuation(ch)) {
            this.error('Expected punctuation' + (ch ? ' "' + ch + '"' : ''));
        }
        return this.next().value;
    };
    Tokenizer.prototype.matchOperator = function (operator) {
        if (!this.isOperator(operator)) {
            this.error('Expected operator' + (operator ? ' "' + operator + '"' : ''));
        }
        return this.next().value;
    };
    Tokenizer.prototype.matchName = function () {
        if (!this.isName()) {
            this.error('Expected name');
        }
        return this.next().value;
    };
    Tokenizer.prototype.matchString = function () {
        if (!this.isString()) {
            this.error('Expected string');
        }
        return this.next().value;
    };
    Tokenizer.prototype.matchWhitespace = function () {
        if (!this.isWhitespace()) {
            this.error('Expected whitespace');
        }
        this.next();
    };
    Tokenizer.prototype.isCurrentToken = function (type, value) {
        if (value === void 0) { value = null; }
        return this.isToken(this.current(), type, value);
    };
    Tokenizer.prototype.isNextToken = function (type, value) {
        if (value === void 0) { value = null; }
        return this.isToken(this.lookahead(), type, value);
    };
    Tokenizer.prototype.isToken = function (token, type, value) {
        if (value === void 0) { value = null; }
        return token && token.type === type && (value === null || token.value === value);
    };
    Tokenizer.prototype.doParseCharacter = function (ch) {
        if (this.input.isStringStart(ch)) {
            return {
                type: TokenType.STRING,
                value: this.readString(),
            };
        }
        if (this.input.isWhitespace(ch)) {
            return this.readWhitespace();
        }
        if (this.input.isPunctuation(ch)) {
            return this.readPunctuation();
        }
        if (this.input.isOperator(ch)) {
            return this.readOperator();
        }
        if (this.input.isNameStart(ch)) {
            return this.readName();
        }
        return null;
    };
    Tokenizer.prototype.readName = function () {
        var _this = this;
        var name = this.input.readWhile(function (ch) { return _this.input.isName(ch); }).join('');
        return {
            type: TokenType.NAME,
            value: name,
        };
    };
    Tokenizer.prototype.readPunctuation = function () {
        return {
            type: TokenType.PUNCTUATION,
            value: this.input.next(),
        };
    };
    Tokenizer.prototype.readOperator = function () {
        return {
            type: TokenType.OPERATOR,
            value: this.input.matchOneOf(data_1.OPERATORS),
        };
    };
    Tokenizer.prototype.readWhitespace = function () {
        var _this = this;
        return {
            type: TokenType.WHITESPACE,
            value: this.input.readWhile(function (ch) { return _this.input.isWhitespace(ch); }).join(''),
        };
    };
    return Tokenizer;
}(tokenizer_1.AbstractTokenizer));
exports.Tokenizer = Tokenizer;
