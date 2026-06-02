// ── Text normalisation ────────────────────────────────────────────────────────

/** Collapse whitespace + trim — makes text checks forgiving of indentation */
export function normalizeText(s) {
	return (s ?? '').replace(/\s+/g, ' ').trim();
}

// ── Tag/attribute examples shown to students ──────────────────────────────────

export const TAG_EXAMPLES = {
	h1: '<h1>Your heading</h1>',
	h2: '<h2>Your subheading</h2>',
	h3: '<h3>Your heading</h3>',
	p: '<p>Your paragraph text here.</p>',
	a: '<a href="https://example.com">Click here</a>',
	img: '<img src="image.jpg" alt="description of image">',
	ul: '<ul>\n  <li>First item</li>\n  <li>Second item</li>\n</ul>',
	ol: '<ol>\n  <li>First item</li>\n  <li>Second item</li>\n</ol>',
	li: '<li>List item text</li>',
	title: '<title>My Page Title</title>',
	div: '<div>Your content here</div>',
	span: '<span>inline text</span>',
	button: '<button>Click me</button>',
	input: '<input type="text" placeholder="Enter text">',
	form: '<form>\n  <!-- inputs go here -->\n</form>',
	label: '<label for="name">Your name</label>',
	strong: '<strong>bold text</strong>',
	em: '<em>italic text</em>'
};

export const ATTR_EXAMPLES = {
	href: 'href="https://example.com"',
	src: 'src="image.jpg"',
	alt: 'alt="description of the image"',
	id: 'id="my-element"',
	class: 'class="my-class"',
	type: 'type="text"',
	placeholder: 'placeholder="Enter text here"',
	for: 'for="input-id"',
	action: 'action="/submit"',
	method: 'method="post"'
};

// ── Selector helpers ──────────────────────────────────────────────────────────

