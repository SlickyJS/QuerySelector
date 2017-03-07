import {Matcher} from '../../src';
import {MockWalker, createDom} from '../mockWalker';
import {expect} from 'chai';


let matcher: Matcher;


describe('#Matcher', () => {

	beforeEach(() => {
		matcher = new Matcher(new MockWalker);
	});

	describe('querySelector()', () => {

		it('should match in indirect node', () => {
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
									],
								},
							],
						},
					],
				},
			]);

			let match = matcher.querySelector(dom, 'span');

			expect(match).to.be.equal(dom.childNodes[1].childNodes[0].childNodes[0].childNodes[0]);
		});

		it('should match descendant', () => {
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
									],
								},
							],
						},
					],
				},
			]);

			let match = matcher.querySelector(dom, 'div span');

			expect(match).to.be.equal(dom.childNodes[1].childNodes[0].childNodes[0].childNodes[0]);
		});

		it('should match child', () => {
			let dom = createDom([
				{
					name: 'div',
					childNodes: [
						{
							name: 'div',
							childNodes: [
								{
									name: 'p',
									childNodes: [
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
									],
								},
							],
						},
					],
				},
			]);

			let match = matcher.querySelector(dom, 'div > span');

			expect(match).to.be.equal(dom.childNodes[1].childNodes[0].childNodes[0].childNodes[0]);
		});

		it('should match next adjacent sibling', () => {
			let dom = createDom([
				{
					name: 'ul',
					childNodes: [
						{
							name: 'li',
						},
						{
							name: 'li',
						},
						{
							name: 'li',
						},
					],
				},
			]);

			let match = matcher.querySelector(dom, 'li:first-of-type + li');

			expect(match).to.be.equal(dom.childNodes[0].childNodes[1]);
		});

		it('should match next general sibling', () => {
			let dom = createDom([
				{
					name: 'span',
				},
				{
					name: 'p',
				},
				{
					name: 'code',
				},
				{
					name: 'span',
				},
			]);

			let match = matcher.querySelector(dom, 'p ~ span');

			expect(match).to.be.equal(dom.childNodes[3]);
		});

	});

	describe('matches()', () => {

		it('should return false', () => {
			let dom = createDom([
				{
					name: 'div',
					childNodes: [
						{
							name: 'p',
							childNodes: [
								{
									name: 'span',
								},
							],
						},
					],
				},
			]);

			let matches = matcher.matches(dom.childNodes[0].childNodes[0].childNodes[0], 'div > span');

			expect(matches).to.be.equal(false);
		});

		it('should return true', () => {
			let dom = createDom([
				{
					name: 'div',
					childNodes: [
						{
							name: 'p',
							childNodes: [
								{
									name: 'span',
								},
							],
						},
					],
				},
			]);

			let matches = matcher.matches(dom.childNodes[0].childNodes[0].childNodes[0], 'div p > span');

			expect(matches).to.be.equal(true);
		});

		it('should return false when query is outside of boundary', () => {
			let dom = createDom([
				{
					name: 'div',
					childNodes: [
						{
							name: 'p',
							childNodes: [
								{
									name: 'span',
								},
							],
						},
					],
				},
			]);

			let matches = matcher.matches(dom.childNodes[0].childNodes[0].childNodes[0], 'div p > span', dom.childNodes[0].childNodes[0]);

			expect(matches).to.be.equal(false);
		});

	});

});
