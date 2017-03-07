import {parseFromString, ASTNodeType} from '../../src';
import {expect} from 'chai';


describe('#Parser.class', () => {

	describe('parse()', () => {

		it('should parse class query', () => {
			let ast = parseFromString('.btn');

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
										type: ASTNodeType.CLASS,
										name: 'btn',
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
