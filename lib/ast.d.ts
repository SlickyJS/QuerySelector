export declare enum ASTNodeType {
    QUERY = 0,
    SELECTOR = 1,
    PARTS = 2,
    ELEMENT = 3,
    CLASS = 4,
    ID = 5,
    PSEUDO_CLASS = 6,
    ATTRIBUTE = 7,
    DESCENDANT = 8,
    CHILD = 9,
    ADJACENT_SIBLING = 10,
    GENERAL_SIBLING = 11,
}
export declare type ASTSimpleSelector = ASTElement | ASTId | ASTClass | ASTPseudoClass | ASTAttribute;
export declare type ASTSelectorNode = ASTParts | ASTDescendant | ASTChild | ASTAdjacentSibling | ASTGeneralSibling;
export interface ASTNode {
    type: ASTNodeType;
}
export interface ASTQuery extends ASTNode {
    type: ASTNodeType.QUERY;
    selectors: Array<ASTSelector>;
}
export interface ASTSelector extends ASTNode {
    type: ASTNodeType.SELECTOR;
    nodes: Array<ASTSelectorNode>;
}
export interface ASTParts extends ASTNode {
    type: ASTNodeType.PARTS;
    parts: Array<ASTSimpleSelector>;
}
export interface ASTElement extends ASTNode {
    type: ASTNodeType.ELEMENT;
    name: string;
}
export interface ASTClass extends ASTNode {
    type: ASTNodeType.CLASS;
    name: string;
}
export interface ASTId extends ASTNode {
    type: ASTNodeType.ID;
    name: string;
}
export interface ASTPseudoClass extends ASTNode {
    type: ASTNodeType.PSEUDO_CLASS;
    name: string;
}
export interface ASTAttribute extends ASTNode {
    type: ASTNodeType.ATTRIBUTE;
    caseSensitive: boolean;
    name: string;
    operator?: string;
    value?: string;
}
export interface ASTDescendant extends ASTNode {
    type: ASTNodeType.DESCENDANT;
}
export interface ASTChild extends ASTNode {
    type: ASTNodeType.CHILD;
}
export interface ASTAdjacentSibling extends ASTNode {
    type: ASTNodeType.ADJACENT_SIBLING;
}
export interface ASTGeneralSibling extends ASTNode {
    type: ASTNodeType.GENERAL_SIBLING;
}
