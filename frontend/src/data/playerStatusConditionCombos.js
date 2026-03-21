/**
 * playerStatusConditionCombos.js
 * Player Mode: Condition combos and stacking effects for maximum control
 * Pure JS — no React dependencies.
 */

export const CONDITION_COMBOS = [
  { combo: 'Prone + Grappled', effects: ['Can\'t stand up (grapple = speed 0)', 'Melee attacks have advantage', 'Ranged attacks have disadvantage', 'Effectively pinned'], setup: 'Shove prone → Grapple. Enemy can\'t stand. Melee allies feast.', rating: 'S' },
  { combo: 'Paralyzed + Melee', effects: ['Auto-crit from within 5ft', 'Auto-fail STR and DEX saves', 'Attack rolls have advantage'], setup: 'Hold Person/Monster → melee allies auto-crit. Paladin Smite crits = devastating.', rating: 'S' },
  { combo: 'Blinded + Deafened', effects: ['Can\'t see (attacks have disadvantage, attacks against have advantage)', 'Can\'t hear (immune to thunder? no — just can\'t perceive)', 'Can\'t target most spells'], setup: 'Blindness/Deafness spell targets both (2nd level, no concentration).', rating: 'A' },
  { combo: 'Restrained + Focus Fire', effects: ['Speed 0', 'Attacks against have advantage', 'Attacks by restrained have disadvantage', 'Disadvantage on DEX saves'], setup: 'Web, Entangle, Net, or grapple-based. Party focuses restrained target.', rating: 'A' },
  { combo: 'Frightened + Difficult Terrain', effects: ['Can\'t move toward fear source', 'Disadvantage on attacks while source visible', 'Difficult terrain slows escape'], setup: 'Cause fear + Spike Growth behind them. They flee through damage.', rating: 'A' },
  { combo: 'Stunned + Everything', effects: ['Incapacitated (can\'t act)', 'Auto-fail STR and DEX saves', 'Attacks have advantage', 'Can\'t take reactions'], setup: 'Stunning Strike (Monk). Then everyone attacks with advantage.', rating: 'S' },
  { combo: 'Exhaustion Stacking', effects: ['Level 1: disadvantage on checks', 'Level 2: speed halved', 'Level 3: disadvantage on attacks/saves', 'Level 6: death'], setup: 'Sickening Radiance (4th level): CON save or gain exhaustion. In an enclosed area = TPK potential.', rating: 'A' },
  { combo: 'Incapacitated + Coup de Grace', effects: ['Can\'t take actions or reactions', 'Auto-hit from melee (DM dependent)', 'Can\'t defend themselves'], setup: 'Sleep, Tasha\'s Hideous Laughter, or other incapacitation → melee finishers.', rating: 'A' },
];

export const CONDITION_SEVERITY = [
  { condition: 'Paralyzed', severity: 10, reason: 'Auto-crit, auto-fail saves, can\'t act. Worst non-death condition.' },
  { condition: 'Stunned', severity: 9, reason: 'Same as paralyzed but no auto-crit. Still devastating.' },
  { condition: 'Petrified', severity: 10, reason: 'Effectively removed from combat. Resistant to damage. Permanent until cured.' },
  { condition: 'Unconscious', severity: 9, reason: 'Helpless. Auto-crit from 5ft. Auto-fail STR/DEX saves. Probably dying.' },
  { condition: 'Restrained', severity: 6, reason: 'Can still act but with disadvantage. Attacks against have advantage.' },
  { condition: 'Frightened', severity: 5, reason: 'Can\'t approach source. Disadvantage on attacks while seeing source.' },
  { condition: 'Blinded', severity: 7, reason: 'Can\'t see. Disadvantage on attacks. Attacks against have advantage.' },
  { condition: 'Charmed', severity: 5, reason: 'Can\'t attack charmer. Charmer has advantage on social checks.' },
  { condition: 'Poisoned', severity: 3, reason: 'Disadvantage on attacks and ability checks. Common but not devastating.' },
  { condition: 'Prone', severity: 2, reason: 'Easy to stand from (half movement). Advantage for melee, disadvantage for ranged.' },
];

export const SAVE_OR_SUCK_TIER_LIST = [
  { spell: 'Hold Person/Monster', level: '2/5', save: 'WIS', effect: 'Paralyzed', rating: 'S', reason: 'Auto-crit + can\'t act. Party obliterates the target.' },
  { spell: 'Hypnotic Pattern', level: 3, save: 'WIS', effect: 'Incapacitated', rating: 'S', reason: '30ft cube. Multiple targets. No repeat saves without being shaken.' },
  { spell: 'Banishment', level: 4, save: 'CHA', effect: 'Removed from combat', rating: 'S', reason: 'Target disappears for up to 1 minute. Fight 1 fewer enemy.' },
  { spell: 'Polymorph', level: 4, save: 'WIS', effect: 'Transformed', rating: 'S', reason: 'Turn enemy into a snail. Or ally into Giant Ape. Incredibly versatile.' },
  { spell: 'Wall of Force', level: 5, save: 'None', effect: 'Battlefield split', rating: 'S', reason: 'NO SAVE. Indestructible. Divide and conquer.' },
  { spell: 'Web', level: 2, save: 'DEX', effect: 'Restrained', rating: 'A', reason: 'Large area, difficult terrain, restrained. Very efficient for 2nd level.' },
  { spell: 'Entangle', level: 1, save: 'STR', effect: 'Restrained', rating: 'A', reason: '1st level! Restrains in 20ft square. Great early-game control.' },
];

export function getConditionCombo(condition1, condition2) {
  return CONDITION_COMBOS.find(c =>
    c.combo.toLowerCase().includes((condition1 || '').toLowerCase()) &&
    c.combo.toLowerCase().includes((condition2 || '').toLowerCase())
  ) || null;
}

export function getConditionSeverity(condition) {
  const entry = CONDITION_SEVERITY.find(c =>
    c.condition.toLowerCase() === (condition || '').toLowerCase()
  );
  return entry ? entry.severity : 0;
}

export function getTopControlSpells(maxLevel) {
  return SAVE_OR_SUCK_TIER_LIST.filter(s => {
    const lvl = typeof s.level === 'number' ? s.level : parseInt(s.level);
    return lvl <= maxLevel;
  });
}
