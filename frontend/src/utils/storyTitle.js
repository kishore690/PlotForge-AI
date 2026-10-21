export function createStoryTitle(prompt, maxLength = 56) {
  const cleanPrompt = String(prompt || "").trim().replace(/\s+/g, " ");
  if (cleanPrompt.length <= maxLength) return cleanPrompt;

  const preview = cleanPrompt.slice(0, maxLength - 1);
  const lastWordBoundary = preview.lastIndexOf(" ");
  const safeEnd = lastWordBoundary > Math.floor(maxLength * 0.55) ? lastWordBoundary : preview.length;
  return `${preview.slice(0, safeEnd).trimEnd()}…`;
}

export function getDisplayStoryTitle(title, prompt) {
  const safeTitle = String(title || "").trim();
  const safePrompt = String(prompt || "").trim().replace(/\s+/g, " ");
  const wasCutMidWord = safeTitle && safePrompt.startsWith(safeTitle) && /\S/.test(safePrompt[safeTitle.length] || "");
  if (wasCutMidWord) return createStoryTitle(safePrompt);
  return safeTitle || "Untitled Story";
}
