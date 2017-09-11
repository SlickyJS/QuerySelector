"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("@slicky/ast-query-selector");
var utils_1 = require("@slicky/utils");
var Matcher = (function () {
    function Matcher(documentWalker) {
        this.walker = documentWalker;
    }
    Matcher.prototype.querySelector = function (parent, selector) {
        return this._querySelectorByAST(parent, _.Parser.createFromString(selector).parse());
    };
    Matcher.prototype.querySelectorAll = function (parent, selector) {
        return this._querySelectorAllByAST(parent, _.Parser.createFromString(selector).parse());
    };
    Matcher.prototype.matches = function (element, selector, parent) {
        return this._matchesByAST(element, _.Parser.createFromString(selector).parse(), parent);
    };
    Matcher.prototype._querySelectorByAST = function (parent, ast) {
        for (var i = 0; i < ast.selectors.length; i++) {
            var found = this.scan(parent, ast.selectors[i], true);
            if (found.length) {
                return found[0];
            }
        }
        return undefined;
    };
    Matcher.prototype._querySelectorAllByAST = function (parent, ast) {
        var found = [];
        for (var i = 0; i < ast.selectors.length; i++) {
            found = utils_1.merge(found, this.scan(parent, ast.selectors[i]));
        }
        return found;
    };
    Matcher.prototype._matchesByAST = function (element, ast, parent) {
        if (!parent) {
            parent = getTopParent(this.walker, element);
        }
        var matches = this._querySelectorAllByAST(parent, ast);
        return matches.indexOf(element) >= 0;
    };
    Matcher.prototype.scan = function (parent, selector, onlyFirst) {
        if (onlyFirst === void 0) { onlyFirst = false; }
        return this.scanChildNodes(getChildElements(this.walker, parent), selector.parts, onlyFirst);
    };
    Matcher.prototype.scanChildNodes = function (elements, selector, onlyFirst, recursively) {
        if (onlyFirst === void 0) { onlyFirst = false; }
        if (recursively === void 0) { recursively = true; }
        var found = [];
        for (var i = 0; i < elements.length; i++) {
            found = utils_1.merge(found, this.scanElement(elements[i], selector, onlyFirst));
            if (onlyFirst && found.length) {
                break;
            }
            if (!recursively) {
                continue;
            }
            found = utils_1.merge(found, this.scanChildNodes(getChildElements(this.walker, elements[i]), selector, onlyFirst));
            if (onlyFirst && found.length) {
                break;
            }
        }
        return found;
    };
    Matcher.prototype.scanSiblings = function (element, selector, adjacent, onlyFirst) {
        if (adjacent === void 0) { adjacent = false; }
        if (onlyFirst === void 0) { onlyFirst = false; }
        var childNodes = getChildElements(this.walker, this.walker.getParentNode(element));
        var position = childNodes.indexOf(element);
        if (position === childNodes.length - 1) {
            return [];
        }
        if (adjacent) {
            return this.scanElement(childNodes[position + 1], selector, onlyFirst);
        }
        for (var i = position + 1; i < childNodes.length; i++) {
            var found = this.scanElement(childNodes[i], selector, onlyFirst);
            if (found.length) {
                return found;
            }
        }
        return [];
    };
    Matcher.prototype.scanElement = function (element, selector, onlyFirst) {
        if (onlyFirst === void 0) { onlyFirst = false; }
        if (selector instanceof _.ASTRulesSet) {
            if (this.matchRules(element, selector)) {
                return [element];
            }
            return [];
        }
        else if (selector instanceof _.ASTCombinator) {
            return this.scanCombinator(element, selector, onlyFirst);
        }
        return [];
    };
    Matcher.prototype.scanCombinator = function (element, combinator, onlyFirst) {
        if (onlyFirst === void 0) { onlyFirst = false; }
        if (!this.matchRules(element, combinator.left)) {
            return [];
        }
        if (combinator instanceof _.ASTDescendant) {
            return this.scanChildNodes(getChildElements(this.walker, element), combinator.right, onlyFirst);
        }
        if (combinator instanceof _.ASTChild) {
            return this.scanChildNodes(getChildElements(this.walker, element), combinator.right, onlyFirst, false);
        }
        if (combinator instanceof _.ASTAdjacentSibling) {
            return this.scanSiblings(element, combinator.right, true, onlyFirst);
        }
        if (combinator instanceof _.ASTGeneralSibling) {
            return this.scanSiblings(element, combinator.right, false, onlyFirst);
        }
        return [];
    };
    Matcher.prototype.matchRules = function (element, rules) {
        for (var i = 0; i < rules.parts.length; i++) {
            if (!this.matchRule(element, rules.parts[i])) {
                return false;
            }
        }
        return true;
    };
    Matcher.prototype.matchRule = function (element, rule) {
        if (rule instanceof _.ASTElement) {
            return this.walker.getNodeName(element) === rule.name;
        }
        if (rule instanceof _.ASTId) {
            return this.walker.getAttribute(element, 'id') === rule.name;
        }
        if (rule instanceof _.ASTClass) {
            return isInList(this.walker.getAttribute(element, 'class') || '', rule.name);
        }
        if (rule instanceof _.ASTPseudoClass) {
            switch (rule.name) {
                case 'empty': return isElementEmpty(this.walker, element);
                case 'first-child': return isElementFirstChild(this.walker, element);
                case 'last-child': return isElementLastChild(this.walker, element);
                case 'first-of-type': return isElementFirstOfType(this.walker, element);
                case 'last-of-type': return isElementLastOfType(this.walker, element);
                case 'not': return isElementAllowedForNot(this, this.walker, element, rule.fn);
            }
            throw new Error("Matcher: can not match by pseudo class :" + rule.name);
        }
        if (rule instanceof _.ASTAttribute) {
            var value = this.walker.getAttribute(element, rule.name);
            if (!utils_1.exists(rule.operator) && !utils_1.exists(rule.value)) {
                return value != null;
            }
            switch (rule.operator) {
                case '=': return isEqual(value, rule.value, rule.caseSensitive);
                case '~=': return isInList(value, rule.value, rule.caseSensitive);
                case '*=': return utils_1.includes(value, rule.value, rule.caseSensitive);
                case '|=': return isEqual(value, rule.value, rule.caseSensitive) || utils_1.startsWith(value, rule.value + '-', rule.caseSensitive);
                case '^=': return isEqual(value, rule.value, rule.caseSensitive) || utils_1.startsWith(value, rule.value, rule.caseSensitive);
                case '$=': return isEqual(value, rule.value, rule.caseSensitive) || utils_1.endsWith(value, rule.value, rule.caseSensitive);
            }
            throw new Error("Matcher: can not match by attribute [" + (rule.name + rule.operator) + "\"" + rule.value + "\"]");
        }
        return false;
    };
    return Matcher;
}());
exports.Matcher = Matcher;
function isInList(str, search, caseSensitive) {
    if (caseSensitive === void 0) { caseSensitive = true; }
    var list = str.split(' ');
    if (!caseSensitive) {
        list = utils_1.map(list, function (item) { return item.toLowerCase(); });
    }
    return caseSensitive ? list.indexOf(search) >= 0 : list.indexOf(search.toLowerCase()) >= 0;
}
function isEqual(str, search, caseSensitive) {
    if (caseSensitive === void 0) { caseSensitive = true; }
    return caseSensitive ? str === search : str.toLowerCase() === search.toLowerCase();
}
function getTopParent(walker, element) {
    var parent;
    while (parent = walker.getParentNode(element)) {
        element = parent;
    }
    return element;
}
function getChildElements(walker, parent) {
    return utils_1.filter(walker.getChildNodes(parent), function (node) {
        return walker.isElement(node);
    });
}
function isElementEmpty(walker, element) {
    var childNodes = walker.getChildNodes(element);
    for (var i = 0; childNodes.length; i++) {
        if (walker.isString(childNodes[i]) || walker.isElement(childNodes[i])) {
            return false;
        }
    }
    return true;
}
function isElementFirstChild(walker, element) {
    return getChildElements(walker, walker.getParentNode(element)).indexOf(element) === 0;
}
function isElementLastChild(walker, element) {
    var childNodes = getChildElements(walker, walker.getParentNode(element));
    return childNodes.indexOf(element) === (childNodes.length - 1);
}
function isElementFirstOfType(walker, element) {
    var childNodes = getChildElements(walker, walker.getParentNode(element));
    var type = walker.getNodeName(element);
    var first = utils_1.find(childNodes, function (node) {
        return walker.getNodeName(node) === type;
    });
    return first === element;
}
function isElementLastOfType(walker, element) {
    var childNodes = getChildElements(walker, walker.getParentNode(element));
    var type = walker.getNodeName(element);
    var others = utils_1.filter(childNodes, function (node) {
        return walker.getNodeName(node) === type;
    });
    return others[others.length - 1] === element;
}
function isElementAllowedForNot(matcher, walker, element, fn) {
    return !matcher._matchesByAST(element, new _.ASTQuery([fn]), walker.getParentNode(element));
}
