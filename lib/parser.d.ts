import { Tokenizer } from './tokenizer';
import * as _ from './ast';
export declare class Parser {
    private input;
    constructor(input: Tokenizer);
    parse(): _.ASTQuery;
    private matchSelector();
    private matchParts();
    private matchPart();
    protected matchElement(): _.ASTElement;
    protected matchId(): _.ASTId;
    protected matchClass(): _.ASTClass;
    protected matchPseudoClass(): _.ASTPseudoClass;
    protected matchAttribute(): _.ASTAttribute;
    private matchChild();
    private matchDescendant();
    private matchAdjacentSibling();
    private matchGeneralSibling();
}