export function tagFromSelector(sel) {
	if (!sel) return null;
	return sel.split(/[\s.#\[:/]/)[0] || null;
}

export function findOpenTag(src, tagName) {
	if (!tagName) return null;
	const rx = new RegExp(`<${tagName}(?:[\\s>\/])`, 'i');
	const m = src.match(rx);
	if (!m || m.index == null) return null;
	return { from: m.index, to: m.index + m[0].length - 1 };
}

// ── Smart check runner ────────────────────────────────────────────────────────

/**
 * @param {any} test
 * @param {Document} doc  parsed via DOMParser
 * @param {string} src    raw source code
 * @returns {{ passed: boolean, actual?: string }}
 */
export function runCheck(test, doc, src) {
	try {
		switch (test.check) {
			case 'has-doctype': {
				const passed = /^\s*<!doctype\s+html/i.test(src);
				return { passed, actual: passed ? 'found' : 'missing' };
			}
			case 'has-structure': {
				const missing = ['html', 'head', 'body'].filter((t) => !new RegExp(`<${t}[\\s>]`, 'i').test(src));
				return {
					passed: missing.length === 0,
					actual: missing.length ? `missing: ${missing.map((t) => `<${t}>`).join(', ')}` : 'all structural tags present'
				};
			}
			case 'has-tag': {
				const el = doc.querySelector(test.value);
				return { passed: !!el, actual: el ? `<${test.value}> found` : `no <${test.value}> found` };
			}
			case 'tag-text': {
				const el = doc.querySelector(test.tag);
				if (!el) return { passed: false, actual: null };
				const actual = normalizeText(el.textContent);
				const expected = normalizeText(test.value);
				return { passed: actual === expected, actual: el.textContent.trim() || '(empty)' };
			}
			case 'tag-text-contains': {
				const el = doc.querySelector(test.tag);
				if (!el) return { passed: false, actual: null };
				const actual = normalizeText(el.textContent);
				return { passed: actual.toLowerCase().includes(test.value.toLowerCase()), actual: el.textContent.trim() };
			}
			case 'not-empty': {
				const el = doc.querySelector(test.selector ?? test.tag ?? test.value);
				const actual = el?.textContent?.trim() ?? '';
				return { passed: actual.length > 0, actual: actual || '(empty)' };
			}
			case 'has-attribute': {
				const el = doc.querySelector(test.selector);
				const has = el?.hasAttribute(test.attribute) ?? false;
				const val = el?.getAttribute(test.attribute);
				return { passed: has, actual: has ? `${test.attribute}="${val}"` : null };
			}
			case 'attribute-value': {
				const el = doc.querySelector(test.selector);
				const actual = el?.getAttribute(test.attribute) ?? null;
				return { passed: actual === test.value, actual: actual ?? '(not found)' };
			}
			case 'attribute-contains': {
				const el = doc.querySelector(test.selector);
				const actual = el?.getAttribute(test.attribute) ?? '';
				return { passed: actual.includes(test.value), actual };
			}
			case 'attribute-not-empty': {
				const el = doc.querySelector(test.selector);
				const actual = el?.getAttribute(test.attribute)?.trim() ?? '';
				return { passed: actual.length > 0, actual: actual || '(empty)' };
			}
			case 'child-of': {
				const parent = doc.querySelector(test.parent);
				const child = parent?.querySelector(test.child);
				return { passed: !!child, actual: child ? `<${test.child}> inside <${test.parent}>` : null };
			}
			case 'tag-count': {
				const els = doc.querySelectorAll(test.selector ?? test.value);
				const count = els.length;
				return { passed: count === Number(test.count), actual: `found ${count} (need ${test.count})` };
			}
			case 'min-count': {
				const els = doc.querySelectorAll(test.selector ?? test.value);
				const count = els.length;
				return { passed: count >= Number(test.count), actual: `found ${count} (need ≥ ${test.count})` };
			}
			case 'css-property': {
				const el = doc.querySelector(test.selector);
				if (!el) return { passed: false, actual: `<${test.selector}> not found` };
				const inlineStyle = el.getAttribute('style') ?? '';
				const rx = new RegExp(`${test.property}\\s*:\\s*([^;]+)`, 'i');
				const m = inlineStyle.match(rx);
				const actual = m ? m[1].trim() : '(not set)';
				return { passed: actual === test.value, actual };
			}
			case 'code-contains':
				return { passed: src.toLowerCase().includes(test.value.toLowerCase()), actual: src.includes(test.value) ? 'found' : 'not found' };
			case 'code-not-contains':
				return { passed: !src.toLowerCase().includes(test.value.toLowerCase()), actual: src.includes(test.value) ? 'found (should not be here)' : 'not found ✓' };
			default:
				return { passed: false, actual: 'unknown check type' };
		}
	} catch (err) {
		return { passed: false, actual: `error: ${err.message}` };
	}
}

// ── Human-readable failure detail ─────────────────────────────────────────────

/**
 * @param {any} test
 * @param {string|null|undefined} actual
 * @param {Document} doc
 * @param {string} src
 */
export function buildDetail(test, actual, doc, src) {
	switch (test.check) {
		case 'has-doctype':
			return `Add <!DOCTYPE html> as the very first line — it tells the browser this is an HTML5 page`;

		case 'has-structure': {
			const missing = ['html', 'head', 'body'].filter((t) => !new RegExp(`<${t}[\\s>]`, 'i').test(src));
			if (missing.length === 1) {
				const t = missing[0];
				const msgs = {
					html: 'Wrap your entire page in <html>…</html>',
					head: 'Add a <head>…</head> section inside <html> — this is where <title> and other metadata go',
					body: 'Add a <body>…</body> section inside <html> — this is where everything visible goes'
				};
				return msgs[t] ?? `Add <${t}>`;
			}
			return `Missing: ${missing.map((t) => `<${t}>`).join(', ')} — these are required on every HTML page`;
		}

		case 'has-tag': {
			const tag = test.value;
			const example = TAG_EXAMPLES[tag] ?? `<${tag}>content here</${tag}>`;
			return `Add a <${tag}> element — example: ${example}`;
		}

		case 'tag-text': {
			const el = doc.querySelector(test.tag);
			if (!el) {
				return `No <${test.tag}> found yet — add one like: <${test.tag}>${test.value}</${test.tag}>`;
			}
			const actualText = el.textContent?.trim() ?? '';
			if (!actualText) {
				return `Your <${test.tag}> is empty — put text between the tags: <${test.tag}>${test.value}</${test.tag}>`;
			}
			const lowerActual = normalizeText(actualText).toLowerCase();
			const lowerExpected = normalizeText(test.value).toLowerCase();
			if (lowerActual === lowerExpected) {
				return `Almost there! Check capitalization and punctuation — it needs to say exactly: "${test.value}"`;
			}
			return `Your <${test.tag}> says "${actualText}" but it needs to say exactly "${test.value}"`;
		}

		case 'tag-text-contains': {
			const el = doc.querySelector(test.tag);
			if (!el) return `No <${test.tag}> found yet`;
			const actualText = el.textContent?.trim() ?? '';
			if (!actualText) return `Your <${test.tag}> is empty — add text that includes "${test.value}"`;
			return `Your <${test.tag}> says "${actualText}" — it needs to include "${test.value}"`;
		}

		case 'not-empty': {
			const selector = test.selector ?? test.tag ?? test.value;
			return `Your <${selector}> is empty — add some text between the opening and closing tags`;
		}

		case 'has-attribute': {
			const tagName = tagFromSelector(test.selector) ?? test.selector;
			const attrEx = ATTR_EXAMPLES[test.attribute] ?? `${test.attribute}="value"`;
			return `Your <${tagName}> is missing the ${test.attribute} attribute — add it: <${tagName} ${attrEx}>`;
		}

		case 'attribute-value': {
			const tagName = tagFromSelector(test.selector) ?? test.selector;
			const current = actual && actual !== '(not found)' ? ` (currently "${actual}")` : '';
			return `Set ${test.attribute}="${test.value}" on your <${tagName}>${current}`;
		}

		case 'attribute-not-empty': {
			const tagName = tagFromSelector(test.selector) ?? test.selector;
			return `The ${test.attribute} on your <${tagName}> is empty — add a value, like: ${ATTR_EXAMPLES[test.attribute] ?? `${test.attribute}="something"`}`;
		}

		case 'attribute-contains': {
			const tagName = tagFromSelector(test.selector) ?? test.selector;
			return `The ${test.attribute} on <${tagName}> needs to contain "${test.value}"`;
		}

		case 'child-of':
			return `Put your <${test.child}> inside <${test.parent}> — not outside it`;

		case 'tag-count':
			return `${actual} — check you have exactly ${test.count} <${test.selector ?? test.value}> element${Number(test.count) !== 1 ? 's' : ''}`;

		case 'min-count':
			return `${actual} — you need at least ${test.count} <${test.selector ?? test.value}> element${Number(test.count) !== 1 ? 's' : ''}`;

		case 'css-property':
			return `Set ${test.property}: ${test.value} on <${test.selector}> — found "${actual ?? 'nothing'}"`;

		case 'code-contains':
			return `Your code needs to include: ${test.value}`;

		case 'code-not-contains':
			return `Remove "${test.value}" from your code`;

		default:
			return actual ?? null;
	}
}

// ── Test → editor diagnostic mapping ─────────────────────────────────────────

function buildDiagMessage(test) {
	const base = test.description;
	if (test.detail) return `${base} — ${test.detail}`;
	return `Test: ${base}`;
}

function locateFailure(test, src) {
	const fallback = { from: 0, to: Math.min(src.length, 1) };
	switch (test.check) {
		case 'has-tag':
		case 'has-doctype':
			return findOpenTag(src, 'body') ?? fallback;
		case 'tag-text':
		case 'tag-text-contains':
		case 'not-empty':
			return findOpenTag(src, test.tag ?? test.selector ?? test.value) ?? fallback;
		case 'has-attribute':
		case 'attribute-value':
		case 'attribute-contains':
		case 'attribute-not-empty': {
			const tag = tagFromSelector(test.selector);
			return (tag ? findOpenTag(src, tag) : null) ?? fallback;
		}
		case 'child-of':
			return findOpenTag(src, test.parent) ?? fallback;
		case 'tag-count':
		case 'min-count': {
			const tag = tagFromSelector(test.selector ?? test.value);
			return (tag ? findOpenTag(src, tag) : null) ?? fallback;
		}
		case 'css-property': {
			const tag = tagFromSelector(test.selector);
			return (tag ? findOpenTag(src, tag) : null) ?? fallback;
		}
		default:
			return fallback;
	}
}

/** @param {any[]} results @param {string} src */
export function computeTestDiagnostics(results, src) {
	return results
		.filter((t) => t.passed === false)
		.map((test) => {
			const pos = locateFailure(test, src);
			return {
				from: pos.from,
				to: pos.to,
				severity: /** @type {'warning'} */ ('warning'),
				source: 'test',
				message: buildDiagMessage(test)
			};
		});
}
