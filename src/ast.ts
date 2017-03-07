export enum ASTNodeType
{
	QUERY,
	SELECTOR,
	PARTS,
	ELEMENT,
	CLASS,
	ID,
	PSEUDO_CLASS,
	ATTRIBUTE,
	DESCENDANT,
	CHILD,
	ADJACENT_SIBLING,
	GENERAL_SIBLING,
}


export type ASTSimpleSelector = ASTElement|ASTId|ASTClass|ASTPseudoClass|ASTAttribute;
export type ASTSelectorNode = ASTParts|ASTDescendant|ASTChild|ASTAdjacentSibling|ASTGeneralSibling;


export declare interface ASTNode
{
	type: ASTNodeType,
}


export declare interface ASTQuery extends ASTNode
{
	type: ASTNodeType.QUERY,
	selectors: Array<ASTSelector>,
}


export declare interface ASTSelector extends ASTNode
{
	type: ASTNodeType.SELECTOR,
	nodes: Array<ASTSelectorNode>,
}


export declare interface ASTParts extends ASTNode
{
	type: ASTNodeType.PARTS,
	parts: Array<ASTSimpleSelector>,
}


export declare interface ASTElement extends ASTNode
{
	type: ASTNodeType.ELEMENT,
	name: string,
}


export declare interface ASTClass extends ASTNode
{
	type: ASTNodeType.CLASS,
	name: string,
}


export declare interface ASTId extends ASTNode
{
	type: ASTNodeType.ID,
	name: string,
}


export declare interface ASTPseudoClass extends ASTNode
{
	type: ASTNodeType.PSEUDO_CLASS,
	name: string,
}


export declare interface ASTAttribute extends ASTNode
{
	type: ASTNodeType.ATTRIBUTE,
	caseSensitive: boolean,
	name: string,
	operator?: string,
	value?: string,
}


export declare interface ASTDescendant extends ASTNode
{
	type: ASTNodeType.DESCENDANT,
}


export declare interface ASTChild extends ASTNode
{
	type: ASTNodeType.CHILD,
}


export declare interface ASTAdjacentSibling extends ASTNode
{
	type: ASTNodeType.ADJACENT_SIBLING,
}


export declare interface ASTGeneralSibling extends ASTNode
{
	type: ASTNodeType.GENERAL_SIBLING,
}
