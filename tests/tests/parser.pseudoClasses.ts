import {parseFromString, ASTNodeType} from '../../src';
import {expect} from 'chai';


describe('#Parser.pseudoClasses', () => {

	describe('parse()', () => {

		it('should parse element query', () => {
			let ast = parseFromString(':first-child:active');

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
										type: ASTNodeType.PSEUDO_CLASS,
										name: 'first-child',
									},
									{
										type: ASTNodeType.PSEUDO_CLASS,
										name: 'active',
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
