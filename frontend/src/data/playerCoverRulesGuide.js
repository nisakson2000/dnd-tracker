/**
 * playerCoverRulesGuide.js
 * Player Mode: Cover rules, types, and tactical use
 * Pure JS — no React dependencies.
 */

export const COVER_TYPES = [
  { type: 'Half Cover', acBonus: 2, dexSaveBonus: 2, examples: ['Low wall', 'Furniture', 'Another creature', 'Thin tree'], note: 'Most common cover. +2 AC and DEX saves. Creatures provide half cover!' },
  { type: 'Three-Quarters Cover', acBonus: 5, dexSaveBonus: 5, examples: ['Arrow slit', 'Thick tree trunk', 'Portcullis'], note: '+5 AC and DEX saves. Very hard to hit targets behind 3/4 cover.' },
  { type: 'Total Cover', acBonus: 'Can\'t be targeted', dexSaveBonus: 'N/A', examples: ['Solid wall', 'Closed door', 'Around a corner'], note: 'Can\'t be targeted at all. Most spells require line of sight. Hide behind total cover.' },
];

export const COVER_RULES = {
  directionMatters: 'Cover is relative to the attacker. You might have cover from one direction but not another.',
  creaturesCover: 'Creatures (friendly or hostile) provide half cover to targets behind them. RAW: your ally shields you.',
  coverAndSpells: 'Most spells require you to SEE the target. Total cover = can\'t see = can\'t target. AoE spells still work if area reaches you.',
  sharpshooterIgnores: 'Sharpshooter feat: ignore half and three-quarters cover. Only total cover blocks you.',
  sacredFlameIgnores: 'Sacred Flame: target gains no benefit from cover. One of the few spells that explicitly ignores cover.',
  spellSniper: 'Spell Sniper feat: ignore half and three-quarters cover on spell attacks.',
};

export const COVER_TACTICS = [
  { tactic: 'Shoot from behind allies', detail: 'Your ally provides half cover to you against enemies. Stand behind your Fighter. +2 AC for free.', rating: 'A' },
  { tactic: 'Duck behind walls', detail: 'Move out, attack, move back behind total cover. Enemies can\'t target you on their turn.', rating: 'S' },
  { tactic: 'Overturned table', detail: 'Tip a table for half cover (+2 AC). Common in tavern fights. Ask your DM if you can do this.', rating: 'B' },
  { tactic: 'Arrow slits', detail: 'Fire from arrow slits: 3/4 cover (+5 AC). Enemy ranged attacks are at -5 effective. Sharpshooter ignores.', rating: 'A' },
  { tactic: 'Prone + ranged', detail: 'Prone gives disadvantage to ranged attacks at you (beyond 5ft). Combined with cover = very hard to hit.', rating: 'B', note: 'But ranged attacks FROM prone have disadvantage. Not great for archers.' },
  { tactic: 'Shield spell + cover', detail: 'Half cover (+2) + Shield spell (+5) = +7 AC. Very hard to hit for one round.', rating: 'S' },
];

export function acWithCover(baseAC, coverType) {
  const bonuses = { none: 0, half: 2, threeQuarters: 5, total: Infinity };
  return baseAC + (bonuses[coverType] || 0);
}

export function dexSaveWithCover(baseSave, coverType) {
  const bonuses = { none: 0, half: 2, threeQuarters: 5 };
  return baseSave + (bonuses[coverType] || 0);
}
