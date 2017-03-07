import {tokenizeFromString, TokenType} from '../../src';
import {expect} from 'chai';


describe('#Tokenizer.attrs', () => {

	describe('tokenize()', () => {

		it('should tokenize attribute', () => {
			let tokens = tokenizeFromString('[title]');

			expect(tokens).to.be.eql([
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
			]);
		});

		it('should tokenize attribute with exact value', () => {
			let tokens = tokenizeFromString('[title="hello"]');

			expect(tokens).to.be.eql([
				{
					type: TokenType.PUNCTUATION,
					value: '[',
				},
				{
					type: TokenType.NAME,
					value: 'title',
				},
				{
					type: TokenType.OPERATOR,
					value: '=',
				},
				{
					type: TokenType.STRING,
					value: 'hello',
				},
				{
					type: TokenType.PUNCTUATION,
					value: ']',
				},
			]);
		});

		it('should tokenize attribute with list', () => {
			let tokens = tokenizeFromString('[title~="hello"]');

			expect(tokens).to.be.eql([
				{
					type: TokenType.PUNCTUATION,
					value: '[',
				},
				{
					type: TokenType.NAME,
					value: 'title',
				},
				{
					type: TokenType.OPERATOR,
					value: '~=',
				},
				{
					type: TokenType.STRING,
					value: 'hello',
				},
				{
					type: TokenType.PUNCTUATION,
					value: ']',
				},
			]);
		});

		it('should tokenize attribute matching language code', () => {
			let tokens = tokenizeFromString('[lang|="cs"]');

			expect(tokens).to.be.eql([
				{
					type: TokenType.PUNCTUATION,
					value: '[',
				},
				{
					type: TokenType.NAME,
					value: 'lang',
				},
				{
					type: TokenType.OPERATOR,
					value: '|=',
				},
				{
					type: TokenType.STRING,
					value: 'cs',
				},
				{
					type: TokenType.PUNCTUATION,
					value: ']',
				},
			]);
		});

		it('should tokenize attribute matching beginning', () => {
			let tokens = tokenizeFromString('[href^="#"]');

			expect(tokens).to.be.eql([
				{
					type: TokenType.PUNCTUATION,
					value: '[',
				},
				{
					type: TokenType.NAME,
					value: 'href',
				},
				{
					type: TokenType.OPERATOR,
					value: '^=',
				},
				{
					type: TokenType.STRING,
					value: '#',
				},
				{
					type: TokenType.PUNCTUATION,
					value: ']',
				},
			]);
		});

		it('should tokenize attribute matching end', () => {
			let tokens = tokenizeFromString('[href$=".cn"]');

			expect(tokens).to.be.eql([
				{
					type: TokenType.PUNCTUATION,
					value: '[',
				},
				{
					type: TokenType.NAME,
					value: 'href',
				},
				{
					type: TokenType.OPERATOR,
					value: '$=',
				},
				{
					type: TokenType.STRING,
					value: '.cn',
				},
				{
					type: TokenType.PUNCTUATION,
					value: ']',
				},
			]);
		});

		it('should tokenize attribute matching substring', () => {
			let tokens = tokenizeFromString('[href*="example"]');

			expect(tokens).to.be.eql([
				{
					type: TokenType.PUNCTUATION,
					value: '[',
				},
				{
					type: TokenType.NAME,
					value: 'href',
				},
				{
					type: TokenType.OPERATOR,
					value: '*=',
				},
				{
					type: TokenType.STRING,
					value: 'example',
				},
				{
					type: TokenType.PUNCTUATION,
					value: ']',
				},
			]);
		});

		it('should read case insensitive attribute', () => {
			let tokens = tokenizeFromString('[type="email" i]');

			expect(tokens).to.be.eql([
				{
					type: TokenType.PUNCTUATION,
					value: '[',
				},
				{
					type: TokenType.NAME,
					value: 'type',
				},
				{
					type: TokenType.OPERATOR,
					value: '=',
				},
				{
					type: TokenType.STRING,
					value: 'email',
				},
				{
					type: TokenType.WHITESPACE,
					value: ' ',
				},
				{
					type: TokenType.NAME,
					value: 'i',
				},
				{
					type: TokenType.PUNCTUATION,
					value: ']',
				},
			]);
		});

	});

});
