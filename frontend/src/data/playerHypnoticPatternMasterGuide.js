/**
 * playerHypnoticPatternMasterGuide.js
 * Player Mode: Hypnotic Pattern — best L3 control spell
 * Pure JS — no React dependencies.
 */

export const HP_BASICS = {
  spell: 'Hypnotic Pattern',
  level: 3,
  school: 'Illusion',
  castTime: '1 action',
  duration: '1 minute (concentration)',
  range: '120 feet',
  area: '30ft cube',
  save: 'WIS save or charmed + incapacitated + speed 0.',
  classes: ['Wizard', 'Sorcerer', 'Bard', 'Warlock'],
  note: 'Best L3 control spell. Removes enemies from combat entirely. No repeated saves — only broken by damage or ally action.',
};

export const INCAPACITATED_EFFECTS = {
  effects: [
    'Can\'t take actions or reactions.',
    'Speed becomes 0.',
    'Charmed (can\'t attack the caster).',
    'Creature is unaware of surroundings.',
  ],
  breakConditions: [
    'Takes any damage.',
    'Another creature uses its action to shake them awake.',
  ],
  note: 'Unlike most save-or-suck spells, affected creatures do NOT get repeated saves. They stay affected until broken out.',
};

export const HP_TACTICS = [
  { tactic: 'Split the encounter', detail: 'HP some enemies, kill the rest, then deal with HP\'d group one at a time.', rating: 'S' },
  { tactic: 'Ignore HP\'d enemies', detail: 'Don\'t damage HP\'d creatures. Focus fire on free enemies. HP\'d ones stay out of the fight.', rating: 'S' },
  { tactic: 'AoE then HP', detail: 'Fireball first (damage). Then HP survivors (no repeated saves). Two-spell wipe.', rating: 'A' },
  { tactic: 'Long-range casting', detail: '120ft range. Cast from safety. Enemies can\'t reach you while incapacitated.', rating: 'A' },
  { tactic: 'Pre-combat HP', detail: 'If enemies don\'t see you: HP before initiative. Entire group potentially neutralized.', rating: 'S' },
];

export const HP_VS_ALTERNATIVES = {
  vsFear: { hpWins: 'HP fully incapacitates. Fear only forces dash away. HP has no repeated saves.', fearWins: 'Fear works on undead/constructs (WIS save). Fear doesn\'t break on damage.' },
  vsSlow: { hpWins: 'HP removes enemies completely. Slow just weakens them. HP is all-or-nothing but higher ceiling.', slowWins: 'Slow has no save to break. Affects all targets partially. More reliable vs high-WIS groups.' },
  vsStinkingCloud: { hpWins: 'HP incapacitates fully. Stinking Cloud is CON save (enemies tend to pass). HP is cleaner.', scWins: 'Stinking Cloud blocks line of sight. CON save repeated each turn gives more chances.' },
};

export const HP_WARNINGS = [
  'Friendly fire: 30ft cube affects ALLIES too. Position carefully or warn the party.',
  'Single damage point breaks it: even 1 fire damage from a torch frees a creature.',
  'Charmed immunity: elves have advantage on charm saves. Some creatures immune.',
  'Concentration: losing concentration frees ALL affected creatures simultaneously.',
  'Don\'t use on one big enemy: one target = one save = coin flip. Use on groups.',
];

export function hpAffectedCount(totalEnemies, avgWisSave, saveDC) {
  const failChance = Math.max(0.05, Math.min(0.95, (saveDC - avgWisSave) / 20));
  const expectedFails = Math.round(totalEnemies * failChance);
  return { affected: expectedFails, total: totalEnemies, note: `~${expectedFails}/${totalEnemies} enemies expected to fail DC ${saveDC} save.` };
}
