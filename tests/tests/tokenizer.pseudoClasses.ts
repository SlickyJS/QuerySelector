import {tokenizeFromString, TokenType} from '../../src';
import {expect} from 'chai';


describe('#Tokenizer.pseudoClasses', () => {

	describe('tokenize()', () => {

		it('should tokenize :empty', () => {
			let tokens = tokenizeFromString(':empty');

			expect(tokens).to.be.eql([
				{
					type: TokenType.PUNCTUATION,
					value: ':',
				},
				{
					type: TokenType.NAME,
					value: 'empty',
				},
			]);
		});

		it('should tokenize :first-child', () => {
			let tokens = tokenizeFromString(':first-child');

			expect(tokens).to.be.eql([
				{
					type: TokenType.PUNCTUATION,
					value: ':',
				},
				{
					type: TokenType.NAME,
					value: 'first-child',
				},
			]);
		});

		it('should tokenize :first-of-type', () => {
			let tokens = tokenizeFromString(':first-of-type');

			expect(tokens).to.be.eql([
				{
					type: TokenType.PUNCTUATION,
					value: ':',
				},
				{
					type: TokenType.NAME,
					value: 'first-of-type',
				},
			]);
		});

		it('should tokenize :last-child', () => {
			let tokens = tokenizeFromString(':last-child');

			expect(tokens).to.be.eql([
				{
					type: TokenType.PUNCTUATION,
					value: ':',
				},
				{
					type: TokenType.NAME,
					value: 'last-child',
				},
			]);
		});

		it('should tokenize :last-of-type', () => {
			let tokens = tokenizeFromString(':last-of-type');

			expect(tokens).to.be.eql([
				{
					type: TokenType.PUNCTUATION,
					value: ':',
				},
				{
					type: TokenType.NAME,
					value: 'last-of-type',
				},
			]);
		});

	});

});
