const PISTON_API = 'https://emkc.org/api/v2/piston/execute';

// Browsers that don't need Piston — handled in-browser
export const LOCAL_LANGUAGES = new Set(['html', 'css', 'javascript']);

/** @param {string} lang */
export function isPistonLanguage(lang) {
	return !LOCAL_LANGUAGES.has(lang?.toLowerCase?.() ?? '');
}

// Map course config language name → Piston language name
// Piston supports everything here: https://emkc.org/api/v2/piston/runtimes
const LANG_MAP = {
	// Systems
	c: 'c',
	cpp: 'c++',
	'c++': 'c++',
	rust: 'rust',
	zig: 'zig',
	asm: 'nasm',
	nasm: 'nasm',
	gas: 'nasm',

	// JVM
	java: 'java',
	kotlin: 'kotlin',
	scala: 'scala',
	groovy: 'groovy',
	clojure: 'clojure',

	// Scripting
	python: 'python',
	python3: 'python',
	ruby: 'ruby',
	perl: 'perl',
	lua: 'lua',
	php: 'php',
	bash: 'bash',
	sh: 'bash',
	powershell: 'powershell',
	pwsh: 'powershell',
	tcl: 'tcl',

	// Functional
	haskell: 'haskell',
	erlang: 'erlang',
	elixir: 'elixir',
	ocaml: 'ocaml',
	fsharp: 'fsharp',
	'f#': 'fsharp',
	scheme: 'scheme',
	racket: 'racket',
	lisp: 'common lisp',
	commonlisp: 'common lisp',
	'common lisp': 'common lisp',

	// Modern
	go: 'go',
	dart: 'dart',
	swift: 'swift',
	typescript: 'typescript',
	ts: 'typescript',
	nim: 'nim',
	crystal: 'crystal',
	vlang: 'vlang',
	v: 'vlang',
	d: 'd',

	// Esoteric
	brainfuck: 'brainfuck',
	bf: 'brainfuck',
	lolcode: 'lolcode',
	whitespace: 'whitespace',
	cow: 'cow',
	befunge93: 'befunge93',
	befunge: 'befunge93',
	malbolge: 'malbolge',
	emojicode: 'emojicode',
	jelly: 'jelly',

	// Data / scripting
	r: 'r',
	julia: 'julia',
	octave: 'octave',
	matlab: 'octave',

	// Other
	csharp: 'c#',
	'c#': 'c#',
	vb: 'basic',
	basic: 'basic',
	cobol: 'cobol',
	fortran: 'fortran',
	pascal: 'pascal',
	prolog: 'prolog',
	coffeescript: 'coffeescript',
	sqlite3: 'sqlite3',
	sql: 'sqlite3',
};

/**
 * @param {string} code
 * @param {string} language  course config language key
 * @param {string} [stdin]
 * @returns {Promise<{ stdout: string, stderr: string, exitCode: number, signal: string | null }>}
 */
export async function pistonRun(code, language, stdin = '') {
	const pistonLang = /** @type {Record<string,string>} */ (LANG_MAP)[language?.toLowerCase()] ?? language;

	const res = await fetch(PISTON_API, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			language: pistonLang,
			version: '*',
			files: [{ content: code }],
			stdin,
			args: [],
		}),
	});

	if (!res.ok) {
		const msg = await res.text().catch(() => res.statusText);
		throw new Error(`Piston API error ${res.status}: ${msg}`);
	}

	const data = await res.json();
	if (data.message) throw new Error(`Piston: ${data.message}`);

	return {
		stdout: data.run?.stdout ?? '',
		stderr: data.run?.stderr ?? '',
		exitCode: data.run?.code ?? 0,
		signal: data.run?.signal ?? null,
	};
}

/** @param {string} [language] Display name for a language key */
export function langLabel(language) {
	const labels = {
		c: 'C', cpp: 'C++', 'c++': 'C++', rust: 'Rust', zig: 'Zig',
		asm: 'Assembly', nasm: 'NASM', java: 'Java', kotlin: 'Kotlin',
		scala: 'Scala', python: 'Python', python3: 'Python', ruby: 'Ruby',
		perl: 'Perl', lua: 'Lua', php: 'PHP', bash: 'Bash', sh: 'Bash',
		go: 'Go', dart: 'Dart', swift: 'Swift', typescript: 'TypeScript',
		ts: 'TypeScript', nim: 'Nim', crystal: 'Crystal', haskell: 'Haskell',
		erlang: 'Erlang', elixir: 'Elixir', ocaml: 'OCaml', brainfuck: 'Brainfuck',
		bf: 'Brainfuck', r: 'R', julia: 'Julia', csharp: 'C#', 'c#': 'C#',
		coffeescript: 'CoffeeScript', javascript: 'JavaScript', html: 'HTML',
		css: 'CSS', sql: 'SQL', prolog: 'Prolog', lolcode: 'LOLCODE',
		whitespace: 'Whitespace', cow: 'COW', malbolge: 'Malbolge',
		emojicode: 'Emojicode',
	};
	return /** @type {Record<string,string>} */ (labels)[(language ?? '').toLowerCase()] ?? language?.toUpperCase() ?? 'Code';
}
