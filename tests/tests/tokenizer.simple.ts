import {tokenizeFromString, TokenType} from '../../src';
import {expect} from 'chai';


describe('#Tokenizer.simple', () => {

	describe('tokenize()', () => {

		it('should tokenize element name', () => {
			let tokens = tokenizeFromString('div');

			expect(tokens).to.be.eql([
				{
					type: TokenType.NAME,
					value: 'div',
				},
			]);
		});

		it('should tokenize class', () => {
			let tokens = tokenizeFromString('.alert');

			expect(tokens).to.be.eql([
				{
					type: TokenType.PUNCTUATION,
					value: '.',
				},
				{
					type: TokenType.NAME,
					value: 'alert',
				},
			]);
		});

		it('should tokenize id', () => {
			let tokens = tokenizeFromString('#box');

			expect(tokens).to.be.eql([
				{
					type: TokenType.PUNCTUATION,
					value: '#',
				},
				{
					type: TokenType.NAME,
					value: 'box',
				},
			]);
		});

	});

});
