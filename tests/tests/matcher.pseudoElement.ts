import {Matcher} from '../../src';
import {MockWalker, createDom} from '../mockWalker';
import {expect} from 'chai';


let matcher: Matcher;


describe('#Matcher.pseudoClass', () => {

	beforeEach(() => {
		matcher = new Matcher(new MockWalker);
	});

	describe('querySelector()', () => {

		it('should match element with pseudo element', () => {
			let dom = createDom([
				{
					name: 'div',
					childNodes: [
						{
							name: 'span',
						},
					],
				},
			]);

			let match = matcher.querySelector(dom, 'span::after');

			expect(match).to.be.equal(dom.childNodes[0].childNodes[0]);
		});

	});

});
