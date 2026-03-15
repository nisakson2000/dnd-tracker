const VALID_RULESETS = ["5e-2014", "5e-2024"];

export function normalizeRuleset(r) {
  if (!r) return "5e-2014";
  const cleaned = String(r).toLowerCase().replace(/^dnd/, "").trim();
  return VALID_RULESETS.includes(cleaned) ? cleaned : "5e-2014";
}

export function rulesetMatch(a, b) {
  return normalizeRuleset(a) === normalizeRuleset(b);
}

export function rulesetLabel(r) {
  return normalizeRuleset(r).replace("-", " ");
}
