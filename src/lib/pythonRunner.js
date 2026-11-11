const LOOP_MESSAGE = "Infinite loop detected! Check your while loop - make sure the condition will eventually become False (e.g., increment your counter variable).";

let pyodide = null;
let loading = null;

export function loadPyodideRuntime() {
  if (pyodide) return Promise.resolve(pyodide);
  if (!loading) {
    loading = window.loadPyodide()
      .then((runtime) => { pyodide = runtime; return runtime; })
      .catch((error) => { loading = null; throw error; });
  }
  return loading;
}

export async function runPython(code, simulatedInput, variables = {}) {
  const py = await loadPyodideRuntime();
  const inputs = simulatedInput ? simulatedInput.split("\n") : [];
  py.runPython(`
import sys, io
_captured_output = io.StringIO()
sys.stdout = _captured_output
_input_values = ${JSON.stringify(inputs)}
_input_index = 0
def input(prompt=""):
    global _input_index
    if _input_index < len(_input_values):
        val = _input_values[_input_index]
        _input_index += 1
        return val
    return ""
__builtins__.input = input
`);
  const captured = () => {
    try { return py.runPython("_captured_output.getvalue()").trimEnd(); } catch { return ""; }
  };
  const scope = py.toPy(variables);
  try {
    if (Object.keys(variables).length) {
      const context = py.toPy({ source: code, values: variables });
      try {
        code = py.runPython(`
import ast
tree = ast.parse(source)
pending = dict(values)
for node in tree.body:
    target = node.targets[0] if isinstance(node, ast.Assign) and len(node.targets) == 1 else node.target if isinstance(node, ast.AnnAssign) else None
    if isinstance(target, ast.Name) and target.id in pending:
        node.value = ast.Constant(value=pending.pop(target.id))
ast.unparse(ast.fix_missing_locations(tree))
`, { globals: context });
      } finally {
        context.destroy();
      }
    }
    // Loop guard: stops runaway loops before they freeze the tab.
    py.runPython(`
import sys
sys.settrace(None)
_loop_limit = 100000
_original_trace = sys.gettrace()
_loop_counter = 0
def _loop_guard(frame, event, arg):
    global _loop_counter
    if event == 'line':
        _loop_counter += 1
        if _loop_counter > _loop_limit:
            raise RuntimeError("Infinite loop detected - your code executed over 100,000 lines. Check your loops and make sure they will eventually stop.")
    return _loop_guard
sys.settrace(_loop_guard)
`);
    py.runPython(code, { globals: scope });
    py.runPython(`
_sys = __import__('sys')
_sys.settrace(_original_trace if '_original_trace' in dir() else None)
_sys.stdout = _sys.__stdout__
`);
    return { success: true, output: captured(), errorText: null };
  } catch (err) {
    try {
      py.runPython(`
_sys = __import__('sys')
_sys.settrace(None)
if hasattr(_sys, '__stdout__'):
    _sys.stdout = _sys.__stdout__
`);
    } catch {}
    const msg = err.message || String(err);
    if (msg.includes("Infinite loop detected")) return { success: false, output: captured(), error: LOOP_MESSAGE, errorText: LOOP_MESSAGE };
    const lines = msg.split("\n");
    const pyErr = lines.filter((line) => line.match(/Error:|error:/i)).pop() || lines[lines.length - 1] || msg;
    return { success: false, output: captured(), error: pyErr.trim(), errorText: msg };
  } finally {
    scope.destroy();
  }
}

export async function runRep(code, rep) {
  const result = await runPython(code, rep.simulatedInput || "");
  const checks = [];
  if (!result.errorText && result.output.trimEnd() === rep.expectedOutput.trimEnd()) {
    for (const test of rep.cases || []) {
      const check = await runPython(code, rep.simulatedInput || "", test.variables);
      checks.push({ ...test, ...check });
      if (check.errorText || check.output.trimEnd() !== test.expectedOutput) break;
    }
  }
  return { ...result, checks };
}
