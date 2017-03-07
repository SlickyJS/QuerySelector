export type DocumentNode = Object;
export type DocumentParent = DocumentNode|Object;


export interface IDocumentWalker
{


	getNodeName(node: DocumentNode): string;

	isElement(node: DocumentNode): boolean;

	isString(node: DocumentNode): boolean;

	getParentNode(node: DocumentNode): DocumentParent;

	getChildNodes(parent: DocumentParent): Array<DocumentNode>;

	getAttribute(node: DocumentNode, name: string): string;

}
