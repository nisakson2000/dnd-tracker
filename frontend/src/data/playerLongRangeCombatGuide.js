/**
 * playerLongRangeCombatGuide.js
 * Player Mode: Ranged combat optimization — bows, crossbows, spells
 * Pure JS — no React dependencies.
 */

export const RANGED_WEAPON_COMPARISON = [
  { weapon: 'Longbow', damage: '1d8', range: '150/600', properties: 'Heavy, Two-Handed', rating: 'S', note: 'Best ranged weapon. 150ft normal range. Heavy = GWM doesn\'t work but Sharpshooter does.' },
  { weapon: 'Heavy Crossbow', damage: '1d10', range: '100/400', properties: 'Heavy, Two-Handed, Loading', rating: 'A', note: 'More damage per hit but Loading = 1 attack/turn without Crossbow Expert.' },
  { weapon: 'Hand Crossbow', damage: '1d6', range: '30/120', properties: 'Light, Loading', rating: 'S (with CBE)', note: 'With Crossbow Expert: BA attack + ignores Loading. Best sustained ranged DPR.' },
  { weapon: 'Light Crossbow', damage: '1d8', range: '80/320', properties: 'Two-Handed, Loading', rating: 'B', note: 'Same damage as longbow. Loading limits to 1 attack. Worse than longbow in every way (for proficient users).' },
  { weapon: 'Shortbow', damage: '1d6', range: '80/320', properties: 'Two-Handed', rating: 'B', note: 'No Loading. But lower damage than longbow. For Small races or non-proficient users.' },
  { weapon: 'Darts', damage: '1d4', range: '20/60', properties: 'Finesse, Thrown', rating: 'C', note: 'Finesse = DEX. But 1d4 damage and short range. Emergency ranged option.' },
];

export const SHARPSHOOTER_ANALYSIS = {
  feat: 'Sharpshooter',
  benefits: [
    '-5 to hit, +10 damage on ranged weapon attacks.',
    'No disadvantage at long range.',
    'Ignore half and three-quarter cover.',
  ],
  breakeven: {
    rule: 'SS is worth it when your hit chance without SS is ~65% or higher.',
    withAdvantage: 'Advantage makes SS almost always worthwhile.',
    withBless: '+1d4 from Bless offsets most of the -5 penalty.',
  },
  note: 'Best ranged feat in the game. +10 damage per hit is enormous. Cover ignoring is underrated.',
};

export const CROSSBOW_EXPERT_ANALYSIS = {
  feat: 'Crossbow Expert',
  benefits: [
    'Ignore Loading property (allows Extra Attack with crossbows).',
    'No disadvantage on ranged attacks within 5ft.',
    'BA attack with hand crossbow after attacking with one-handed weapon.',
  ],
  handCrossbowBuild: {
    combo: 'Hand Crossbow + Crossbow Expert + Sharpshooter',
    attacks: 'Attack action (1-4 attacks) + BA attack (1 more). All get SS +10.',
    note: 'Highest sustained ranged DPR in the game. Fighter 20: 5 attacks per round, each +10 damage.',
  },
};

export const RANGED_BUILD_COMPARISON = [
  { build: 'Hand Crossbow + CBE + SS (Fighter)', dprNote: 'Highest sustained ranged DPR. 3 attacks at L5, 4 at L11, 5 at L20.', rating: 'S' },
  { build: 'Longbow + SS (Ranger/Fighter)', dprNote: 'Great range (150ft). 2-4 attacks. No BA attack but BA free for other features.', rating: 'A' },
  { build: 'Eldritch Blast + Agonizing (Warlock)', dprNote: '2-4 beams, 1d10+CHA each. 120ft range. No feat needed. Free invocation-based.', rating: 'S' },
  { build: 'Longbow + SS + Gloom Stalker', dprNote: 'Dread Ambusher extra attack round 1 + SS. Burst damage king.', rating: 'S' },
  { build: 'Thrown weapons + STR', dprNote: 'Short range (20/60). Needs Thrown Weapon Fighting style. Niche but thematic.', rating: 'C' },
];

export const RANGED_COMBAT_TIPS = [
  'Always use cover. Half cover = +2 AC. Stand behind a pillar and shoot.',
  'Prone enemies: disadvantage on ranged attacks beyond 5ft. Wait for them to stand up.',
  'Long range (beyond normal): disadvantage on attack. Sharpshooter removes this penalty.',
  'Ammunition: track it at low levels. At mid+ levels, most DMs hand-wave it.',
  'Magic ammunition: +1/+2/+3 arrows exist. Stock up when available.',
  'Fog/darkness: can\'t target what you can\'t see. Ranged combat requires line of sight.',
];

export function rangedDPR(numAttacks, dexMod, weaponDie, hasSS, hitChance) {
  const ssDamage = hasSS ? 10 : 0;
  const ssHitPenalty = hasSS ? 0.25 : 0;
  const effectiveHit = Math.max(0.05, hitChance - ssHitPenalty);
  const perHit = weaponDie / 2 + 0.5 + dexMod + ssDamage;
  const totalDPR = numAttacks * perHit * effectiveHit;
  return { perHit: Math.round(perHit), dpr: Math.round(totalDPR), note: `${numAttacks} attacks × ${Math.round(perHit)} avg × ${Math.round(effectiveHit * 100)}% = ~${Math.round(totalDPR)} DPR` };
}
