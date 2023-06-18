import * as Plot from "@observablehq/plot";
import { ReactNode, createElement } from "react";
import { nanoid } from "nanoid";
import { mapAttributeToProp } from "./utils";

// Based on https://github.com/observablehq/plot/blob/main/docs/components/PlotRender.js

type PlotFigureProps = {
	options: Partial<Plot.PlotOptions>;
};

export default function PlotFigure({ options }: PlotFigureProps) {
	// @ts-ignore
	return Plot.plot({ ...options, document: new MyDocument() }).toHyperScript();
}

class MyDocument {
	documentElement: MyElement;

	constructor() {
		this.documentElement = new MyElement(this, "html");
	}

	createElementNS(namespace: string, tagName: string) {
		return new MyElement(this, tagName);
	}

	createElement(tagName: string) {
		return new MyElement(this, tagName);
	}

	createTextNode(value: unknown) {
		return new MyTextNode(this, value);
	}

	querySelector() {
		return null;
	}

	querySelectorAll() {
		return [];
	}
}

class MyStyle {
	static empty = new MyStyle();
	setProperty() {}
	removeProperty() {}
}

class MyElement {
	ownerDocument: MyDocument;
	tagName: string;
	attributes: Record<string, unknown>;
	children: (MyElement | MyTextNode)[];
	parentNode: MyElement | MyTextNode | null;
	key: string;

	constructor(ownerDocument: MyDocument, tagName: string, key = nanoid()) {
		this.ownerDocument = ownerDocument;
		this.tagName = tagName;
		this.attributes = { key };
		this.children = [];
		this.parentNode = null;
		this.key = key;
	}

	setAttribute(name: string, value: unknown) {
		this.attributes[mapAttributeToProp(name)] = String(value);
	}

	setAttributeNS(namespace: string, name: string, value: unknown) {
		this.setAttribute(name, value);
	}

	getAttribute(name: string) {
		return this.attributes[name];
	}

	getAttributeNS(name: string) {
		return this.getAttribute(name);
	}

	hasAttribute(name: string) {
		return name in this.attributes;
	}

	hasAttributeNS(name: string) {
		return this.hasAttribute(name);
	}

	removeAttribute(name: string) {
		delete this.attributes[name];
	}

	removeAttributeNS(namespace: string, name: string) {
		this.removeAttribute(name);
	}

	addEventListener() {
		// ignored; interaction needs real DOM
	}

	removeEventListener() {
		// ignored; interaction needs real DOM
	}

	dispatchEvent() {
		// ignored; interaction needs real DOM
	}

	appendChild(child: MyElement) {
		this.children.push(child);
		child.parentNode = this;
		return child;
	}

	insertBefore(child: MyElement, after: MyElement) {
		if (after == null) {
			this.children.push(child);
		} else {
			const i = this.children.indexOf(after);
			if (i < 0) throw new Error("insertBefore reference node not found");
			this.children.splice(i, 0, child);
		}

		child.parentNode = this;
		return child;
	}

	querySelector() {
		return null;
	}

	querySelectorAll() {
		return [];
	}

	set textContent(value: unknown) {
		this.children = [this.ownerDocument.createTextNode(value)];
	}

	set style(value) {
		this.attributes.style = value;
	}

	get style() {
		return MyStyle.empty;
	}

	toHyperScript(): ReactNode {
		return createElement(
			this.tagName,
			this.attributes,
			this.children.map((c) => c.toHyperScript()),
		);
	}
}

class MyTextNode {
	ownerDocument: MyDocument;
	nodeValue: string;

	constructor(ownerDocument: MyDocument, nodeValue: unknown) {
		this.ownerDocument = ownerDocument;
		this.nodeValue = String(nodeValue);
	}

	toHyperScript() {
		return this.nodeValue;
	}
}
