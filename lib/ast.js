"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ASTNodeType;
(function (ASTNodeType) {
    ASTNodeType[ASTNodeType["QUERY"] = 0] = "QUERY";
    ASTNodeType[ASTNodeType["SELECTOR"] = 1] = "SELECTOR";
    ASTNodeType[ASTNodeType["PARTS"] = 2] = "PARTS";
    ASTNodeType[ASTNodeType["ELEMENT"] = 3] = "ELEMENT";
    ASTNodeType[ASTNodeType["CLASS"] = 4] = "CLASS";
    ASTNodeType[ASTNodeType["ID"] = 5] = "ID";
    ASTNodeType[ASTNodeType["PSEUDO_CLASS"] = 6] = "PSEUDO_CLASS";
    ASTNodeType[ASTNodeType["ATTRIBUTE"] = 7] = "ATTRIBUTE";
    ASTNodeType[ASTNodeType["DESCENDANT"] = 8] = "DESCENDANT";
    ASTNodeType[ASTNodeType["CHILD"] = 9] = "CHILD";
    ASTNodeType[ASTNodeType["ADJACENT_SIBLING"] = 10] = "ADJACENT_SIBLING";
    ASTNodeType[ASTNodeType["GENERAL_SIBLING"] = 11] = "GENERAL_SIBLING";
})(ASTNodeType = exports.ASTNodeType || (exports.ASTNodeType = {}));
