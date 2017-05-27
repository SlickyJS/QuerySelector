import * as _ from '@slicky/ast-query-selector';
import {exists, filter, find, merge, map, startsWith, endsWith, includes} from '@slicky/utils';
import {IDocumentWalker, DocumentParent, DocumentNode} from './documentWalker';


export class Matcher
{


	private walker: IDocumentWalker;


	constructor(documentWalker: IDocumentWalker)
	{
		this.walker = documentWalker;
	}


	public querySelector(parent: DocumentParent, selector: string): DocumentNode
	{
		let ast = _.Parser.createFromString(selector).parse();

		for (let i = 0; i < ast.selectors.length; i++) {
			let found = this.scan(parent, ast.selectors[i], true);

			if (found.length) {
				return found[0];
			}
		}

		return undefined;
	}


	public querySelectorAll(parent: DocumentParent, selector: string): Array<DocumentNode>
	{
		let ast = _.Parser.createFromString(selector).parse();
		let found = [];

		for (let i = 0; i < ast.selectors.length; i++) {
			found = merge(found, this.scan(parent, ast.selectors[i]));
		}

		return found;
	}


	public matches(element: DocumentNode, selector: string, parent?: DocumentParent): boolean
	{
		if (!parent) {
			parent = getTopParent(this.walker, element);
		}

		let matches = this.querySelectorAll(parent, selector);

		return matches.indexOf(element) >= 0;
	}


	private scan(parent: DocumentParent, selector: _.ASTSelector, onlyFirst: boolean = false): Array<DocumentNode>
	{
		return this.scanChildNodes(getChildElements(this.walker, parent), selector.parts, onlyFirst);
	}


	private scanChildNodes(elements: Array<DocumentNode>, selector: _.ASTSelectorPart, onlyFirst: boolean = false, recursively: boolean = true): Array<DocumentNode>
	{
		let found = [];

		for (let i = 0; i < elements.length; i++) {
			found = merge(found, this.scanElement(elements[i], selector, onlyFirst));

			if (onlyFirst && found.length) {
				break;
			}

			if (!recursively) {
				continue;
			}

			found = merge(found, this.scanChildNodes(getChildElements(this.walker, elements[i]), selector, onlyFirst));

			if (onlyFirst && found.length) {
				break;
			}
		}

		return found;
	}


	private scanSiblings(element: DocumentNode, selector: _.ASTSelectorPart, adjacent: boolean = false, onlyFirst: boolean = false): Array<DocumentNode>
	{
		let childNodes = getChildElements(this.walker, this.walker.getParentNode(element));
		let position = childNodes.indexOf(element);

		if (position === childNodes.length - 1) {
			return [];
		}

		if (adjacent) {
			return this.scanElement(childNodes[position + 1], selector, onlyFirst);
		}

		for (let i = position + 1; i < childNodes.length; i++) {
			let found = this.scanElement(childNodes[i], selector, onlyFirst);

			if (found.length) {
				return found;
			}
		}

		return [];
	}


	private scanElement(element: DocumentNode, selector: _.ASTSelectorPart, onlyFirst: boolean = false): Array<DocumentNode>
	{
		if (selector instanceof _.ASTRulesSet) {
			if (this.matchRules(element, selector)) {
				return [element];
			}

			return [];

		} else if (selector instanceof _.ASTCombinator) {
			return this.scanCombinator(element, selector, onlyFirst);

		}

		return [];
	}


	private scanCombinator(element: DocumentNode, combinator: _.ASTCombinator, onlyFirst: boolean = false): Array<DocumentNode>
	{
		if (!this.matchRules(element, combinator.left)) {
			return [];
		}

		if (combinator instanceof _.ASTDescendant) {
			return this.scanChildNodes(getChildElements(this.walker, element), combinator.right, onlyFirst);
		}

		if (combinator instanceof _.ASTChild) {
			return this.scanChildNodes(getChildElements(this.walker, element), combinator.right, onlyFirst, false);
		}

		if (combinator instanceof _.ASTAdjacentSibling) {
			return this.scanSiblings(element, combinator.right, true, onlyFirst);
		}

		if (combinator instanceof _.ASTGeneralSibling) {
			return this.scanSiblings(element, combinator.right, false, onlyFirst);
		}

		return [];
	}


	private matchRules(element: DocumentNode, rules: _.ASTRulesSet): boolean
	{
		for (let i = 0; i < rules.parts.length; i++) {
			if (!this.matchRule(element, rules.parts[i])) {
				return false;
			}
		}

		return true;
	}


