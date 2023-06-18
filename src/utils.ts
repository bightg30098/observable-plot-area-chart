export function mapAttributeToProp(attribute: string) {
	if (attribute === "class") {
		return "className";
	}

	if (attribute === "for") {
		return "htmlFor";
	}

	if (/data-|aria-/.test(attribute)) {
		return attribute;
	}

	return hyphenToCamelCase(attribute);
}

function hyphenToCamelCase(str: string) {
	return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
