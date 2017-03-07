import {map, merge, find, filter, exists, startsWith, endsWith, includes} from '@slicky/utils';
import {IDocumentWalker, DocumentParent, DocumentNode} from './documentWalker';
import {Parser} from './parser';
import {Tokenizer} from './tokenizer';
import {InputStream} from './inputStream';
import * as _ from './ast';


export class Matcher
{


	private walker: IDocumentWalker;


	constructor(walker: IDocumentWalker)
	{
		this.walker = walker;
	}


	public querySelector(parent: DocumentParent, selector: string): DocumentNode
	{
		let ast = this.getAST(selector);

		for (let i = 0; i < ast.selectors.length; i++) {
			let found = this.scan(parent, ast.selectors[i], true);

			if (found.length) {
				return found[0];
			}
		}

		return null;
	}


	public querySelectorAll(parent: DocumentParent, selector: string): Array<DocumentNode>
	{
		let ast = this.getAST(selector);
		let found = [];

		for (let i = 0; i < ast.selectors.length; i++) {
			found = merge(found, this.scan(parent, ast.selectors[i]));
		}

		return found;
	}


	public matches(element: DocumentNode, selector: string, parent?: DocumentParent): boolean
	{
		if (!parent) {
			parent = this.getTopParent(element);
		}

		let matches = this.querySelectorAll(parent, selector);

		return matches.indexOf(element) >= 0;		// todo add tests
	}


	private scan(parent: DocumentParent, selector: _.ASTSelector, onlyFirst: boolean = false): Array<DocumentNode>
	{
		return this.scanChildNodes(this.getChildElements(parent), selector.nodes, onlyFirst);
	}


	private scanChildNodes(elements: Array<DocumentNode>, nodes: Array<_.ASTSelectorNode>, onlyFirst: boolean = false, recursively: boolean = true): Array<DocumentNode>
	{
		let found = [];

		for (let i = 0; i < elements.length; i++) {
			found = merge(found, this.scanElement(elements[i], nodes, onlyFirst));

			if (onlyFirst && found.length) {
				break;
			}

			if (!recursively) {
				continue;
			}

			found = merge(found, this.scanChildNodes(this.getChildElements(elements[i]), nodes, onlyFirst));

			if (onlyFirst && found.length) {
				break;
			}
		}

		return found;
	}


	private scanSiblings(element: DocumentNode, nodes: Array<_.ASTSelectorNode>, adjacent: boolean = false, onlyFirst: boolean = false): Array<DocumentNode>
	{
		let childNodes = this.getChildElements(this.walker.getParentNode(element));
		let position = childNodes.indexOf(element);

		if (position === childNodes.length - 1) {
			return [];
		}

		if (adjacent) {
			return this.scanElement(childNodes[position + 1], nodes, onlyFirst);
		}

		for (let i = position + 1; i < childNodes.length; i++) {
			let found = this.scanElement(childNodes[i], nodes, onlyFirst);

			if (found.length) {
				return found;
			}
		}

		return [];
	}


	private scanElement(element: DocumentNode, nodes: Array<_.ASTSelectorNode>, onlyFirst: boolean = false): Array<DocumentNode>
	{
		let node = nodes[0];
		let next = nodes[1];

		if (node.type === _.ASTNodeType.PARTS) {
			if (!this.matchParts(element, node)) {
				return [];
			}

			if (!exists(next)) {
				return [element];
			}
		}

		if (!exists(next)) {
			return [];
		}

		if (next.type === _.ASTNodeType.DESCENDANT) {
			return this.scanChildNodes(this.getChildElements(element), nodes.slice(2), onlyFirst);
		}

		if (next.type === _.ASTNodeType.CHILD) {
			return this.scanChildNodes(this.getChildElements(element), nodes.slice(2), onlyFirst, false);
		}

		if (next.type === _.ASTNodeType.ADJACENT_SIBLING) {
			return this.scanSiblings(element, nodes.slice(2), true, onlyFirst);
		}

		if (next.type === _.ASTNodeType.GENERAL_SIBLING) {
			return this.scanSiblings(element, nodes.slice(2), false, onlyFirst);
		}

		return [];
	}


	private matchParts(element: DocumentNode, parts: _.ASTParts): boolean
	{
		for (let i = 0; i < parts.parts.length; i++) {
			if (this.matchPart(element, parts.parts[i])) {
				return true;
			}
		}

		return false;
	}


	private matchPart(element: DocumentNode, part: _.ASTSimpleSelector): boolean
	{
		switch (part.type) {
			case _.ASTNodeType.ELEMENT: return this.matchElementName(element, part);
			case _.ASTNodeType.ID: return this.matchId(element, part);
			case _.ASTNodeType.CLASS: return this.matchClass(element, part);
			case _.ASTNodeType.ATTRIBUTE: return this.matchAttribute(element, part);
			case _.ASTNodeType.PSEUDO_CLASS: return this.matchPseudoClass(element, part);
		}

		part = <_.ASTSimpleSelector>part;

		throw new Error(`Matcher: can not match by ${_.ASTNodeType[part.type]} ("${part.name}")`);
	}


