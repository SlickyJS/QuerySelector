import {exists} from '@slicky/utils';
import {IDocumentWalker} from '../src';


export function createDom(tree: Array<MockDocumentNode>): MockDocumentNode
{
	function normalize(parent: MockDocumentNode): void
	{
		for (let i = 0; i < parent.childNodes.length; i++) {
			let child = parent.childNodes[i];

			if (!exists(child.type)) {
				child.type = MockDocumentNodeType.ELEMENT;
			}

			if (!exists(child.childNodes)) {
				child.childNodes = [];
			}

			if (!exists(child.attributes)) {
				child.attributes = {};
			}

			child.parent = parent;

			normalize(child);
		}
	}

	let parent = {
		name: 'document',
		childNodes: tree,
	};

	normalize(parent);

	return parent;
}


export enum MockDocumentNodeType
{
	ELEMENT,
	STRING,
}


export declare interface MockDocumentNode
{
	name: string,
	type?: MockDocumentNodeType,
	attributes?: {[name: string]: string},
	parent?: MockDocumentNode,
	childNodes?: Array<MockDocumentNode>,
}


export class MockWalker implements IDocumentWalker
{


	public getNodeName(node: MockDocumentNode): string
	{
		return node.name;
	}


	public isElement(node: MockDocumentNode): boolean
	{
		return node.type === MockDocumentNodeType.ELEMENT;
	}


	public isString(node: MockDocumentNode): boolean
	{
		return node.type === MockDocumentNodeType.STRING;
	}


	public getParentNode(node: MockDocumentNode): MockDocumentNode
	{
		return node.parent;
	}


	public getChildNodes(parent: MockDocumentNode): Array<MockDocumentNode>
	{
		return parent.childNodes;
	}


	public getAttribute(node: MockDocumentNode, name: string): string
	{
		return node.attributes[name];
	}

}
