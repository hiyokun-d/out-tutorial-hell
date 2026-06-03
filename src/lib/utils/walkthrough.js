/**
 * Resolves a highlight spec to a { fromLine, toLine } pair (1-indexed).
 * Returns null if no highlight is specified or can't be resolved.
 *
 * Supported formats:
 *   { line: 1 }           – single line
 *   { lines: [1, 5] }     – range from min to max
 *   { text: "<h1>" }      – first line containing this text
 *   { from: 0, to: 15 }   – character range converted to lines
 *
 * @param {any} spec
 * @param {string} code
 * @returns {{ fromLine: number, toLine: number } | null}
 */
export function resolveHighlightLines(spec, code) {
	if (!spec) return null;

	if (spec.line !== undefined) {
		return { fromLine: spec.line, toLine: spec.line };
	}

	if (Array.isArray(spec.lines) && spec.lines.length > 0) {
		return { fromLine: Math.min(...spec.lines), toLine: Math.max(...spec.lines) };
	}

	if (spec.text !== undefined) {
		const codeLines = code.split('\n');
		for (let i = 0; i < codeLines.length; i++) {
			if (codeLines[i].includes(spec.text)) {
				return { fromLine: i + 1, toLine: i + 1 };
			}
		}
		return null;
	}

	if (spec.from !== undefined && spec.to !== undefined) {
		const before = code.slice(0, spec.from);
		const fromLine = (before.match(/\n/g) || []).length + 1;
		const segment = code.slice(spec.from, spec.to);
		const toLine = fromLine + (segment.match(/\n/g) || []).length;
		return { fromLine, toLine };
	}

	return null;
}
