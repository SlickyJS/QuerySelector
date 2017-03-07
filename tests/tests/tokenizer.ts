import {tokenizeFromString, TokenType} from '../../src';
import {expect} from 'chai';


describe('#Tokenizer', () => {

	describe('tokenize()', () => {

		it('should squash whitespaces', () => {
			let tokens = tokenizeFromString('div    span');

			expect(tokens).to.be.eql([
				{
					type: TokenType.NAME,
					value: 'div',
				},
				{
					type: TokenType.WHITESPACE,
					value: '    ',
				},
				{
					type: TokenType.NAME,
					value: 'span',
				},
			]);
		});

		it('should tokenize query', () => {
			let tokens = tokenizeFromString('div:first-child, span[title], table td > a.btn.btn-success');

			expect(tokens).to.be.eql([
				{
					type: TokenType.NAME,
					value: 'div',
				},
				{
					type: TokenType.PUNCTUATION,
					value: ':',
				},
				{
					type: TokenType.NAME,
					value: 'first-child',
				},
				{
					type: TokenType.PUNCTUATION,
					value: ',',
				},
				{
					type: TokenType.WHITESPACE,
					value: ' ',
				},
				{
					type: TokenType.NAME,
					value: 'span',
				},
				{
					type: TokenType.PUNCTUATION,
					value: '[',
				},
				{
					type: TokenType.NAME,
					value: 'title',
				},
				{
					type: TokenType.PUNCTUATION,
					value: ']',
				},
				{
					type: TokenType.PUNCTUATION,
					value: ',',
				},
				{
					type: TokenType.WHITESPACE,
					value: ' ',
				},
				{
					type: TokenType.NAME,
					value: 'table',
				},
				{
					type: TokenType.WHITESPACE,
					value: ' ',
				},
				{
					type: TokenType.NAME,
					value: 'td',
				},
				{
					type: TokenType.WHITESPACE,
					value: ' ',
				},
				{
					type: TokenType.OPERATOR,
					value: '>',
				},
				{
					type: TokenType.WHITESPACE,
					value: ' ',
				},
				{
					type: TokenType.NAME,
					value: 'a',
				},
				{
					type: TokenType.PUNCTUATION,
					value: '.',
				},
				{
					type: TokenType.NAME,
					value: 'btn',
				},
				{
					type: TokenType.PUNCTUATION,
					value: '.',
				},
				{
					type: TokenType.NAME,
					value: 'btn-success',
				},
			]);
		});

	});

});
