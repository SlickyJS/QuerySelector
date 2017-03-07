import {Matcher} from '../../src';
import {MockWalker, createDom} from '../mockWalker';
import {expect} from 'chai';


let matcher: Matcher;


describe('#Matcher.pseudoClass', () => {

	beforeEach(() => {
		matcher = new Matcher(new MockWalker);
	});

	describe('querySelector()', () => {

		it('should match empty element', () => {
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

			let match = matcher.querySelector(dom, ':empty');

			expect(match).to.be.equal(dom.childNodes[0].childNodes[0]);
		});

		it('should match first child element', () => {
			let dom = createDom([
				{
					name: 'div',
					childNodes: [
						{
							name: 'span',
						},
					],
				},
				{
					name: 'div',
				}
			]);

			let match = matcher.querySelector(dom, ':first-child');

			expect(match).to.be.equal(dom.childNodes[0]);
		});

		it('should match last child element', () => {
			let dom = createDom([
				{
					name: 'div',
					childNodes: [
						{
							name: 'span',
						},
					],
				},
				{
					name: 'div',
				}
			]);

			let match = matcher.querySelector(dom, ':last-child');

			expect(match).to.be.equal(dom.childNodes[0].childNodes[0]);
		});

		it('should match first of type', () => {
			let dom = createDom([
				{
					name: 'div',
					childNodes: [
						{
							name: 'span',
						},
					],
				},
				{
					name: 'div',
				}
			]);

			let match = matcher.querySelector(dom, ':first-of-type');

			expect(match).to.be.equal(dom.childNodes[0]);
		});

		it('should match last of type', () => {
			let dom = createDom([
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
				{
					name: 'div',
				}
			]);

			let match = matcher.querySelector(dom, ':last-of-type');

			expect(match).to.be.equal(dom.childNodes[0].childNodes[1]);
		});

		it('should match empty last of type', () => {
			let dom = createDom([
				{
					name: 'div',
					childNodes: [
						{
							name: 'span',
						},
						{
							name: 'span',
							childNodes: [
								{
									name: 'i',
								},
							],
						},
					],
				},
				{
					name: 'div',
				}
			]);

			let match = matcher.querySelector(dom, 'span:empty:last-of-type');

			expect(match).to.be.equal(dom.childNodes[0].childNodes[0]);
		});

	});

});
