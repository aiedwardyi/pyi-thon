export function formatHintText(hint) {
  if (typeof hint !== "string") return "";
  return hint.replace(/\\n/g, "\n");
}
