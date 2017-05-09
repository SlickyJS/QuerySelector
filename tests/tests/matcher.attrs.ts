import {Matcher} from '../../src';
import {MockWalker, createDom} from '../mockWalker';
import {expect} from 'chai';


let matcher: Matcher;


describe('#Matcher.attrs', () => {

	beforeEach(() => {
		matcher = new Matcher(new MockWalker);
	});

	describe('querySelector()', () => {

		it('should match by existence of attribute', () => {
			let dom = createDom([
				{name: 'div'},
				{
					name: 'div',
					attributes: {
						title: 'lorem ipsum',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[title]');

			expect(match).to.be.equal(dom.childNodes[1]);
		});

		it('should match by existence of namespaces attribute', () => {
			let dom = createDom([
				{name: 'div'},
				{
					name: 'div',
					attributes: {
						's:title': 'lorem ipsum',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[s:title]');

			expect(match).to.be.equal(dom.childNodes[1]);
		});

		it('should match exact value of attribute case sensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						title: 'Hello World',
					},
				},
				{
					name: 'div',
					attributes: {
						title: 'hello world',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[title="hello world"]');

			expect(match).to.be.equal(dom.childNodes[1]);
		});

		it('should match exact value of attribute case insensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						title: 'Hello World',
					},
				},
				{
					name: 'div',
					attributes: {
						title: 'hello world',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[title="hello world" i]');

			expect(match).to.be.equal(dom.childNodes[0]);
		});

		it('should match value in list case sensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						'class': 'Btn Btn-Success',
					},
				},
				{
					name: 'div',
					attributes: {
						'class': 'btn btn-success',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[class~="btn-success"]');

			expect(match).to.be.equal(dom.childNodes[1]);
		});

		it('should match value in list case insensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						'class': 'Btn Btn-Success',
					},
				},
				{
					name: 'div',
					attributes: {
						'class': 'btn btn-success',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[class~="btn-success" i]');

			expect(match).to.be.equal(dom.childNodes[0]);
		});

		it('should match value with "|=" case sensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						lang: 'CS',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cs',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[lang|="cs"]');

			expect(match).to.be.equal(dom.childNodes[1]);
		});

		it('should match value with "|=" case insensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						lang: 'CS',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cs',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[lang|="cs" i]');

			expect(match).to.be.equal(dom.childNodes[0]);
		});

		it('should match by value starting with string by "|=" case sensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						lang: 'CS-CZ',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cscz',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cs-cz',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[lang|="cs"]');

			expect(match).to.be.equal(dom.childNodes[2]);
		});

		it('should match by value starting with string by "|=" case insensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						lang: 'CS-CZ',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cscz',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cs-cz',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[lang|="cs" i]');

			expect(match).to.be.equal(dom.childNodes[0]);
		});

		it('should match value with "^=" case sensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						lang: 'CS',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cs',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[lang^="cs"]');

			expect(match).to.be.equal(dom.childNodes[1]);
		});

		it('should match value with "^=" case insensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						lang: 'CS',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cs',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[lang^="cs" i]');

			expect(match).to.be.equal(dom.childNodes[0]);
		});

		it('should match by value starting with string by "^=" case sensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						lang: 'CS-CZ',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cscz',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cs-cz',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[lang^="cs"]');

			expect(match).to.be.equal(dom.childNodes[1]);
		});

		it('should match by value starting with string by "^=" case insensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						lang: 'CS-CZ',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cscz',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cs-cz',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[lang^="cs" i]');

			expect(match).to.be.equal(dom.childNodes[0]);
		});

		it('should match value with "$=" case sensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						lang: 'CS',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cs',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[lang$="cs"]');

			expect(match).to.be.equal(dom.childNodes[1]);
		});

		it('should match value with "$=" case insensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						lang: 'CS',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cs',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[lang$="cs" i]');

			expect(match).to.be.equal(dom.childNodes[0]);
		});

		it('should match by value starting with string by "$=" case sensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						lang: 'CS-CZ',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cscz',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cs-cz',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[lang$="cz"]');

			expect(match).to.be.equal(dom.childNodes[1]);
		});

		it('should match by value starting with string by "$=" case insensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						lang: 'CS-CZ',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cscz',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cs-cz',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[lang$="cz" i]');

			expect(match).to.be.equal(dom.childNodes[0]);
		});

		it('should match value containing string case sensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						lang: 'CS-CZ',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cs-cz',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[lang*="cs"]');

			expect(match).to.be.equal(dom.childNodes[1]);
		});

		it('should match value containing string case insensitively', () => {
			let dom = createDom([
				{
					name: 'div',
					attributes: {
						lang: 'CS-CZ',
					},
				},
				{
					name: 'div',
					attributes: {
						lang: 'cs-cz',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[lang*="cs" i]');

			expect(match).to.be.equal(dom.childNodes[0]);
		});

		it('should match by multiple attributes', () => {
			let dom = createDom([
				{
					name: 'template',
					attributes: {
						's:for': '',
						's:for-of': 'items',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[s:for][s:for-of]');

			expect(match).to.be.equal(dom.childNodes[0]);
		});

		it('should not match by multiple attributes', () => {
			let dom = createDom([
				{
					name: 'template',
					attributes: {
						's:if': 'false',
					},
				},
			]);

			let match = matcher.querySelector(dom, '[s:for][s:for-of]');

			expect(match).to.be.equal(null);
		});

		it('should match by multiple attributes with element name', () => {
			let dom = createDom([
				{
					name: 'template',
					attributes: {
						's:for': '',
						's:for-of': 'items',
					},
				},
			]);

			let match = matcher.querySelector(dom, 'template[s:for][s:for-of]');

			expect(match).to.be.equal(dom.childNodes[0]);
		});

		it('should not match by multiple attributes with element name', () => {
			let dom = createDom([
				{
					name: 'template',
					attributes: {
						's:if': 'false',
					},
				},
			]);

			let match = matcher.querySelector(dom, 'template[s:for][s:for-of]');

			expect(match).to.be.equal(null);
		});

	});

});
