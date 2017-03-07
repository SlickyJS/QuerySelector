import {Matcher} from '../../src';
import {MockWalker, createDom} from '../mockWalker';
import {expect} from 'chai';


let matcher: Matcher;


describe('#Matcher.simple', () => {

	beforeEach(() => {
		matcher = new Matcher(new MockWalker);
	});

	describe('querySelector()', () => {

		it('should match by element name', () => {
			let dom = createDom([
				{name: 'div'},
				{name: 'div'},
			]);

			let match = matcher.querySelector(dom, 'div');

			expect(match).to.be.equal(dom.childNodes[0]);
		});

		it('should match by id', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						id: 'sidebar',
					},
				},
				{
					name: 'div',
					attributes: {
						id: 'header',
					},
				},
				{
					name: 'div',
					attributes: {
						id: 'content',
					},
				},
			]);

			let match = matcher.querySelector(dom, '#header');

			expect(match).to.be.equal(dom.childNodes[1]);
		});

		it('should match by class', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						'class': 'alert alert-danger',
					},
				},
				{
					name: 'div',
					attributes: {
						'class': 'btn btn-md btn-success',
					},
				},
				{
					name: 'div',
					attributes: {
						'class': 'panel panel-info',
					},
				},
			]);

			let match = matcher.querySelector(dom, '.btn-md');

			expect(match).to.be.equal(dom.childNodes[1]);
		});

	});

});
