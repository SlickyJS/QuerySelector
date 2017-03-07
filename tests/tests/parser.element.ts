import {parseFromString, ASTNodeType} from '../../src';
import {expect} from 'chai';


describe('#Parser.element', () => {

	describe('parse()', () => {

		it('should parse element query', () => {
			let ast = parseFromString('div');

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
				],
			});
		});

	});

});
