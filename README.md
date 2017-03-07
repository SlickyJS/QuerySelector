[![NPM version](https://img.shields.io/npm/v/@slicky/query-selector.svg?style=flat-square)](https://www.npmjs.com/package/@slicky/query-selector)
[![Build Status](https://img.shields.io/travis/SlickyJS/QuerySelector.svg?style=flat-square)](https://travis-ci.org/SlickyJS/QuerySelector)

[![Donate](https://img.shields.io/badge/donate-PayPal-brightgreen.svg?style=flat-square)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RQGEN5MDKSS6W)

# Slicky/QuerySelector

CSS selectors implemented in javascript

This library does not depend on any javascript DOM parser and can be used in either browser or node environment.

It can work with native DOM in browser, with parse5 or any other library.

## Installation

```
$ npm install @slicky/query-selector
```

## Custom DocumentWalker

First you will need to implement few methods, which will be used by this library to read the DOM.

**Example of the simplest document walker:**

```typescript
import {IDocumentWalker, DocumentNode, DocumentParent} from '@slicky/query-selector';


class CustomDocumentWalker implements IDocumentWalker
{


	public getNodeName(node: DocumentNode): string
	{
		return node.nodeName;
	}


	public isElement(node: DocumentNode): boolean
	{
		return node.type === 'string';
	}


	public isString(node: DocumentNode): boolean
	{
		return node.type === 'string';
	}


	public getParentNode(node: DocumentNode): DocumentParent
	{
		return node.parentNode;
	}


	public getChildNodes(parent: DocumentParent): Array<DocumentNode>
	{
		return parent.childNodes;
	}


	public getAttribute(node: DocumentNode, name: string): string
	{
		return node.attributes[name];
	}
	
}
```

## Usage

```typescript
import {Matcher} from '@slicky/query-selector';


let matcher = new Matcher(new CustomDocumentWalker);
let dom = loadCustomDOM();


let element = matcher.querySelector(dom, 'div a.btn:first-child');	// one element
let elements = matcher.querySelectorAll(dom, 'a.btn');				// array of elements
let matches = matcher.matches(element, 'a.btn');					// true
```

## API

* `querySelector`: similar to [Document.querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
* `querySelectorAll`: similar to [Document.querySelectorAll()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)
* `matches`: similar to [Element.matches()](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches)

## Supported selectors

* [Type selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors) (`div`)
* [Class selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) (`.btn`)
* [ID selector](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors) (`#header`)
* [Attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) (`[attr]`, ...)
* [Adjacent sibling selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_selectors) (`span + i`)
* [General sibling selector](https://developer.mozilla.org/en-US/docs/Web/CSS/General_sibling_selectors) (`span ~ i`)
* [Child selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Child_selectors) (`span > i`)
* [Descendant selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_selectors) (`span i`)
* [Empty](https://developer.mozilla.org/en-US/docs/Web/CSS/:empty) (`:empty`)
* [First child](https://developer.mozilla.org/en-US/docs/Web/CSS/:first-child) (`:first-child`)
* [First of type](https://developer.mozilla.org/en-US/docs/Web/CSS/:first-of-type) (`:first-of-type`)
* [Last child](https://developer.mozilla.org/en-US/docs/Web/CSS/:last-child) (`:last-child`)
* [Last of type](https://developer.mozilla.org/en-US/docs/Web/CSS/:last-of-type) (`:last-of-type`)
