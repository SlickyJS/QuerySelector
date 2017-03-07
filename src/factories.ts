import {InputStream} from './inputStream';
import {Tokenizer} from './tokenizer';
import {Parser} from './parser';


export function createInputStreamFromString(input: string): InputStream
{
	return new InputStream(input);
}


export function createTokenizerFromInputStream(input: InputStream): Tokenizer
{
	return new Tokenizer(input);
}


export function createTokenizerFromString(input: string): Tokenizer
{
	return new Tokenizer(createInputStreamFromString(input));
}


export function createParserFromTokenizer(input: Tokenizer): Parser
{
	return new Parser(input);
}


export function createParserFromInputStream(input: InputStream): Parser
{
	return createParserFromTokenizer(createTokenizerFromInputStream(input));
}


export function createParserFromString(input: string): Parser
{
	return createParserFromInputStream(createInputStreamFromString(input));
}
