const INDENT = "    ";

export function indentOnEnter(code, start, end) {
  const before = code.slice(0, start);
  const after = code.slice(end);
  const line = before.slice(before.lastIndexOf("\n") + 1);
  const indent = line.match(/^[ \t]*/)[0];
  const extra = !line.trimStart().startsWith("#") && /:\s*(#.*)?$/.test(line.trimEnd()) ? INDENT : "";
  const inserted = `\n${indent}${extra}`;

  return {
    code: `${before}${inserted}${after}`,
    cursor: before.length + inserted.length,
  };
}
