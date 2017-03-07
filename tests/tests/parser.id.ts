import {parseFromString, ASTNodeType} from '../../src';
import {expect} from 'chai';


describe('#Parser.id', () => {

	describe('parse()', () => {

		it('should parse id query', () => {
			let ast = parseFromString('#header');

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
										type: ASTNodeType.ID,
										name: 'header',
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
