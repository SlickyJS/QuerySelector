import { AbstractTokenizer } from '@slicky/tokenizer';
import { InputStream } from './inputStream';
export declare enum TokenType {
    NAME = 0,
    STRING = 1,
    PUNCTUATION = 2,
    OPERATOR = 3,
    WHITESPACE = 4,
}
export interface Token {
    type: TokenType;
    value: string;
}
export declare class Tokenizer extends AbstractTokenizer<Token> {
    protected input: InputStream;
    constructor(input: InputStream);
    isPunctuation(ch?: string): boolean;
    isOperator(operator?: string): boolean;
    isName(): boolean;
    isString(): boolean;
    isWhitespace(): boolean;
    matchPunctuation(ch?: string): string;
    matchOperator(operator?: string): string;
    matchName(): string;
    matchString(): string;
    matchWhitespace(): void;
    isCurrentToken(type: TokenType, value?: string | number): boolean;
    isNextToken(type: TokenType, value?: string | number): boolean;
    isToken(token: Token, type: TokenType, value?: string | number): boolean;
    protected doParseCharacter(ch: string): Token;
    private readName();
    private readPunctuation();
    private readOperator();
    private readWhitespace();
}
