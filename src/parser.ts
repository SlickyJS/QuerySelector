import {Tokenizer, TokenType} from './tokenizer';
import {SELECTOR_SEPARATOR} from './data';
import * as _ from './ast';


export class Parser
{


	private input: Tokenizer;


	constructor(input: Tokenizer)
	{
		this.input = input;
	}


	public parse(): _.ASTQuery
	{
		let selectors = [];

		while (!this.input.eof()) {
			selectors.push(this.matchSelector());

			if (!this.input.eof()) {
				this.input.readWhile(() => this.input.isWhitespace());
				this.input.matchPunctuation(SELECTOR_SEPARATOR);
				this.input.readWhile(() => this.input.isWhitespace());
			}
		}

		return {
			type: _.ASTNodeType.QUERY,
			selectors: selectors,
		};
	}


	private matchSelector(): _.ASTSelector
	{
		let nodes = [];

		while (!this.input.eof()) {
			let descendant: _.ASTDescendant = null;

			nodes.push(this.matchParts());

			if (this.input.isWhitespace()) {
				descendant = this.matchDescendant();
			}

			if (this.input.isPunctuation(SELECTOR_SEPARATOR)) {
				break;
			}

			if (this.input.isOperator('>')) {
				nodes.push(this.matchChild());

			} else if (this.input.isOperator('+')) {
				nodes.push(this.matchAdjacentSibling());

			} else if (this.input.isOperator('~')) {
				nodes.push(this.matchGeneralSibling());

			} else if (descendant) {
				nodes.push(descendant);
			}

			if (this.input.isWhitespace()) {
				this.input.next();
			}
		}

		return {
			type: _.ASTNodeType.SELECTOR,
			nodes: nodes,
		};
	}


	private matchParts(): _.ASTParts
	{
		let parts = [];

		while (!this.input.eof()) {
			parts.push(this.matchPart());

			if (this.input.isWhitespace() || this.input.isPunctuation(SELECTOR_SEPARATOR) || this.input.isOperator('>') || this.input.isOperator('+') || this.input.isOperator('~')) {
				break;
			}
		}

		return {
			type: _.ASTNodeType.PARTS,
			parts: parts,
		};
	}


	private matchPart(): _.ASTSimpleSelector
	{
		if (this.input.isName()) {
			return this.matchElement();
		}

		if (this.input.isPunctuation('#')) {
			return this.matchId();
		}

		if (this.input.isPunctuation('.')) {
			return this.matchClass();
		}

		if (this.input.isPunctuation('[')) {
			return this.matchAttribute();
		}

		if (this.input.isPunctuation(':')) {
			return this.matchPseudoClass();
		}
	}


	protected matchElement(): _.ASTElement
	{
		return {
			type: _.ASTNodeType.ELEMENT,
			name: this.input.matchName(),
		};
	}


	protected matchId(): _.ASTId
	{
		this.input.matchPunctuation('#');

		return {
			type: _.ASTNodeType.ID,
			name: this.input.matchName(),
		};
	}


	protected matchClass(): _.ASTClass
	{
		this.input.matchPunctuation('.');

		return {
			type: _.ASTNodeType.CLASS,
			name: this.input.matchName(),
		};
	}


	protected matchPseudoClass(): _.ASTPseudoClass
	{
		this.input.matchPunctuation(':');

		return {
			type: _.ASTNodeType.PSEUDO_CLASS,
			name: this.input.matchName(),
		};
	}


	protected matchAttribute(): _.ASTAttribute
	{
		this.input.matchPunctuation('[');

		let caseSensitive = true;
		let name = this.input.matchName();
		let operator = null;
		let value = null;

		if (this.input.isPunctuation(':')) {
			name += this.input.matchPunctuation(':');
			name += this.input.matchName();
		}

		if (this.input.isOperator()) {
			operator = this.input.matchOperator();
			value = this.input.matchString();
		}

		if (this.input.isWhitespace()) {
			this.input.matchWhitespace();

			let current = this.input.matchName();

			if (current !== 'i' && current !== 'I') {
				this.input.error(`Unexpected "${current}"`);
			}

			caseSensitive = false;
		}

		this.input.matchPunctuation(']');

		return {
			type: _.ASTNodeType.ATTRIBUTE,
			caseSensitive: caseSensitive,
			name: name,
			operator: operator,
			value: value,
		};
	}


	private matchChild(): _.ASTChild
	{
		this.input.matchOperator('>');

		return {
			type: _.ASTNodeType.CHILD,
		};
	}


	private matchDescendant(): _.ASTDescendant
	{
		this.input.matchWhitespace();

		return {
			type: _.ASTNodeType.DESCENDANT,
		};
	}


	private matchAdjacentSibling(): _.ASTAdjacentSibling
	{
		this.input.matchOperator('+');

		return {
			type: _.ASTNodeType.ADJACENT_SIBLING,
		};
	}


	private matchGeneralSibling(): _.ASTGeneralSibling
	{
		this.input.matchOperator('~');

		return {
			type: _.ASTNodeType.GENERAL_SIBLING,
		};
	}

}
