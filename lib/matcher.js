"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var parser_1 = require("./parser");
var tokenizer_1 = require("./tokenizer");
var inputStream_1 = require("./inputStream");
var _ = require("./ast");
var Matcher = (function () {
    function Matcher(walker) {
        this.walker = walker;
    }
    Matcher.prototype.querySelector = function (parent, selector) {
        var ast = this.getAST(selector);
        for (var i = 0; i < ast.selectors.length; i++) {
            var found = this.scan(parent, ast.selectors[i], true);
            if (found.length) {
                return found[0];
            }
        }
        return null;
    };
    Matcher.prototype.querySelectorAll = function (parent, selector) {
        var ast = this.getAST(selector);
        var found = [];
        for (var i = 0; i < ast.selectors.length; i++) {
            found = utils_1.merge(found, this.scan(parent, ast.selectors[i]));
        }
        return found;
    };
    Matcher.prototype.matches = function (element, selector, parent) {
        if (!parent) {
            parent = this.getTopParent(element);
        }
        var matches = this.querySelectorAll(parent, selector);
        return matches.indexOf(element) >= 0;
    };
    Matcher.prototype.scan = function (parent, selector, onlyFirst) {
        if (onlyFirst === void 0) { onlyFirst = false; }
        return this.scanChildNodes(this.getChildElements(parent), selector.nodes, onlyFirst);
    };
    Matcher.prototype.scanChildNodes = function (elements, nodes, onlyFirst, recursively) {
        if (onlyFirst === void 0) { onlyFirst = false; }
        if (recursively === void 0) { recursively = true; }
        var found = [];
        for (var i = 0; i < elements.length; i++) {
            found = utils_1.merge(found, this.scanElement(elements[i], nodes, onlyFirst));
            if (onlyFirst && found.length) {
                break;
            }
            if (!recursively) {
                continue;
            }
            found = utils_1.merge(found, this.scanChildNodes(this.getChildElements(elements[i]), nodes, onlyFirst));
            if (onlyFirst && found.length) {
                break;
            }
        }
        return found;
    };
    Matcher.prototype.scanSiblings = function (element, nodes, adjacent, onlyFirst) {
        if (adjacent === void 0) { adjacent = false; }
        if (onlyFirst === void 0) { onlyFirst = false; }
        var childNodes = this.getChildElements(this.walker.getParentNode(element));
        var position = childNodes.indexOf(element);
        if (position === childNodes.length - 1) {
            return [];
        }
        if (adjacent) {
            return this.scanElement(childNodes[position + 1], nodes, onlyFirst);
        }
        for (var i = position + 1; i < childNodes.length; i++) {
            var found = this.scanElement(childNodes[i], nodes, onlyFirst);
            if (found.length) {
                return found;
            }
        }
        return [];
    };
    Matcher.prototype.scanElement = function (element, nodes, onlyFirst) {
        if (onlyFirst === void 0) { onlyFirst = false; }
        var node = nodes[0];
        var next = nodes[1];
        if (node.type === _.ASTNodeType.PARTS) {
            if (!this.matchParts(element, node)) {
                return [];
            }
            if (!utils_1.exists(next)) {
                return [element];
            }
        }
        if (!utils_1.exists(next)) {
            return [];
        }
        if (next.type === _.ASTNodeType.DESCENDANT) {
            return this.scanChildNodes(this.getChildElements(element), nodes.slice(2), onlyFirst);
        }
        if (next.type === _.ASTNodeType.CHILD) {
            return this.scanChildNodes(this.getChildElements(element), nodes.slice(2), onlyFirst, false);
        }
        if (next.type === _.ASTNodeType.ADJACENT_SIBLING) {
            return this.scanSiblings(element, nodes.slice(2), true, onlyFirst);
        }
        if (next.type === _.ASTNodeType.GENERAL_SIBLING) {
            return this.scanSiblings(element, nodes.slice(2), false, onlyFirst);
        }
        return [];
    };
    Matcher.prototype.matchParts = function (element, parts) {
        for (var i = 0; i < parts.parts.length; i++) {
            if (this.matchPart(element, parts.parts[i])) {
                return true;
            }
        }
        return false;
    };
    Matcher.prototype.matchPart = function (element, part) {
        switch (part.type) {
            case _.ASTNodeType.ELEMENT: return this.matchElementName(element, part);
            case _.ASTNodeType.ID: return this.matchId(element, part);
            case _.ASTNodeType.CLASS: return this.matchClass(element, part);
            case _.ASTNodeType.ATTRIBUTE: return this.matchAttribute(element, part);
            case _.ASTNodeType.PSEUDO_CLASS: return this.matchPseudoClass(element, part);
        }
        part = part;
        throw new Error("Matcher: can not match by " + _.ASTNodeType[part.type] + " (\"" + part.name + "\")");
    };
    Matcher.prototype.matchElementName = function (element, name) {
        return name.name === this.walker.getNodeName(element);
    };
    Matcher.prototype.matchId = function (element, id) {
        return id.name === this.walker.getAttribute(element, 'id');
    };
    Matcher.prototype.matchClass = function (element, className) {
        return this.isInList(this.walker.getAttribute(element, 'class') || '', className.name);
    };
    Matcher.prototype.matchAttribute = function (element, attr) {
        var value = this.walker.getAttribute(element, attr.name);
        if (attr.operator === null && attr.value === null) {
            return value != null;
        }
        switch (attr.operator) {
            case '=': return this.isEqual(value, attr.value, attr.caseSensitive);
            case '~=': return this.isInList(value, attr.value, attr.caseSensitive);
            case '*=': return this.includes(value, attr.value, attr.caseSensitive);
            case '|=': return this.isEqual(value, attr.value, attr.caseSensitive) || this.startsWith(value, attr.value + '-', attr.caseSensitive);
            case '^=': return this.isEqual(value, attr.value, attr.caseSensitive) || this.startsWith(value, attr.value, attr.caseSensitive);
            case '$=': return this.isEqual(value, attr.value, attr.caseSensitive) || this.endsWith(value, attr.value, attr.caseSensitive);
        }
        throw new Error("Matcher: can not match by attribute [" + (attr.name + attr.operator) + "\"" + attr.value + "\"]");
    };
    Matcher.prototype.matchPseudoClass = function (element, pseudoClass) {
        switch (pseudoClass.name) {
            case 'empty': return this.isElementEmpty(element);
            case 'first-child': return this.isElementFirstChild(element);
            case 'last-child': return this.isElementLastChild(element);
            case 'first-of-type': return this.isElementFirstOfType(element);
            case 'last-of-type': return this.isElementLastOfType(element);
        }
        throw new Error("Matcher: can not match by pseudo class :" + pseudoClass.name);
    };
    Matcher.prototype.isInList = function (str, search, caseSensitive) {
        if (caseSensitive === void 0) { caseSensitive = true; }
        var list = str.split(' ');
        if (!caseSensitive) {
            list = utils_1.map(list, function (item) { return item.toLowerCase(); });
        }
        return caseSensitive ? list.indexOf(search) >= 0 : list.indexOf(search.toLowerCase()) >= 0;
    };
    Matcher.prototype.isEqual = function (str, search, caseSensitive) {
        if (caseSensitive === void 0) { caseSensitive = true; }
        return caseSensitive ? str === search : str.toLowerCase() === search.toLowerCase();
    };
    Matcher.prototype.startsWith = function (str, search, caseSensitive) {
        if (caseSensitive === void 0) { caseSensitive = true; }
        if (!caseSensitive) {
            str = str.toLowerCase();
            search = search.toLowerCase();
        }
        return utils_1.startsWith(str, search);
    };
    Matcher.prototype.endsWith = function (str, search, caseSensitive) {
        if (caseSensitive === void 0) { caseSensitive = true; }
        if (!caseSensitive) {
            str = str.toLowerCase();
            search = search.toLowerCase();
        }
        return utils_1.endsWith(str, search);
    };
    Matcher.prototype.includes = function (str, search, caseSensitive) {
        if (caseSensitive === void 0) { caseSensitive = true; }
        if (!caseSensitive) {
            str = str.toLowerCase();
            search = search.toLowerCase();
        }
        return utils_1.includes(str, search);
    };
    Matcher.prototype.isElementEmpty = function (element) {
        var childNodes = this.walker.getChildNodes(element);
        for (var i = 0; childNodes.length; i++) {
            if (this.walker.isString(childNodes[i]) || this.walker.isElement(childNodes[i])) {
                return false;
            }
        }
        return true;
    };
    Matcher.prototype.isElementFirstChild = function (element) {
        return this.getChildElements(this.walker.getParentNode(element)).indexOf(element) === 0;
    };
    Matcher.prototype.isElementLastChild = function (element) {
        var childNodes = this.getChildElements(this.walker.getParentNode(element));
        return childNodes.indexOf(element) === (childNodes.length - 1);
    };
    Matcher.prototype.isElementFirstOfType = function (element) {
        var _this = this;
        var childNodes = this.getChildElements(this.walker.getParentNode(element));
        var type = this.walker.getNodeName(element);
        var first = utils_1.find(childNodes, function (node) {
            return _this.walker.getNodeName(node) === type;
        });
        return first === element;
    };
    Matcher.prototype.isElementLastOfType = function (element) {
        var _this = this;
        var childNodes = this.getChildElements(this.walker.getParentNode(element));
        var type = this.walker.getNodeName(element);
        var others = utils_1.filter(childNodes, function (node) {
            return _this.walker.getNodeName(node) === type;
        });
        return others[others.length - 1] === element;
    };
    Matcher.prototype.getChildElements = function (parent) {
        var _this = this;
        return utils_1.filter(this.walker.getChildNodes(parent), function (node) {
            return _this.walker.isElement(node);
        });
    };
    Matcher.prototype.getTopParent = function (element) {
        var parent;
        while (parent = this.walker.getParentNode(element)) {
            element = parent;
        }
        return element;
    };
    Matcher.prototype.getAST = function (selector) {
        return (new parser_1.Parser(new tokenizer_1.Tokenizer(new inputStream_1.InputStream(selector)))).parse();
    };
    return Matcher;
}());
exports.Matcher = Matcher;
