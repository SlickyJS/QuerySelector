import * as _ from '@slicky/ast-query-selector';
import { IDocumentWalker, DocumentParent, DocumentNode } from './documentWalker';
export declare class Matcher {
    private walker;
    constructor(documentWalker: IDocumentWalker);
    querySelector(parent: DocumentParent, selector: string): DocumentNode;
    querySelectorAll(parent: DocumentParent, selector: string): Array<DocumentNode>;
    matches(element: DocumentNode, selector: string, parent?: DocumentParent): boolean;
    _querySelectorByAST(parent: DocumentParent, ast: _.ASTQuery): DocumentNode;
    _querySelectorAllByAST(parent: DocumentParent, ast: _.ASTQuery): Array<DocumentNode>;
    _matchesByAST(element: DocumentNode, ast: _.ASTQuery, parent?: DocumentParent): boolean;
    private scan(parent, selector, onlyFirst?);
    private scanChildNodes(elements, selector, onlyFirst?, recursively?);
    private scanSiblings(element, selector, adjacent?, onlyFirst?);
    private scanElement(element, selector, onlyFirst?);
    private scanCombinator(element, combinator, onlyFirst?);
    private matchRules(element, rules);
    private matchRule(element, rule);
}
