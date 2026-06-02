/** Self-closing tags */
const VOID = new Set([
	'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
	'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

/** Default attributes for specific tags */
const PRESET = {
	a:       [['href', '']],
	img:     [['src', ''], ['alt', '']],
	input:   [['type', 'text']],
	link:    [['rel', 'stylesheet'], ['href', '']],
	script:  [['src', '']],
	meta:    [['name', ''], ['content', '']],
	label:   [['for', '']],
	form:    [['action', ''], ['method', 'post']],
	video:   [['src', ''], ['controls', null]],
	audio:   [['src', ''], ['controls', null]],
	option:  [['value', '']],
	select:  [['name', '']],
	button:  [['type', 'button']],
	iframe:  [['src', ''], ['title', '']],
	td:      [],
	th:      [],
};

const C = '\x00'; // cursor placeholder (null byte)

// ── Attribute builder ─────────────────────────────────────────────────────────

function buildAttrs(tag, classes, id) {
	let s = '';
	if (id) s += ` id="${id}"`;
	if (classes.length) s += ` class="${classes.join(' ')}"`;
	if (PRESET[tag]) {
		for (const [k, v] of PRESET[tag]) {
			s += v === null ? ` ${k}` : ` ${k}="${v}"`;
		}
	}
	return s;
}

// ── Element renderer ──────────────────────────────────────────────────────────

function renderEl(tag, classes, id, childHtml) {
	const a = buildAttrs(tag, classes, id);

	if (VOID.has(tag)) return `<${tag}${a}>`;

	if (childHtml !== null) {
		const indented = childHtml.split('\n').map((l) => '  ' + l).join('\n');
		return `<${tag}${a}>\n${indented}\n</${tag}>`;
	}

	// No explicit children: single-line with cursor inside
	return `<${tag}${a}>${C}</${tag}>`;
}

// ── Parser ────────────────────────────────────────────────────────────────────

/** Find index of first top-level `>` (not inside brackets) */
function topGt(s) {
	let depth = 0;
	for (let i = 0; i < s.length; i++) {
		if ('(['.includes(s[i])) depth++;
		else if (')]'.includes(s[i])) depth--;
		else if (s[i] === '>' && depth === 0) return i;
	}
	return -1;
}

/** Find index of first top-level `+` (sibling combinator, lowest precedence) */
function topPlus(s) {
	let depth = 0;
	for (let i = 0; i < s.length; i++) {
		if ('(['.includes(s[i])) depth++;
		else if (')]'.includes(s[i])) depth--;
		else if (s[i] === '+' && depth === 0) return i;
	}
	return -1;
}

/** Parse "tagname(.class|#id)*" */
function parseEl(part) {
	let tag = '';
	let i = 0;
	while (i < part.length && /[a-z0-9:-]/i.test(part[i]) && part[i] !== '.' && part[i] !== '#') {
		tag += part[i++];
	}
	if (!tag) tag = 'div';

	const classes = [];
	let id = null;
	const re = /([.#])([a-z0-9_-]+)/gi;
	let m;
	while ((m = re.exec(part.slice(i))) !== null) {
		m[1] === '.' ? classes.push(m[2]) : (id = m[2]);
	}

	return { tag: tag.toLowerCase(), classes, id };
}

// ── Expander ──────────────────────────────────────────────────────────────────

function expand(abbr) {
	// + (sibling) has lower precedence than > (child) — process outermost first
	const plus = topPlus(abbr);
	if (plus !== -1) {
		const left = expand(abbr.slice(0, plus));
		const right = expand(abbr.slice(plus + 1)).replace(C, ''); // cursor only in first sibling
		return left + '\n' + right;
	}

	const gt = topGt(abbr);
	let part, childHtml = null;

	if (gt !== -1) {
		part = abbr.slice(0, gt);
		childHtml = expand(abbr.slice(gt + 1));
	} else {
		part = abbr;
	}

	// Handle *N repetition
	const star = part.search(/\*\d+$/);
	let count = 1;
	if (star !== -1) {
		count = parseInt(part.slice(star + 1));
		part = part.slice(0, star);
	}

	const { tag, classes, id } = parseEl(part);

	if (count === 1) return renderEl(tag, classes, id, childHtml);

	// Multiple items: cursor only in first
	const items = [];
	for (let i = 0; i < count; i++) {
		let html = renderEl(tag, classes, id, childHtml);
		if (i > 0) html = html.replace(C, '');
		items.push(html);
	}
	return items.join('\n');
}

// ── Public API ────────────────────────────────────────────────────────────────

// ── HTML boilerplate ─────────────────────────────────────────────────────────

export const HTML_BOILERPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>

  </body>
</html>`;

/** Offset into HTML_BOILERPLATE where the cursor should land (inside <body>) */
export const SNIPPET_CURSOR_OFFSET = HTML_BOILERPLATE.indexOf('  <body>\n') + '  <body>\n    '.length;

// ── Abbreviation list (used by autocomplete) ──────────────────────────────────

/** @type {{ label: string, detail: string }[]} */
export const EMMET_ABBREVIATIONS = [
	// ── Special ───────────────────────────────────────────────────────────────
	{ label: '!',              detail: 'HTML5 boilerplate' },
	// ── Document structure ────────────────────────────────────────────────────
	{ label: 'html',           detail: 'Root element' },
	{ label: 'head',           detail: 'Document head' },
	{ label: 'body',           detail: 'Document body' },
	{ label: 'title',          detail: 'Page title' },
	{ label: 'meta',           detail: '<meta name="" content="">' },
	{ label: 'link',           detail: 'CSS stylesheet <link>' },
	{ label: 'script',         detail: '<script src="">' },
	{ label: 'style',          detail: 'Inline <style> block' },
	// ── Headings ──────────────────────────────────────────────────────────────
	{ label: 'h1',             detail: 'Heading level 1' },
	{ label: 'h2',             detail: 'Heading level 2' },
	{ label: 'h3',             detail: 'Heading level 3' },
	{ label: 'h4',             detail: 'Heading level 4' },
	{ label: 'h5',             detail: 'Heading level 5' },
	{ label: 'h6',             detail: 'Heading level 6' },
	// ── Text ──────────────────────────────────────────────────────────────────
	{ label: 'p',              detail: 'Paragraph' },
	{ label: 'span',           detail: 'Inline container' },
	{ label: 'strong',         detail: 'Bold / important text' },
	{ label: 'em',             detail: 'Italic / emphasis' },
	{ label: 'small',          detail: 'Small / fine print' },
	{ label: 'br',             detail: 'Line break' },
	{ label: 'hr',             detail: 'Horizontal rule' },
	{ label: 'blockquote',     detail: 'Blockquote' },
	{ label: 'pre',            detail: 'Preformatted text' },
	{ label: 'code',           detail: 'Inline code' },
	{ label: 'pre>code',       detail: 'Code block' },
	{ label: 'abbr',           detail: 'Abbreviation' },
	{ label: 'mark',           detail: 'Highlighted text' },
	// ── Links & media ─────────────────────────────────────────────────────────
	{ label: 'a',              detail: '<a href="">link</a>' },
	{ label: 'img',            detail: '<img src="" alt="">' },
	{ label: 'video',          detail: '<video src="" controls>' },
	{ label: 'audio',          detail: '<audio src="" controls>' },
	{ label: 'iframe',         detail: '<iframe src="" title="">' },
	{ label: 'figure',         detail: 'Figure container' },
	{ label: 'figure>img',     detail: 'Figure with image' },
	{ label: 'figure>img+figcaption', detail: 'Image with caption' },
	// ── Lists ─────────────────────────────────────────────────────────────────
	{ label: 'ul',             detail: 'Unordered list' },
	{ label: 'ol',             detail: 'Ordered list' },
	{ label: 'li',             detail: 'List item' },
	{ label: 'ul>li',          detail: 'List + 1 item' },
	{ label: 'ul>li*2',        detail: 'List + 2 items' },
	{ label: 'ul>li*3',        detail: 'List + 3 items' },
	{ label: 'ul>li*5',        detail: 'List + 5 items' },
	{ label: 'ol>li*3',        detail: 'Ordered list + 3 items' },
	{ label: 'ol>li*5',        detail: 'Ordered list + 5 items' },
	{ label: 'dl',             detail: 'Description list' },
	{ label: 'dl>dt+dd',       detail: 'Term + description' },
	// ── Forms ─────────────────────────────────────────────────────────────────
	{ label: 'form',           detail: 'Form' },
	{ label: 'input',          detail: '<input type="text">' },
	{ label: 'button',         detail: '<button type="button">' },
	{ label: 'label',          detail: '<label for="">' },
	{ label: 'select',         detail: 'Dropdown <select>' },
	{ label: 'option',         detail: '<option value="">' },
	{ label: 'textarea',       detail: 'Multi-line text input' },
	{ label: 'fieldset',       detail: 'Form group' },
	{ label: 'legend',         detail: 'Fieldset caption' },
	{ label: 'form>label+input', detail: 'Label + input pair' },
	{ label: 'form>input+button', detail: 'Input + submit button' },
	// ── Layout ────────────────────────────────────────────────────────────────
	{ label: 'div',            detail: 'Generic block' },
	{ label: 'div.container',  detail: '<div class="container">' },
	{ label: 'div.wrapper',    detail: '<div class="wrapper">' },
	{ label: 'div.flex',       detail: '<div class="flex">' },
	{ label: 'div.grid',       detail: '<div class="grid">' },
	{ label: 'section',        detail: 'Page section' },
	{ label: 'article',        detail: 'Article / blog post' },
	{ label: 'nav',            detail: 'Navigation bar' },
	{ label: 'header',         detail: 'Page / section header' },
	{ label: 'footer',         detail: 'Page / section footer' },
	{ label: 'main',           detail: 'Main content area' },
	{ label: 'aside',          detail: 'Sidebar / aside' },
	{ label: 'details',        detail: 'Disclosure widget' },
	{ label: 'details>summary', detail: 'Details with summary' },
	{ label: 'nav>ul>li*3',    detail: 'Nav menu with 3 links' },
	{ label: 'nav>ul>li*5',    detail: 'Nav menu with 5 links' },
	// ── Table ─────────────────────────────────────────────────────────────────
	{ label: 'table',          detail: 'Table' },
	{ label: 'tr',             detail: 'Table row' },
	{ label: 'td',             detail: 'Table data cell' },
	{ label: 'th',             detail: 'Table header cell' },
	{ label: 'thead',          detail: 'Table head' },
	{ label: 'tbody',          detail: 'Table body' },
	{ label: 'table>tr>td',    detail: 'Table → row → cell' },
	{ label: 'table>tr>td*3',  detail: 'Table row with 3 cells' },
	{ label: 'table>thead>tr>th*3', detail: '3-column header row' },
];

/**
 * Expand an Emmet abbreviation to HTML.
 *
 * Supported syntax:
 *   tag               → <tag>|</tag>
 *   tag.class         → <tag class="class">|</tag>
 *   tag#id            → <tag id="id">|</tag>
 *   tag.c1.c2#id      → combined
 *   parent>child      → nested
 *   tag*N             → N repeated elements (cursor in first)
 *   parent>child*N    → parent with N children
 *
 * @param {string} abbr
 * @returns {{ html: string, cursorOffset: number } | null}
 */
export function expandEmmet(abbr) {
	if (!abbr) return null;
	// Must look like an abbreviation: letter/./# start, valid chars only
	// Allow: letters, digits, . # > * + : - _ (no spaces or other special chars)
	if (!/^[a-z][a-z0-9:.#>*+_-]*$/i.test(abbr)) {
		return null;
	}

	try {
		const raw = expand(abbr);
		if (!raw) return null;

		const ci = raw.indexOf(C);
		const html = raw.replaceAll(C, '');
		return { html, cursorOffset: ci === -1 ? html.length : ci };
	} catch {
		return null;
	}
}
