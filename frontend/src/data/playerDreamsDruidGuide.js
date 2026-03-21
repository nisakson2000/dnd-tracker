/**
 * playerDreamsDruidGuide.js
 * Player Mode: Circle of Dreams Druid — the fey healer
 * Pure JS — no React dependencies.
 */

export const DREAMS_BASICS = {
  class: 'Druid (Circle of Dreams)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Feywild-connected healer. Bonus action healing without spell slots.',
  note: 'Excellent healing Druid. Balm of the Summer Court provides bonus action healing similar to Healing Word but uses a separate resource.',
};

export const DREAMS_FEATURES = [
  { feature: 'Balm of the Summer Court', level: 2, effect: 'Bonus action: heal a creature within 120ft. Spend d6s (up to half Druid level, pool = Druid level d6s). Target also gains 1 temp HP per d6 spent.', note: 'Bonus action, 120ft range, uses a d6 pool (not spell slots). Free healing on top of your spellcasting.' },
  { feature: 'Hearth of Moonlight and Shadow', level: 6, effect: 'During a rest: create 30ft sphere. +5 to Stealth/Perception, light doesn\'t shine past sphere. Comfortable rest in any environment.', note: 'Safe resting zone. +5 Stealth for the camp. Light doesn\'t leak. Great for wilderness campaigns.' },
  { feature: 'Hidden Paths', level: 10, effect: 'Bonus action: teleport self 60ft to space you can see. OR action: teleport willing creature within 5ft to visible space within 30ft. WIS mod times/long rest.', note: 'Free teleportation. 60ft self-teleport or 30ft ally teleport. No spell slot, no spell components.' },
  { feature: 'Walker in Dreams', level: 14, effect: 'Cast Dream, Scrying, or Teleportation Circle once each per long rest (no material components for any).', note: 'Three powerful spells for free daily. Teleportation Circle for travel. Scrying for info. Dream for communication.' },
];

export const BALM_HEALING_ANALYSIS = {
  atLevel2: { pool: '2d6', maxPerUse: '1d6', avgTotal: 7, note: 'Small pool but it\'s free and doesn\'t use spell slots.' },
  atLevel6: { pool: '6d6', maxPerUse: '3d6', avgTotal: 21, note: 'Significant healing pool. 3d6+3 temp HP per use.' },
  atLevel10: { pool: '10d6', maxPerUse: '5d6', avgTotal: 35, note: '5d6 healing + 5 temp HP. Substantial burst heal.' },
  atLevel20: { pool: '20d6', maxPerUse: '10d6', avgTotal: 70, note: 'Massive healing pool. 10d6+10 per use.' },
  note: 'This is ON TOP of your normal Druid spellcasting. You still have Healing Word, Cure Wounds, etc.',
};

export const DREAMS_TACTICS = [
  { tactic: 'Bonus action healing + spell', detail: 'Turn: cast a full spell (Fireball, Call Lightning) + bonus action Balm of the Summer Court to heal an ally. Healing without sacrificing offense.', rating: 'S', note: 'Other Druids must choose: spell OR Healing Word. You do both.' },
  { tactic: '120ft heal range', detail: 'Balm range is 120ft. Heal from way behind the front line. Safer than any other healing option.', rating: 'A' },
  { tactic: 'Hidden Paths escape', detail: 'L10: teleport 60ft as bonus action. Escape grapples, restraints, surrounded positions.', rating: 'A' },
  { tactic: 'Safe camp', detail: 'L6: +5 Stealth/Perception for the camp. Light doesn\'t leak. Almost impossible to be ambushed during rest.', rating: 'A' },
];

export const DREAMS_VS_SHEPHERD = {
  dreams: { pros: ['Bonus action heal (separate from spells)', '120ft heal range', 'Free teleportation (L10)', 'Safe resting'], cons: ['No summoning boost', 'Less combat impact', 'Healing focus'] },
  shepherd: { pros: ['Best summoner in game', 'Spirit Totems (party buffs)', 'Mighty Summoner (+HP/magical)', 'Army of creatures'], cons: ['Slow combat (many creatures)', 'No free healing pool', 'Concentration-dependent'] },
  verdict: 'Dreams for healing-focused Druid. Shepherd for summoning-focused. Both fill different roles.',
};

export function balmPoolSize(druidLevel) {
  return druidLevel; // d6s in pool
}

export function balmMaxPerUse(druidLevel) {
  return Math.floor(druidLevel / 2); // Max d6s per use
}

export function balmAvgHealing(d6sSpent) {
  return d6sSpent * 3.5; // Average healing
}

export function balmTempHP(d6sSpent) {
  return d6sSpent; // 1 temp HP per d6 spent
}
