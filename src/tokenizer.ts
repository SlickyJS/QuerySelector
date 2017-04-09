import {AbstractTokenizer} from '@slicky/tokenizer';
import {InputStream} from './inputStream';
import {OPERATORS} from './data';


export enum TokenType
{
	NAME,
	STRING,
	PUNCTUATION,
	OPERATOR,
	WHITESPACE,
}


export declare interface Token
{
	type: TokenType,
	value: string,
}


export class Tokenizer extends AbstractTokenizer<Token>
{


	protected input: InputStream;


	constructor(input: InputStream)
	{
		super(input, {
			skipWhitespaces: false,
		});
	}


	public isPunctuation(ch?: string): boolean
	{
		return this.isCurrentToken(TokenType.PUNCTUATION, ch);
	}


	public isOperator(operator?: string): boolean
	{
		return this.isCurrentToken(TokenType.OPERATOR, operator);
	}


	public isName(): boolean
	{
		return this.isCurrentToken(TokenType.NAME);
	}


	public isString(): boolean
	{
		return this.isCurrentToken(TokenType.STRING);
	}


	public isWhitespace(): boolean
	{
		return this.isCurrentToken(TokenType.WHITESPACE);
	}


	public matchPunctuation(ch?: string): string
	{
		if (!this.isPunctuation(ch)) {
			this.error('Expected punctuation' + (ch ? ' "' + ch + '"' : ''));
		}

		return this.next().value;
	}


	public matchOperator(operator?: string): string
	{
		if (!this.isOperator(operator)) {
			this.error('Expected operator' + (operator ? ' "' + operator + '"' : ''));
		}

		return this.next().value;
	}


	public matchName(): string
	{
		if (!this.isName()) {
			this.error('Expected name');
		}

		return <string>this.next().value;
	}


	public matchString(): string
	{
		if (!this.isString()) {
			this.error('Expected string');
		}

		return <string>this.next().value;
	}


	public matchWhitespace(): void
	{
		if (!this.isWhitespace()) {
			this.error('Expected whitespace');
		}

		this.next();
	}


	public isCurrentToken(type: TokenType, value: string|number = null): boolean
	{
		return this.isToken(this.current(), type, value);
	}


	public isNextToken(type: TokenType, value: string|number = null): boolean
	{
		return this.isToken(this.lookahead(), type, value);
	}


	public isToken(token: Token, type: TokenType, value: string|number = null): boolean
	{
		return token && token.type === type && (value === null || token.value === value);
	}


	protected doParseCharacter(ch: string): Token
	{
		if (this.input.isStringStart(ch)) {
			return {
				type: TokenType.STRING,
				value: this.readString(),
			}
		}

		if (this.input.isWhitespace(ch)) {
			return this.readWhitespace();
		}

		if (this.input.isPunctuation(ch)) {
			return this.readPunctuation();
		}

		if (this.input.isOperator(ch)) {
			return this.readOperator();
		}

		if (this.input.isNameStart(ch)) {
			return this.readName();
		}

		return null;
	}


	private readName(): Token
	{
		let name = this.input.readWhile((ch) => this.input.isName(ch)).join('');

		return {
			type: TokenType.NAME,
			value: name,
		};
	}


	private readPunctuation(): Token
	{
		return {
			type: TokenType.PUNCTUATION,
			value: this.input.next(),
		};
	}


	private readOperator(): Token
	{
		return {
			type: TokenType.OPERATOR,
			value: this.input.matchOneOf(OPERATORS),
		};
	}


	private readWhitespace(): Token
	{
		return {
			type: TokenType.WHITESPACE,
			value: this.input.readWhile((ch) => this.input.isWhitespace(ch)).join(''),
		};
	}

}
