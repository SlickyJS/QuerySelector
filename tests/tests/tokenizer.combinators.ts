import {tokenizeFromString, TokenType} from '../../src';
import {expect} from 'chai';


describe('#Tokenizer.combinators', () => {

	describe('tokenize()', () => {

		it('should tokenize adjacent sibling selector', () => {
			let tokens = tokenizeFromString('li + li');

			expect(tokens).to.be.eql([
				{
					type: TokenType.NAME,
					value: 'li',
				},
				{
					type: TokenType.WHITESPACE,
					value: ' ',
				},
				{
					type: TokenType.OPERATOR,
					value: '+',
				},
				{
					type: TokenType.WHITESPACE,
					value: ' ',
				},
				{
					type: TokenType.NAME,
					value: 'li',
				},
			]);
		});

		it('should tokenize general sibling selector', () => {
			let tokens = tokenizeFromString('p ~ span');

			expect(tokens).to.be.eql([
				{
					type: TokenType.NAME,
					value: 'p',
				},
				{
					type: TokenType.WHITESPACE,
					value: ' ',
				},
				{
					type: TokenType.OPERATOR,
					value: '~',
				},
				{
					type: TokenType.WHITESPACE,
					value: ' ',
				},
				{
					type: TokenType.NAME,
					value: 'span',
				},
			]);
		});

		it('should tokenize child selector', () => {
			let tokens = tokenizeFromString('div > span');

			expect(tokens).to.be.eql([
				{
					type: TokenType.NAME,
					value: 'div',
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
					value: 'span',
				},
			]);
		});

		it('should tokenize descendant selector with whitespace', () => {
			let tokens = tokenizeFromString('div span');

			expect(tokens).to.be.eql([
				{
					type: TokenType.NAME,
					value: 'div',
				},
				{
					type: TokenType.WHITESPACE,
					value: ' ',
				},
				{
					type: TokenType.NAME,
					value: 'span',
				},
			]);
		});

	});

});
