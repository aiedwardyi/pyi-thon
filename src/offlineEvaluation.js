export function buildDiffFeedback(actual, expected, t) {
  const aLines = actual.split("\n");
  const eLines = expected.split("\n");
  const hints = [];

  const minLen = Math.min(aLines.length, eLines.length);
  for (let i = 0; i < minLen; i++) {
    if (aLines[i] !== eLines[i]) {
      hints.push(
        t("offlineLineDiff")
          .replace("{line}", i + 1)
          .replace("{got}", aLines[i])
          .replace("{exp}", eLines[i])
      );
      break;
    }
  }

  if (aLines.length > eLines.length) {
    hints.push(t("offlineExtraLines").replace("{n}", aLines.length - eLines.length));
  } else if (aLines.length < eLines.length) {
    hints.push(t("offlineMissingLines").replace("{n}", eLines.length - aLines.length));
  }

  return hints.join(" ");
}

export function buildSampleInputNote(sampleInput, t) {
  if (!sampleInput) return "";
  return `${t("offlineInputMismatch")}\n\n${t("sampleInputUsed")}:\n${sampleInput}`;
}

export function buildMismatchFeedback({ actual, expected, sampleInput, t, prefix }) {
  const sections = [prefix];
  const sampleInputNote = buildSampleInputNote(sampleInput, t);
  const diff = buildDiffFeedback(actual, expected, t);

  if (sampleInputNote) sections.push(sampleInputNote);
  if (diff) sections.push(diff);

  return sections.filter(Boolean).join("\n\n");
}
