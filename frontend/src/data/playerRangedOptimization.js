/**
 * playerRangedOptimization.js
 * Player Mode: Ranged combat optimization — bows, crossbows, and ranged builds
 * Pure JS — no React dependencies.
 */

export const RANGED_WEAPONS = [
  { weapon: 'Longbow', damage: '1d8', range: '150/600', properties: 'Ammunition, heavy, two-handed', note: 'Best default ranged weapon. High damage, huge range.' },
  { weapon: 'Hand Crossbow', damage: '1d6', range: '30/120', properties: 'Ammunition, light, loading', note: 'CBE ignores loading. Bonus action attack with CBE feat.' },
  { weapon: 'Heavy Crossbow', damage: '1d10', range: '100/400', properties: 'Ammunition, heavy, loading, two-handed', note: 'Highest damage ranged. Loading means 1 attack/turn without CBE.' },
  { weapon: 'Shortbow', damage: '1d6', range: '80/320', properties: 'Ammunition, two-handed', note: 'No heavy property. Usable by Small races without penalty.' },
  { weapon: 'Dart', damage: '1d4', range: '20/60', properties: 'Finesse, thrown', note: 'Finesse thrown. Can use DEX. Free hand needed.' },
  { weapon: 'Javelin', damage: '1d6', range: '30/120', properties: 'Thrown', note: 'STR-based thrown. Paladins can Smite on thrown javelins.' },
];

export const SHARPSHOOTER_FEAT = {
  effects: [
    '-5 to attack roll, +10 to damage.',
    'Ignore half and three-quarters cover.',
    'No disadvantage at long range.',
  ],
  math: {
    breakEven: 'Need roughly 65%+ hit chance before SS penalty for it to be positive DPR.',
    withArchery: 'Archery Fighting Style (+2) offsets half the penalty. +2 hit = only net -3.',
    withBless: 'Bless (+1d4 avg +2.5) further offsets. SS becomes nearly free damage.',
    withAdvantage: 'Advantage offsets -5 easily. Elven Accuracy + advantage = SS is always worth it.',
  },
};

export const CBE_SS_BUILD = {
  combo: 'Crossbow Expert + Sharpshooter',
  level5: '3 attacks/turn: 2 (Extra Attack) + 1 (CBE bonus action hand crossbow)',
  damage: '3 × (1d6 + DEX + 10) = 3 × 17.5 = 52.5 avg DPR (with SS, Archery, 16 DEX)',
  whyHandCrossbow: 'Hand crossbow + CBE = bonus action attack. Longbow has no bonus action attack.',
  buildPath: [
    'L1 V.Human: CBE',
    'L4: SS',
    'L5: Extra Attack (3 attacks/turn)',
    'L6 (Fighter): +2 DEX',
    'L8: +2 DEX (cap at 20)',
  ],
};

export const RANGED_BUILDS = [
  { build: 'CBE/SS Fighter', class: 'Fighter', weapon: 'Hand Crossbow', detail: '3 attacks at L5, 4 at L11. Action Surge for 6-8 attacks. Highest ranged DPR.', rating: 'S' },
  { build: 'SS Samurai Fighter', class: 'Fighter (Samurai)', weapon: 'Longbow', detail: 'Fighting Spirit: advantage 3×/day. SS with advantage. Elven Accuracy if elf.', rating: 'S' },
  { build: 'SS Gloom Stalker Ranger', class: 'Ranger', weapon: 'Longbow', detail: '3 attacks turn 1 (Dread Ambusher). Pass Without Trace for surprise. Absorb Elements.', rating: 'S' },
  { build: 'Arcane Archer Fighter', class: 'Fighter', weapon: 'Longbow', detail: 'Only 2 Arcane Shots/rest. Underwhelming. Better as Battle Master.', rating: 'C' },
  { build: 'Kensei Monk (Longbow)', class: 'Monk', weapon: 'Longbow', detail: 'DEX + WIS. Kensei Shot +1d4. Focused Aim spends ki to offset SS penalty.', rating: 'B' },
];

export function ssDPR(attacks, dexMod, hitChanceBase) {
  const ssHitChance = Math.max(0.05, hitChanceBase - 0.25); // -5 ≈ -25%
  const ssDamage = attacks * ssHitChance * (3.5 + dexMod + 10); // d6 hand xbow + DEX + 10
  const normalDamage = attacks * hitChanceBase * (3.5 + dexMod);
  return { withSS: ssDamage, without: normalDamage, better: ssDamage > normalDamage ? 'SS' : 'Normal' };
}

export function longRangeDisadvantageIgnored(hasSharpshooter) {
  return hasSharpshooter; // SS removes long range disadvantage
}
