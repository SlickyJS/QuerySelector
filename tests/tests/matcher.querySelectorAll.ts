import {Matcher} from '../../src';
import {MockWalker, createDom} from '../mockWalker';
import {expect} from 'chai';


let matcher: Matcher;


describe('#Matcher.querySelectorAll', () => {

	beforeEach(() => {
		matcher = new Matcher(new MockWalker);
	});

	describe('querySelectorAll()', () => {

		it('should match all spans', () => {
			let dom = createDom([
				{
					name: 'div',
					childNodes: [
						{
							name: 'div',
							childNodes: [
								{
									name: 'div',
								},
							],
						},
						{
							name: 'span',
						}
					],
				},
				{
					name: 'div',
					childNodes: [
						{
							name: 'div',
							childNodes: [
								{
									name: 'div',
									childNodes: [
										{
											name: 'span',
										},
										{
											name: 'span',
										},
									],
								},
							],
						},
					],
				},
				{
					name: 'span',
				},
			]);

			let match = matcher.querySelectorAll(dom, 'span');

			expect(match).to.have.length(4);
			expect(match[0]).to.be.equal(dom.childNodes[0].childNodes[1]);
			expect(match[1]).to.be.equal(dom.childNodes[1].childNodes[0].childNodes[0].childNodes[0]);
			expect(match[2]).to.be.equal(dom.childNodes[1].childNodes[0].childNodes[0].childNodes[1]);
			expect(match[3]).to.be.equal(dom.childNodes[2]);
		});

	});

});
