// Code runner via Wandbox API — https://wandbox.org/api/compile.json
// Wandbox is a free public compiler service with no API key required.
// Full compiler list: https://wandbox.org/api/list.json

const WANDBOX_API = 'https://wandbox.org/api/compile.json';

// Languages handled locally in the browser — never sent to Wandbox
export const LOCAL_LANGUAGES = new Set(['html', 'css', 'javascript']);

/** @param {string} lang */
export function isPistonLanguage(lang) {
	return !LOCAL_LANGUAGES.has(lang?.toLowerCase?.() ?? '');
}

/**
 * Wandbox compiler names.
 * Using -head compilers where available for latest stable version.
 * If a name doesn't exist, Wandbox returns a 400 — update it from /api/list.json.
 */
const COMPILER_MAP = /** @type {Record<string,string>} */ ({
	// Systems
	c:          'gcc-head',
	cpp:        'gcc-head',
	'c++':      'gcc-head',
	rust:       'rust-head',
	nim:        'nim-head',
	crystal:    'crystal-head',
	d:          'dmd-head',

	// JVM
	java:       'openjdk-head',
	kotlin:     'kotlin-head',
	scala:      'scala-head',

	// Scripting
	python:     'cpython-head',
	python3:    'cpython-head',
	ruby:       'ruby-head',
	perl:       'perl-head',
	lua:        'lua-head',
	php:        'php-head',
	bash:       'bash',
	sh:         'bash',
	coffeescript: 'coffeescript-head',

	// Functional
	haskell:    'ghc-head',
	erlang:     'erlang-head',
	ocaml:      'ocaml-head',

	// Modern
	go:         'go-head',
	swift:      'swift-head',
	typescript: 'typescript-head',

	// Data
	r:          'r-head',

	// Other
	pascal:     'fpc-head',
});

/**
 * Extra compiler flags passed in `options` when the default isn't right.
 * e.g. gcc-head is g++ by default; -x c forces C compilation mode.
 */
const LANG_OPTIONS = /** @type {Record<string,string>} */ ({
	c: '-x c',
});

/**
 * Run code via Wandbox and return normalised output.
 * @param {string} code
 * @param {string} language  course config language key (e.g. 'c', 'python')
 * @param {string} [stdin]
 * @returns {Promise<{ stdout: string, stderr: string, exitCode: number, signal: string | null }>}
 */
export async function pistonRun(code, language, stdin = '') {
	const lang = (language ?? '').toLowerCase();
	const compiler = COMPILER_MAP[lang];

	if (!compiler) {
		const supported = Object.keys(COMPILER_MAP).sort().join(', ');
		throw new Error(
			`Language '${language}' is not supported yet.\nSupported languages: ${supported}`
		);
	}

	const res = await fetch(WANDBOX_API, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			compiler,
			code,
			stdin,
			options: LANG_OPTIONS[lang] ?? '',
		}),
	});

	if (!res.ok) {
		const msg = await res.text().catch(() => res.statusText);
		throw new Error(`Code runner error ${res.status}: ${msg}`);
	}

	const data = await res.json();
	if (data.error) throw new Error(`Wandbox: ${data.error}`);

	// Merge compile-time stderr + runtime stderr
	const compileErr = (data.compiler_error ?? '').trim();
	const runtimeErr = (data.program_error ?? '').trim();
	const stderr = [compileErr, runtimeErr].filter(Boolean).join('\n').trim();

	return {
		stdout: data.program_output ?? '',
		stderr,
		exitCode: parseInt(data.status ?? '0', 10),
		signal: data.signal ?? null,
	};
}

/** @param {string} [language] Display name for a language key */
export function langLabel(language) {
	const labels = {
		c: 'C', cpp: 'C++', 'c++': 'C++', rust: 'Rust',
		java: 'Java', kotlin: 'Kotlin', scala: 'Scala',
		python: 'Python', python3: 'Python', ruby: 'Ruby',
		perl: 'Perl', lua: 'Lua', php: 'PHP', bash: 'Bash', sh: 'Bash',
		go: 'Go', swift: 'Swift', typescript: 'TypeScript',
		nim: 'Nim', crystal: 'Crystal', haskell: 'Haskell',
		erlang: 'Erlang', ocaml: 'OCaml', r: 'R', pascal: 'Pascal',
		d: 'D', coffeescript: 'CoffeeScript',
		javascript: 'JavaScript', html: 'HTML', css: 'CSS',
	};
	return /** @type {Record<string,string>} */ (labels)[(language ?? '').toLowerCase()] ?? language?.toUpperCase() ?? 'Code';
}
