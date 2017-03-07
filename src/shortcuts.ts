import {Token} from './tokenizer';
import {ASTQuery} from './ast';
import {createTokenizerFromString, createParserFromString} from './factories';


export function tokenizeFromString(input: string): Array<Token>
{
	return createTokenizerFromString(input).tokenize();
}


export function parseFromString(input: string): ASTQuery
{
	return createParserFromString(input).parse();
}
