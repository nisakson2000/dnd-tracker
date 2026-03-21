/**
 * playerCoverMechanics.js
 * Player Mode: Cover rules, tactical usage, and positioning
 * Pure JS — no React dependencies.
 */

export const COVER_TYPES = [
  { type: 'Half Cover', acBonus: 2, dexSaveBonus: 2, examples: ['Low wall', 'Furniture', 'Creature (ally or enemy)', 'Narrow tree trunk'], rule: 'At least half the target is behind the obstacle.' },
  { type: 'Three-Quarters Cover', acBonus: 5, dexSaveBonus: 5, examples: ['Arrow slit', 'Thick tree trunk', 'Portcullis', 'Overturned cart'], rule: 'At least three-quarters of the target is behind the obstacle.' },
  { type: 'Full Cover', acBonus: 'Untargetable', dexSaveBonus: 'Auto-succeed (most)', examples: ['Complete wall', 'Closed door', 'Pillar (if fully behind)'], rule: 'Completely concealed. Can\'t be targeted directly. AoE may still reach around.' },
];

export const COVER_TACTICS = [
  { tactic: 'Peek and shoot', description: 'Step out of full cover, attack, step back. Uses movement but keeps you safe between turns.', effectiveness: 'S' },
  { tactic: 'Use allies as cover', description: 'RAW, other creatures provide half cover. Stand behind your tank.', effectiveness: 'A', note: 'Some DMs disallow this or it also blocks your shots.' },
  { tactic: 'Create your own cover', description: 'Mold Earth, Wall spells, overturning tables. Create cover where none exists.', effectiveness: 'A' },
  { tactic: 'Deny enemy cover', description: 'Flank around, use AoE that ignores cover, or destroy the cover.', effectiveness: 'A' },
  { tactic: 'Arrow slit defense', description: 'Three-quarters cover (+5 AC) while shooting through a slit. Fortress defense.', effectiveness: 'S' },
  { tactic: 'Mobile cover', description: 'Shield spell (+5 AC) is like carrying cover with you. Shield Master adds AC to DEX saves.', effectiveness: 'A' },
];

export const COVER_IGNORING = [
  { source: 'Sharpshooter feat', effect: 'Ignores half and three-quarters cover for ranged attacks', type: 'Feat' },
  { source: 'Spell Sniper feat', effect: 'Ignores half and three-quarters cover for spell attacks', type: 'Feat' },
  { source: 'Sacred Flame', effect: 'Target gains no benefit from cover for DEX save', type: 'Cantrip' },
  { source: 'AoE spells behind cover', effect: 'Fireball, Shatter, etc. can go around corners if path exists', type: 'Spell' },
  { source: 'Line spells', effect: 'Lightning Bolt, etc. only blocked if cover is between you and target in a line', type: 'Spell' },
  { source: 'Destroying cover', effect: 'Break the wall, burn the table. No more cover.', type: 'Creative' },
];

export const COVER_MISTAKES = [
  'Forgetting cover applies to DEX saves too, not just AC',
  'Not using creatures as half cover (RAW rule often overlooked)',
  'Assuming full cover blocks AoE — if the AoE can path around the cover, it still hits',
  'Ignoring that YOU also benefit from cover against ranged enemies',
  'Staying in the open when cover is 5 feet away — move!',
  'Forgetting prone gives "cover" against ranged (disadvantage at range)',
];

export const CONCEALMENT_VS_COVER = {
  cover: 'Physical barrier. Blocks attacks. Provides AC and DEX save bonus.',
  concealment: 'Visual obstruction (fog, darkness, heavy rain). Makes you unseen but doesn\'t block attacks.',
  key: 'Cover = physical protection. Concealment = hard to see. You can have one without the other.',
  examples: [
    { situation: 'Behind a glass wall', cover: 'Full (attacks blocked)', concealment: 'None (visible)' },
    { situation: 'In magical darkness', cover: 'None', concealment: 'Full (heavily obscured)' },
    { situation: 'Behind a stone pillar', cover: 'Full or three-quarters', concealment: 'Also hidden from sight' },
    { situation: 'In light fog', cover: 'None', concealment: 'Lightly obscured (disadvantage on Perception)' },
  ],
};

export function getCoverBonus(coverType) {
  const cover = COVER_TYPES.find(c =>
    c.type.toLowerCase().includes((coverType || '').toLowerCase())
  );
  return cover || null;
}

export function effectiveAC(baseAC, coverType, hasShield) {
  const coverBonus = coverType === 'half' ? 2 : coverType === 'three-quarters' ? 5 : 0;
  return baseAC + coverBonus;
}
