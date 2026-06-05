/**
 * Extracts all variable names declared with let/const/var in the source.
 * @param {string} src
 * @returns {string[]}
 */
export function extractVarNames(src) {
	const names = new Set();
	for (const m of src.matchAll(/(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g)) {
		names.add(m[1]);
	}
	return [...names];
}

/**
 * Instruments source code to emit step events when run.
 * Each executable line gets wrapped with:
 *   window.__line = N  (before — so console.log gets the right line)
 *   original line
 *   variable capture + window.__capture(N, snapshot)  (after)
 *
 * @param {string} src
 * @returns {string}
 */
export function instrumentCode(src) {
	const varNames = extractVarNames(src);
	const lines = src.split('\n');
	const out = [];

	for (let i = 0; i < lines.length; i++) {
		const lineNum = i + 1;
		const trimmed = lines[i].trim();

		if (!trimmed || trimmed.startsWith('//')) {
			out.push(lines[i]);
			continue;
		}

		out.push(`window.__line=${lineNum};`);
		out.push(lines[i]);

		if (varNames.length > 0) {
			const caps = varNames
				.map(
					(n) =>
						`try{__v[${JSON.stringify(n)}]=typeof ${n}!=='undefined'?JSON.parse(JSON.stringify(${n})||'null'):undefined}catch(e){}`
				)
				.join('');
			out.push(`${caps}window.__capture(${lineNum},Object.assign({},__v));`);
		} else {
			out.push(`window.__capture(${lineNum},{});`);
		}
	}

	return out.join('\n');
}

// ── Step type classification ──────────────────────────────────────────────────

/** @type {Record<string, string>} */
export const STEP_COLORS = {
	declare:    '#cba6f7',
	assign:     '#89b4fa',
	log:        '#a6e3a1',
	branch:     '#f9e2af',
	loop:       '#fab387',
	function:   '#89dceb',
	return:     '#f38ba8',
	expression: '#6c7086'
};

/**
 * @param {string} lineText
 * @returns {keyof typeof STEP_COLORS}
 */
export function classifyStep(lineText) {
	const t = lineText.trim();
	if (/^(let|const|var)\s/.test(t)) return 'declare';
	if (/^console\.(log|warn|error|info)\s*\(/.test(t)) return 'log';
	if (/^if\s*\(/.test(t) || /^}\s*else/.test(t)) return 'branch';
	if (/^(for|while|do)\s*[\s({]/.test(t)) return 'loop';
	if (/^function\s/.test(t) || /^(const|let)\s+\w+\s*=\s*(\(|function)/.test(t)) return 'function';
	if (/^return\s/.test(t) || t === 'return') return 'return';
	if (/\w+\s*=[^=]/.test(t) && !/^(if|for|while|const|let|var)/.test(t)) return 'assign';
	return 'expression';
}

/** @param {unknown} v */
function fmtVal(v) {
	if (v === undefined) return 'undefined';
	if (v === null) return 'null';
	if (typeof v === 'string') return `"${v}"`;
	if (Array.isArray(v)) return JSON.stringify(v);
	if (typeof v === 'object') return '{…}';
	return String(v);
}

/**
 * Generates a plain-English explanation of a step.
 * @param {string} lineText
 * @param {Record<string,unknown>} prevVars
 * @param {Record<string,unknown>} currentVars
 * @returns {string}
 */
export function explainStep(lineText, prevVars, currentVars) {
	const t = lineText.trim();

	// let/const/var x = expr
	const declMatch = t.match(/^(?:let|const|var)\s+(\w+)\s*=\s*(.+)$/);
	if (declMatch) {
		const [, name] = declMatch;
		const val = currentVars[name];
		return `Created variable "${name}" with value ${fmtVal(val)}`;
	}
	// let/const/var x  (no initialiser)
	const declOnly = t.match(/^(?:let|const|var)\s+(\w+)\s*$/);
	if (declOnly) return `Declared variable "${declOnly[1]}"`;

	// x += / x -= / x++ / x--
	const augMatch = t.match(/^(\w+)\s*(\+\+|--|[+\-*/%]=)\s*(.*)$/);
	if (augMatch) {
		const [, name] = augMatch;
		const prev = prevVars[name];
		const curr = currentVars[name];
		if (prev !== undefined && curr !== undefined)
			return `Updated "${name}": ${fmtVal(prev)} → ${fmtVal(curr)}`;
	}
	// x = expr  (simple assignment)
	const assignMatch = t.match(/^(\w+)\s*=(?!=)\s*(.+)$/);
	if (assignMatch) {
		const [, name] = assignMatch;
		const prev = prevVars[name];
		const curr = currentVars[name];
		if (prev !== undefined) return `Changed "${name}": ${fmtVal(prev)} → ${fmtVal(curr)}`;
		return `Set "${name}" to ${fmtVal(curr)}`;
	}
	// console.log / warn / error
	if (/^console\.(log|warn|error|info)\s*\(/.test(t)) return 'Printed output to console';
	// if
	const ifMatch = t.match(/^if\s*\((.+)\)\s*\{?\s*$/);
	if (ifMatch) return `Checking: ${ifMatch[1]}`;
	// else / else if
	if (/^}\s*else\s+if\s*\(/.test(t)) return 'Checking else-if condition';
	if (/^}\s*else/.test(t)) return 'Taking the else branch';
	// for loop
	const forMatch = t.match(/^for\s*\(\s*(?:let|var|const)?\s*(\w+)\s*=\s*(\S+);\s*(.+);\s*(.+)\)/);
	if (forMatch) return `Loop: ${forMatch[1]} = ${forMatch[2]}, condition: ${forMatch[3]}`;
	if (/^for\s*\(/.test(t)) return 'Running loop iteration';
	// while
	const whileMatch = t.match(/^while\s*\((.+)\)/);
	if (whileMatch) return `While ${whileMatch[1]} is true`;
	// return
	const retMatch = t.match(/^return\s+(.+)$/);
	if (retMatch) return `Returning ${retMatch[1]}`;
	if (t === 'return') return 'Returning nothing (undefined)';
	// function declaration
	const fnMatch = t.match(/^function\s+(\w+)\s*\(/);
	if (fnMatch) return `Defining function "${fnMatch[1]}"`;
	// closing brace
	if (t === '}') return 'End of block';

	return 'Executing this line';
}

/** Maximum number of step events recorded before the tracer stops collecting. */
export const TRACE_STEP_LIMIT = 150;

/**
 * Builds an iframe srcdoc that runs instrumented code and collects a trace.
 * Posts { __traceMsg: true, events: TraceEvent[] } to window.parent on completion.
 *
 * @param {string} instrumentedCode  output of instrumentCode()
 * @returns {string}
 */
export function buildTracerSrcdoc(instrumentedCode) {
	const escaped = instrumentedCode.replace(/<\/script/gi, '<\\/script');

	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<script>
var __v = {};
(function() {
  window.__line = 0;
  window.__events = [];
  window.__stepCount = 0;
  window.__truncated = false;
  var __MAX = ${TRACE_STEP_LIMIT};

  window.__capture = function(line, vars) {
    if (window.__truncated) throw new Error('__TRACE_LIMIT__');
    if (window.__stepCount >= __MAX) {
      window.__truncated = true;
      window.__events.push({
        type: 'truncated',
        line: line,
        text: 'Loop too large — stopped after ' + __MAX + ' steps. Try a smaller range (e.g. i < 5 instead of i < 1000).'
      });
      throw new Error('__TRACE_LIMIT__');
    }
    window.__stepCount++;
    window.__events.push({ type: 'step', line: line, vars: vars });
  };

  function __sendLog(type, args) {
    var text = Array.from(args).map(function(a) {
      if (a === null) return 'null';
      if (a === undefined) return 'undefined';
      if (typeof a === 'object') {
        try { return JSON.stringify(a, null, 2); } catch(e) { return String(a); }
      }
      return String(a);
    }).join(' ');
    window.__events.push({ type: type, line: window.__line, text: text });
  }

  var origLog   = console.log.bind(console);
  var origError = console.error.bind(console);
  var origWarn  = console.warn.bind(console);
  var origInfo  = console.info.bind(console);
  console.log   = function() { __sendLog('log',   arguments); origLog.apply(console, arguments); };
  console.error = function() { __sendLog('error', arguments); origError.apply(console, arguments); };
  console.warn  = function() { __sendLog('warn',  arguments); origWarn.apply(console, arguments); };
  console.info  = function() { __sendLog('info',  arguments); origInfo.apply(console, arguments); };

  window.onerror = function(msg, src, line, col, err) {
    window.__events.push({ type: 'error', line: window.__line, text: err ? err.message : String(msg) });
    window.parent.postMessage({ __traceMsg: true, events: window.__events }, '*');
    return true;
  };
})();
<\/script>
<script>
try {
  ${escaped}
} catch(e) {
  if (!e || e.message !== '__TRACE_LIMIT__') {
    console.error(e && e.message ? e.message : String(e));
  }
}
window.parent.postMessage({ __traceMsg: true, events: window.__events }, '*');
<\/script>
</body>
</html>`;
}