	private matchRule(element: DocumentNode, rule: _.ASTRule): boolean
	{
		if (rule instanceof _.ASTElement) {
			return this.walker.getNodeName(element) === rule.name;
		}

		if (rule instanceof _.ASTId) {
			return this.walker.getAttribute(element, 'id') === rule.name;
		}

		if (rule instanceof _.ASTClass) {
			return isInList(this.walker.getAttribute(element, 'class') || '', rule.name);
		}

		if (rule instanceof _.ASTPseudoClass) {
			switch (rule.name) {
				case 'empty': return isElementEmpty(this.walker, element);
				case 'first-child': return isElementFirstChild(this.walker, element);
				case 'last-child': return isElementLastChild(this.walker, element);
				case 'first-of-type': return isElementFirstOfType(this.walker, element);
				case 'last-of-type': return isElementLastOfType(this.walker, element);
			}

			throw new Error(`Matcher: can not match by pseudo class :${rule.name}`);
		}

		if (rule instanceof _.ASTAttribute) {
			let value = this.walker.getAttribute(element, rule.name);

			if (!exists(rule.operator) && !exists(rule.value)) {
				return value != null;
			}

			switch (rule.operator) {
				case '=': return isEqual(value, rule.value, rule.caseSensitive);
				case '~=': return isInList(value, rule.value, rule.caseSensitive);
				case '*=': return includes(value, rule.value, rule.caseSensitive);
				case '|=': return isEqual(value, rule.value, rule.caseSensitive) || startsWith(value, rule.value + '-', rule.caseSensitive);
				case '^=': return isEqual(value, rule.value, rule.caseSensitive) || startsWith(value, rule.value, rule.caseSensitive);
				case '$=': return isEqual(value, rule.value, rule.caseSensitive) || endsWith(value, rule.value, rule.caseSensitive);
			}

			throw new Error(`Matcher: can not match by attribute [${rule.name + rule.operator}"${rule.value}"]`);
		}

		return false;
	}

}


function isInList(str: string, search: string, caseSensitive: boolean = true): boolean
{
	let list = str.split(' ');

	if (!caseSensitive) {
		list = map(list, (item: string) => item.toLowerCase());
	}

	return caseSensitive ? list.indexOf(search) >= 0 : list.indexOf(search.toLowerCase()) >= 0;
}


function isEqual(str: string, search: string, caseSensitive: boolean = true): boolean
{
	return caseSensitive ? str === search : str.toLowerCase() === search.toLowerCase();
}


function getTopParent(walker: IDocumentWalker, element: DocumentNode): DocumentParent
{
	let parent: DocumentParent;

	while (parent = walker.getParentNode(element)) {
		element = parent;
	}

	return element;
}


function getChildElements(walker: IDocumentWalker, parent: DocumentParent): Array<DocumentNode>
{
	return filter(walker.getChildNodes(parent), (node) => {
		return walker.isElement(node);
	});
}


function isElementEmpty(walker: IDocumentWalker, element: DocumentNode): boolean
{
	let childNodes = walker.getChildNodes(element);

	for (let i = 0; childNodes.length; i++) {
		if (walker.isString(childNodes[i]) || walker.isElement(childNodes[i])) {
			return false;
		}
	}

	return true;
}


function isElementFirstChild(walker: IDocumentWalker, element: DocumentNode): boolean
{
	return getChildElements(walker, walker.getParentNode(element)).indexOf(element) === 0;
}


function isElementLastChild(walker: IDocumentWalker, element: DocumentNode): boolean
{
	let childNodes = getChildElements(walker, walker.getParentNode(element));
	return childNodes.indexOf(element) === (childNodes.length - 1);
}


function isElementFirstOfType(walker: IDocumentWalker, element: DocumentNode): boolean
{
	let childNodes = getChildElements(walker, walker.getParentNode(element));
	let type = walker.getNodeName(element);

	let first = find(childNodes, (node) => {
		return walker.getNodeName(node) === type;
	});

	return first === element;
}


function isElementLastOfType(walker: IDocumentWalker, element: DocumentNode): boolean
{
	let childNodes = getChildElements(walker, walker.getParentNode(element));
	let type = walker.getNodeName(element);

	let others = filter(childNodes, (node) => {
		return walker.getNodeName(node) === type;
	});

	return others[others.length - 1] === element;
}
