"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("./data");
var _ = require("./ast");
var Parser = (function () {
    function Parser(input) {
        this.input = input;
    }
    Parser.prototype.parse = function () {
        var _this = this;
        var selectors = [];
        while (!this.input.eof()) {
            selectors.push(this.matchSelector());
            if (!this.input.eof()) {
                this.input.readWhile(function () { return _this.input.isWhitespace(); });
                this.input.matchPunctuation(data_1.SELECTOR_SEPARATOR);
                this.input.readWhile(function () { return _this.input.isWhitespace(); });
            }
        }
        return {
            type: _.ASTNodeType.QUERY,
            selectors: selectors,
        };
    };
    Parser.prototype.matchSelector = function () {
        var nodes = [];
        while (!this.input.eof()) {
            var descendant = null;
            nodes.push(this.matchParts());
            if (this.input.isWhitespace()) {
                descendant = this.matchDescendant();
            }
            if (this.input.isPunctuation(data_1.SELECTOR_SEPARATOR)) {
                break;
            }
            if (this.input.isOperator('>')) {
                nodes.push(this.matchChild());
            }
            else if (this.input.isOperator('+')) {
                nodes.push(this.matchAdjacentSibling());
            }
            else if (this.input.isOperator('~')) {
                nodes.push(this.matchGeneralSibling());
            }
            else if (descendant) {
                nodes.push(descendant);
            }
            if (this.input.isWhitespace()) {
                this.input.next();
            }
        }
        return {
            type: _.ASTNodeType.SELECTOR,
            nodes: nodes,
        };
    };
    Parser.prototype.matchParts = function () {
        var parts = [];
        while (!this.input.eof()) {
            parts.push(this.matchPart());
            if (this.input.isWhitespace() || this.input.isPunctuation(data_1.SELECTOR_SEPARATOR) || this.input.isOperator('>') || this.input.isOperator('+') || this.input.isOperator('~')) {
                break;
            }
        }
        return {
            type: _.ASTNodeType.PARTS,
            parts: parts,
        };
    };
    Parser.prototype.matchPart = function () {
        if (this.input.isName()) {
            return this.matchElement();
        }
        if (this.input.isPunctuation('#')) {
            return this.matchId();
        }
        if (this.input.isPunctuation('.')) {
            return this.matchClass();
        }
        if (this.input.isPunctuation('[')) {
            return this.matchAttribute();
        }
        if (this.input.isPunctuation(':')) {
            return this.matchPseudoClass();
        }
    };
    Parser.prototype.matchElement = function () {
        return {
            type: _.ASTNodeType.ELEMENT,
            name: this.input.matchName(),
        };
    };
    Parser.prototype.matchId = function () {
        this.input.matchPunctuation('#');
        return {
            type: _.ASTNodeType.ID,
            name: this.input.matchName(),
        };
    };
    Parser.prototype.matchClass = function () {
        this.input.matchPunctuation('.');
        return {
            type: _.ASTNodeType.CLASS,
            name: this.input.matchName(),
        };
    };
    Parser.prototype.matchPseudoClass = function () {
        this.input.matchPunctuation(':');
        return {
            type: _.ASTNodeType.PSEUDO_CLASS,
            name: this.input.matchName(),
        };
    };
    Parser.prototype.matchAttribute = function () {
        this.input.matchPunctuation('[');
        var caseSensitive = true;
        var name = this.input.matchName();
        var operator = null;
        var value = null;
        if (this.input.isOperator()) {
            operator = this.input.matchOperator();
            value = this.input.matchString();
        }
        if (this.input.isWhitespace()) {
            this.input.matchWhitespace();
            var current = this.input.matchName();
            if (current !== 'i' && current !== 'I') {
                this.input.error("Unexpected \"" + current + "\"");
            }
            caseSensitive = false;
        }
        this.input.matchPunctuation(']');
        return {
            type: _.ASTNodeType.ATTRIBUTE,
            caseSensitive: caseSensitive,
            name: name,
            operator: operator,
            value: value,
        };
    };
    Parser.prototype.matchChild = function () {
        this.input.matchOperator('>');
        return {
            type: _.ASTNodeType.CHILD,
        };
    };
    Parser.prototype.matchDescendant = function () {
        this.input.matchWhitespace();
        return {
            type: _.ASTNodeType.DESCENDANT,
        };
    };
    Parser.prototype.matchAdjacentSibling = function () {
        this.input.matchOperator('+');
        return {
            type: _.ASTNodeType.ADJACENT_SIBLING,
        };
    };
    Parser.prototype.matchGeneralSibling = function () {
        this.input.matchOperator('~');
        return {
            type: _.ASTNodeType.GENERAL_SIBLING,
        };
    };
    return Parser;
}());
exports.Parser = Parser;
