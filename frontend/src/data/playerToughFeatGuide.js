/**
 * playerToughFeatGuide.js
 * Player Mode: Tough feat — raw HP tank
 * Pure JS — no React dependencies.
 */

export const TOUGH_BASICS = {
  feat: 'Tough',
  source: 'Player\'s Handbook',
  effect: '+2 HP per level (retroactive). Current and future levels.',
  note: 'Simple but powerful. At L20: +40 HP. No other feat gives this much raw survivability. Best for frontliners and concentration casters.',
};

export const TOUGH_HP_BY_LEVEL = [
  { level: 1, bonus: 2 }, { level: 4, bonus: 8 }, { level: 5, bonus: 10 },
  { level: 8, bonus: 16 }, { level: 10, bonus: 20 }, { level: 12, bonus: 24 },
  { level: 15, bonus: 30 }, { level: 20, bonus: 40 },
];

export const TOUGH_CLASS_VALUE = [
  { class: 'Wizard/Sorcerer (d6)', priority: 'A', reason: '+40 HP on a d6 class = ~60% more HP. Huge for squishy casters.' },
  { class: 'Cleric/Druid (d8)', priority: 'A', reason: 'Frontline casters benefit from extra HP. Protect concentration.' },
  { class: 'Fighter (d10)', priority: 'B', reason: 'Fighters already have good HP. Other feats (GWM, PAM) add more combat power.' },
  { class: 'Barbarian (d12)', priority: 'C', reason: 'Barbarian already has most HP + Rage resistance. Diminishing returns.' },
];

export const TOUGH_VS_CON_ASI = {
  tough: { hpPerLevel: 2, saves: 'No change', ac: 'No change (Barbarian/Monk exception)', note: 'Pure HP.' },
  conASI: { hpPerLevel: 1, saves: '+1 CON saves (concentration)', ac: '+1 AC (Barbarian/Monk)', note: 'Less HP but better saves and possibly AC.' },
  verdict: 'Tough gives more HP. CON ASI gives less HP but better saves and AC. For concentration casters: CON ASI is often better. For raw tanking: Tough.',
};

export function toughBonusHP(characterLevel) {
  return characterLevel * 2;
}

export function toughVsConASI(characterLevel, currentCON) {
  const toughHP = characterLevel * 2;
  const conHP = characterLevel;
  const conSaveBonus = 1;
  return { toughHP, conHP, conSaveBonus, note: `Tough: +${toughHP} HP. CON+2: +${conHP} HP + ${conSaveBonus} to CON saves.` };
}
