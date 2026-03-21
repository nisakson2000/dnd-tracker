/**
 * playerResilientFeatGuide.js
 * Player Mode: Resilient feat — the save booster
 * Pure JS — no React dependencies.
 */

export const RESILIENT_BASICS = {
  feat: 'Resilient',
  source: 'Player\'s Handbook',
  effect: 'Choose one ability: +1 to that score, gain proficiency in saving throws with that ability.',
  note: 'Simple but powerful. +1 to ability + save proficiency. Best used for CON (concentration) or WIS (mental defense).',
};

export const RESILIENT_OPTIONS = [
  { ability: 'CON', bestFor: 'Any caster relying on concentration', value: 'S', note: 'Concentration saves are CON-based. Proficiency scales with level. Better than War Caster at high levels.' },
  { ability: 'WIS', bestFor: 'Martials (Fighter, Barbarian, Rogue) who fail WIS saves', value: 'S', note: 'WIS saves are the most common dangerous save. Charm, fear, Hold Person. Essential for front-liners.' },
  { ability: 'DEX', bestFor: 'Heavy armor users with low DEX', value: 'A', note: 'Fireball, Lightning Bolt, traps. Good but DEX save proficiency is less impactful with heavy armor (low DEX mod).' },
  { ability: 'CHA', bestFor: 'Fighters/Rogues facing Banishment', value: 'B', note: 'Banishment is the main CHA save threat. Niche but can be important vs extraplanar enemies.' },
  { ability: 'INT', bestFor: 'Against Mind Flayers', value: 'C', note: 'Very niche. Only if your campaign features heavy INT save threats.' },
  { ability: 'STR', bestFor: 'Almost never', value: 'D', note: 'STR saves are rare. Almost never worth the feat investment.' },
];

export const RESILIENT_CON_MATH = {
  dc10: [
    { level: 1, withoutProf: '55%', withProf: '65%', note: '+2 proficiency at L1' },
    { level: 5, withoutProf: '55%', withProf: '70%', note: '+3 proficiency at L5' },
    { level: 9, withoutProf: '55%', withProf: '75%', note: '+4 proficiency at L9' },
    { level: 13, withoutProf: '55%', withProf: '80%', note: '+5 proficiency at L13' },
    { level: 17, withoutProf: '55%', withProf: '85%', note: '+6 proficiency at L17' },
  ],
  note: 'Based on +2 CON mod. Proficiency scales linearly. At high levels, Resilient is better than War Caster\'s advantage.',
};

export function resilientSaveBonus(abilityMod, proficiencyBonus) {
  return abilityMod + proficiencyBonus;
}

export function saveChanceComparison(abilityMod, profBonus, dc) {
  const without = Math.min(0.95, Math.max(0.05, (abilityMod + 20 - dc) / 20));
  const with_ = Math.min(0.95, Math.max(0.05, (abilityMod + profBonus + 20 - dc) / 20));
  return { withoutProf: Math.round(without * 100), withProf: Math.round(with_ * 100), improvement: Math.round((with_ - without) * 100) };
}
