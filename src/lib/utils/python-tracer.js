/**
 * Python step-through tracer via sys.settrace + Wandbox.
 *
 * buildPythonTracerCode wraps user code in a harness that:
 *  - intercepts every line event via sys.settrace
 *  - overrides print() to capture log events
 *  - writes a JSON trace to stderr prefixed by __TRACE__
 *
 * parsePythonTrace extracts that JSON from the Wandbox stderr string.
 */

export const PYTHON_STEP_LIMIT = 500;

const TRACE_SENTINEL = '__TRACE__';

/**
 * Wraps user Python code in a sys.settrace tracing harness.
 * @param {string} userCode
 * @returns {string}  complete Python program to send to Wandbox (cpython-head)
 */
export function buildPythonTracerCode(userCode) {
	// JSON.stringify gives a valid Python double-quoted string literal
	// (JSON escape sequences are a superset of what Python double-quotes need)
	const escapedCode = JSON.stringify(userCode);
	const limit = PYTHON_STEP_LIMIT;

	// Build line-by-line to avoid template-literal interpolation inside Python strings
	return [
		'import sys as __sys, json as __json, builtins as __builtins_mod',
		'',
		'__events = []',
		'__state = {"steps": 0}',
		`__MAX = ${limit}`,
		'',
		'def __tracer(frame, event, arg):',
		'    if event != "line" or frame.f_code.co_filename != "<user>":',
		'        return __tracer',
		'    if __state["steps"] >= __MAX:',
		'        __events.append({"type": "truncated"})',
		'        __sys.settrace(None)',
		'        return None',
		'    __state["steps"] += 1',
		'    __locals = {}',
		'    for k, v in frame.f_locals.items():',
		'        if k.startswith("__"):',
		'            continue',
		'        try:',
		'            if isinstance(v, bool) or v is None:',
		'                __locals[k] = v',
		'            elif isinstance(v, (int, float)):',
		'                __locals[k] = v',
		'            elif isinstance(v, str):',
		'                __locals[k] = v[:200]',
		'            elif isinstance(v, (list, tuple)):',
		'                __locals[k] = list(v[:20])',
		'            elif isinstance(v, dict):',
		'                __locals[k] = {str(kk): repr(vv)[:50] for kk, vv in list(v.items())[:10]}',
		'            else:',
		'                __locals[k] = repr(v)[:100]',
		'        except Exception:',
		'            pass',
		'    __events.append({"type": "step", "line": frame.f_lineno, "vars": __locals})',
		'    return __tracer',
		'',
		'__orig_print = __builtins_mod.print',
		'def __traced_print(*args, **kwargs):',
		'    text = " ".join(str(a) for a in args)',
		'    __events.append({"type": "log", "text": text})',
		'    __orig_print(*args, **kwargs)',
		'',
		`__compiled = compile(${escapedCode}, "<user>", "exec")`,
		'__globals = {"__builtins__": __builtins_mod, "print": __traced_print}',
		'__sys.settrace(__tracer)',
		'try:',
		'    exec(__compiled, __globals)',
		'except Exception as __e:',
		'    __events.append({"type": "error", "line": 0, "text": str(__e)})',
		'finally:',
		'    __sys.settrace(None)',
		'',
		'__sys.stderr.write("__TRACE__" + __json.dumps(__events))',
	].join('\n');
}

/**
 * Extracts and parses the trace JSON from Wandbox stderr.
 * Returns [] if the sentinel isn't found (compile error, etc.).
 * @param {string} stderr
 * @returns {Array<{type:string, line?:number, vars?:Record<string,any>, text?:string}>}
 */
export function parsePythonTrace(stderr) {
	const idx = (stderr ?? '').indexOf(TRACE_SENTINEL);
	if (idx === -1) return [];
	try {
		return JSON.parse(stderr.slice(idx + TRACE_SENTINEL.length));
	} catch {
		return [];
	}
}