	private matchElementName(element: DocumentNode, name: _.ASTElement): boolean
	{
		return name.name === this.walker.getNodeName(element);
	}


	private matchId(element: DocumentNode, id: _.ASTId): boolean
	{
		return id.name === this.walker.getAttribute(element, 'id');
	}


	private matchClass(element: DocumentNode, className: _.ASTClass): boolean
	{
		return this.isInList(this.walker.getAttribute(element, 'class') || '', className.name);
	}


	private matchAttribute(element: DocumentNode, attr: _.ASTAttribute): boolean
	{
		let value = this.walker.getAttribute(element, attr.name);

		if (attr.operator === null && attr.value === null) {
			return value != null;
		}

		switch (attr.operator) {
			case '=': return this.isEqual(value, attr.value, attr.caseSensitive);
			case '~=': return this.isInList(value, attr.value, attr.caseSensitive);
			case '*=': return this.includes(value, attr.value, attr.caseSensitive);
			case '|=': return this.isEqual(value, attr.value, attr.caseSensitive) || this.startsWith(value, attr.value + '-', attr.caseSensitive);
			case '^=': return this.isEqual(value, attr.value, attr.caseSensitive) || this.startsWith(value, attr.value, attr.caseSensitive);
			case '$=': return this.isEqual(value, attr.value, attr.caseSensitive) || this.endsWith(value, attr.value, attr.caseSensitive);
		}

		throw new Error(`Matcher: can not match by attribute [${attr.name + attr.operator}"${attr.value}"]`);
	}


	private matchPseudoClass(element: DocumentNode, pseudoClass: _.ASTPseudoClass): boolean
	{
		switch (pseudoClass.name) {
			case 'empty': return this.isElementEmpty(element);
			case 'first-child': return this.isElementFirstChild(element);
			case 'last-child': return this.isElementLastChild(element);
			case 'first-of-type': return this.isElementFirstOfType(element);
			case 'last-of-type': return this.isElementLastOfType(element);
		}

		throw new Error(`Matcher: can not match by pseudo class :${pseudoClass.name}`);
	}


	private isInList(str: string, search: string, caseSensitive: boolean = true): boolean
	{
		let list = str.split(' ');

		if (!caseSensitive) {
			list = map(list, (item: string) => item.toLowerCase());
		}

		return caseSensitive ? list.indexOf(search) >= 0 : list.indexOf(search.toLowerCase()) >= 0;
	}


	private isEqual(str: string, search: string, caseSensitive: boolean = true): boolean
	{
		return caseSensitive ? str === search : str.toLowerCase() === search.toLowerCase();
	}


	private startsWith(str: string, search: string, caseSensitive: boolean = true): boolean
	{
		if (!caseSensitive) {
			str = str.toLowerCase();
			search = search.toLowerCase();
		}

		return startsWith(str, search);
	}


	private endsWith(str: string, search: string, caseSensitive: boolean = true): boolean
	{
		if (!caseSensitive) {
			str = str.toLowerCase();
			search = search.toLowerCase();
		}

		return endsWith(str, search);
	}


	private includes(str: string, search: string, caseSensitive: boolean = true): boolean
	{
		if (!caseSensitive) {
			str = str.toLowerCase();
			search = search.toLowerCase();
		}

		return includes(str, search);
	}


	private isElementEmpty(element: DocumentNode): boolean
	{
		let childNodes = this.walker.getChildNodes(element);

		for (let i = 0; childNodes.length; i++) {
			if (this.walker.isString(childNodes[i]) || this.walker.isElement(childNodes[i])) {
				return false;
			}
		}

		return true;
	}


	private isElementFirstChild(element: DocumentNode): boolean
	{
		return this.getChildElements(this.walker.getParentNode(element)).indexOf(element) === 0;
	}


	private isElementLastChild(element: DocumentNode): boolean
	{
		let childNodes = this.getChildElements(this.walker.getParentNode(element));
		return childNodes.indexOf(element) === (childNodes.length - 1);
	}


	private isElementFirstOfType(element: DocumentNode): boolean
	{
		let childNodes = this.getChildElements(this.walker.getParentNode(element));
		let type = this.walker.getNodeName(element);

		let first = find(childNodes, (node) => {
			return this.walker.getNodeName(node) === type;
		});

		return first === element;
	}


	private isElementLastOfType(element: DocumentNode): boolean
	{
		let childNodes = this.getChildElements(this.walker.getParentNode(element));
		let type = this.walker.getNodeName(element);

		let others = filter(childNodes, (node) => {
			return this.walker.getNodeName(node) === type;
		});

		return others[others.length - 1] === element;
	}


	private getChildElements(parent: DocumentParent): Array<DocumentNode>
	{
		return filter(this.walker.getChildNodes(parent), (node) => {
			return this.walker.isElement(node);
		});
	}


	private getTopParent(element: DocumentNode): DocumentParent
	{
		let parent: DocumentParent;

		while (parent = this.walker.getParentNode(element)) {
			element = parent;
		}

		return element;
	}


	private getAST(selector: string): _.ASTQuery
	{
		return (new Parser(new Tokenizer(new InputStream(selector)))).parse();
	}

}
