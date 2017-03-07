import {parseFromString, ASTNodeType} from '../../src';
import {expect} from 'chai';


describe('#Parser', () => {

	describe('parse()', () => {

		it('should parse query', () => {
			let ast = parseFromString('div:first-child, span[title], table td > a.btn.btn-success');

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
										type: ASTNodeType.ELEMENT,
										name: 'div',
									},
									{
										type: ASTNodeType.PSEUDO_CLASS,
										name: 'first-child',
									},
								],
							},
						],
					},
					{
						type: ASTNodeType.SELECTOR,
						nodes: [
							{
								type: ASTNodeType.PARTS,
								parts: [
									{
										type: ASTNodeType.ELEMENT,
										name: 'span',
									},
									{
										type: ASTNodeType.ATTRIBUTE,
										caseSensitive: true,
										name: 'title',
										operator: null,
										value: null,
									},
								],
							},
						],
					},
					{
						type: ASTNodeType.SELECTOR,
						nodes: [
							{
								type: ASTNodeType.PARTS,
								parts: [
									{
										type: ASTNodeType.ELEMENT,
										name: 'table',
									},
								],
							},
							{
								type: ASTNodeType.DESCENDANT,
							},
							{
								type: ASTNodeType.PARTS,
								parts: [
									{
										type: ASTNodeType.ELEMENT,
										name: 'td',
									},
								],
							},
							{
								type: ASTNodeType.CHILD,
							},
							{
								type: ASTNodeType.PARTS,
								parts: [
									{
										type: ASTNodeType.ELEMENT,
										name: 'a',
									},
									{
										type: ASTNodeType.CLASS,
										name: 'btn',
									},
									{
										type: ASTNodeType.CLASS,
										name: 'btn-success',
									},
								],
							},
						],
					},
				],
			});
		});

		it('should parse query with space before comma', () => {
			let ast = parseFromString('div , span');

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
										type: ASTNodeType.ELEMENT,
										name: 'div',
									},
								],
							},
						],
					},
					{
						type: ASTNodeType.SELECTOR,
						nodes: [
							{
								type: ASTNodeType.PARTS,
								parts: [
									{
										type: ASTNodeType.ELEMENT,
										name: 'span',
									},
								],
							},
						],
					},
				],
			});
		});

		it('should match selector with adjacent sibling', () => {
			let ast = parseFromString('span + i');

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
										type: ASTNodeType.ELEMENT,
										name: 'span',
									},
								],
							},
							{
								type: ASTNodeType.ADJACENT_SIBLING,
							},
							{
								type: ASTNodeType.PARTS,
								parts: [
									{
										type: ASTNodeType.ELEMENT,
										name: 'i',
									},
								],
							},
						],
					},
				],
			});
		});

		it('should match selector with general sibling', () => {
			let ast = parseFromString('span ~ i');

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
										type: ASTNodeType.ELEMENT,
										name: 'span',
									},
								],
							},
							{
								type: ASTNodeType.GENERAL_SIBLING,
							},
							{
								type: ASTNodeType.PARTS,
								parts: [
									{
										type: ASTNodeType.ELEMENT,
										name: 'i',
									},
								],
							},
						],
					},
				],
			});
		});

	});

});
