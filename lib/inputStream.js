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
var InputStream = (function (_super) {
    __extends(InputStream, _super);
    function InputStream() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InputStream.prototype.isNameStart = function (ch) {
        return /[a-z]/.test(ch);
    };
    InputStream.prototype.isName = function (ch) {
        return this.isNameStart(ch) || ch === '-';
    };
    InputStream.prototype.isPunctuation = function (ch) {
        return '.,:#[]'.indexOf(ch) >= 0;
    };
    InputStream.prototype.isOperator = function (ch) {
        return '=~|^$*+>'.indexOf(ch) >= 0;
    };
    return InputStream;
}(tokenizer_1.InputStream));
exports.InputStream = InputStream;
