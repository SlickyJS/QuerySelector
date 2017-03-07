import { Token } from './tokenizer';
import { ASTQuery } from './ast';
export declare function tokenizeFromString(input: string): Array<Token>;
export declare function parseFromString(input: string): ASTQuery;
