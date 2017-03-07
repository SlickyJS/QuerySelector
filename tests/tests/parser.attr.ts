import {parseFromString, ASTNodeType} from '../../src';
import {expect} from 'chai';


describe('#Parser.attr', () => {

	describe('parse()', () => {

		it('should parse attribute query', () => {
			let ast = parseFromString('[title]');

			expect(ast).to.be.eql({
				type: ASTNodeType.QUERY,
				selectors: [
					{
						type: ASTNodeType.SELECTOR,
						nodes: [
							{
								type: ASTNodeType.PARTS,
								parts: [
									{
										type: ASTNodeType.ATTRIBUTE,
										caseSensitive: true,
										name: 'title',
										operator: null,
										value: null,
									}
								],
							},
						],
					},
				],
			});
		});

		it('should parse attribute query with value', () => {
			let ast = parseFromString('[title~="hello"]');

			expect(ast).to.be.eql({
				type: ASTNodeType.QUERY,
				selectors: [
					{
						type: ASTNodeType.SELECTOR,
						nodes: [
							{
								type: ASTNodeType.PARTS,
								parts: [
									{
										type: ASTNodeType.ATTRIBUTE,
										caseSensitive: true,
										name: 'title',
										operator: '~=',
										value: 'hello',
									}
								],
							},
						],
					},
				],
			});
		});

		it('should parse case insensitive attribute query', () => {
			let ast = parseFromString('[title~="hello" i]');

			expect(ast).to.be.eql({
				type: ASTNodeType.QUERY,
				selectors: [
					{
						type: ASTNodeType.SELECTOR,
						nodes: [
							{
								type: ASTNodeType.PARTS,
								parts: [
									{
										type: ASTNodeType.ATTRIBUTE,
										caseSensitive: false,
										name: 'title',
										operator: '~=',
										value: 'hello',
									}
								],
							},
						],
					},
				],
			});
		});

	});

});
