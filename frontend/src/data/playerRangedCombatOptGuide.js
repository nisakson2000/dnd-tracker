/**
 * playerRangedCombatOptGuide.js
 * Player Mode: Ranged combat optimization — weapons, feats, and tactics
 * Pure JS — no React dependencies.
 */

export const RANGED_WEAPON_COMPARISON = [
  { weapon: 'Longbow', damage: '1d8', range: '150/600', properties: 'Ammunition, Heavy, Two-Handed', rating: 'S', note: 'Best ranged weapon for damage and range. DEX builds.' },
  { weapon: 'Hand Crossbow', damage: '1d6', range: '30/120', properties: 'Ammunition, Light, Loading', rating: 'S+ (with CBE)', note: 'With Crossbow Expert: BA attack. Best sustained DPR.' },
  { weapon: 'Heavy Crossbow', damage: '1d10', range: '100/400', properties: 'Ammunition, Heavy, Loading, Two-Handed', rating: 'A+ (with CBE)', note: 'Highest damage per shot. CBE removes Loading.' },
  { weapon: 'Shortbow', damage: '1d6', range: '80/320', properties: 'Ammunition, Two-Handed', rating: 'B+', note: 'No Heavy property. Small races can use it.' },
  { weapon: 'Light Crossbow', damage: '1d8', range: '80/320', properties: 'Ammunition, Loading, Two-Handed', rating: 'B', note: 'Same damage as longbow but Loading. Worse without CBE.' },
  { weapon: 'Dart', damage: '1d4', range: '20/60', properties: 'Finesse, Thrown', rating: 'B', note: 'Finesse + thrown. Unique. Works with Sneak Attack.' },
  { weapon: 'Javelin', damage: '1d6', range: '30/120', properties: 'Thrown', rating: 'A (STR builds)', note: 'STR-based ranged option. No ammo needed.' },
  { weapon: 'Eldritch Blast', damage: '1d10 × beams', range: '120', properties: 'Cantrip', rating: 'S+ (Warlock)', note: 'Best ranged attack in game with Agonizing Blast.' },
];

export const RANGED_FEAT_COMBOS = [
  {
    combo: 'Sharpshooter',
    effect: '-5 to hit, +10 damage. Ignore half/3/4 cover. No disadvantage at long range.',
    rating: 'S+',
    note: 'Best ranged feat. +10 damage per hit. Cover ignoring is huge.',
  },
  {
    combo: 'Crossbow Expert',
    effect: 'Ignore Loading. No disadvantage in melee. BA hand crossbow attack after Attack action.',
    rating: 'S+',
    note: 'BA attack = extra 1d6+DEX per round. Best sustained DPR feat.',
  },
  {
    combo: 'Sharpshooter + Crossbow Expert',
    effect: 'BA attack with +10 damage on all hits.',
    rating: 'S++',
    note: 'THE ranged DPR combo. 3 attacks at L5 (2 Action + 1 BA) × (1d6+DEX+10).',
  },
  {
    combo: 'Archery Fighting Style',
    effect: '+2 to ranged attack rolls.',
    rating: 'S',
    note: 'Offsets Sharpshooter -5 penalty. +2 is huge for ranged accuracy.',
  },
  {
    combo: 'Elven Accuracy + Sharpshooter',
    effect: 'Super advantage (3 dice) with -5/+10.',
    rating: 'S+',
    note: 'Triple advantage offsets -5 penalty. Elf/half-elf only.',
  },
];

export const RANGED_BUILD_ARCHETYPES = [
  {
    build: 'Hand Crossbow Fighter (Battle Master)',
    setup: 'Hand crossbow + CBE + Sharpshooter + Archery',
    damage: '3 attacks × (1d6+5+10) = 49.5 avg at L5',
    rating: 'S+',
    note: 'Best sustained ranged DPR. Precision Attack offsets -5.',
  },
  {
    build: 'Longbow Ranger (Gloom Stalker)',
    setup: 'Longbow + Sharpshooter + Archery',
    damage: 'R1: 3 attacks + extra 1d8 + WIS to initiative',
    rating: 'S+',
    note: 'Best round 1 ranged damage. Falls off after R1.',
  },
  {
    build: 'Eldritch Blast Warlock',
    setup: 'EB + Agonizing + Repelling + Hex',
    damage: '2 × (1d10+1d6+5) = 28 avg at L5',
    rating: 'S',
    note: 'Scales with character level. Infinite ammo. Force damage.',
  },
  {
    build: 'Ranged Rogue (Scout)',
    setup: 'Shortbow or hand crossbow + Sneak Attack + Steady Aim',
    damage: '1 attack + 3d6 SA = 20.5 avg at L5',
    rating: 'A+',
    note: 'Reliable SA with Steady Aim. Less raw DPR but very consistent.',
  },
];

export const RANGED_COMBAT_TACTICS = [
  'Stay at max range. Ranged attackers should NEVER be in melee if possible.',
  'Use cover. +2 AC (half) or +5 AC (3/4) from walls, pillars, etc.',
  'Sharpshooter ignores enemy cover. HUGE tactical advantage.',
  'Focus fire ranged threats first. Enemy archers/casters are your mirror.',
  'Crossbow Expert: no disadvantage in melee. Fallback if enemies close in.',
  'High ground: DM may grant advantage. Always seek elevation.',
  'Ammunition: carry 40+ arrows. Running out mid-fight is embarrassing.',
  'Prone targets: ranged attacks have disadvantage. Don\'t shoot prone enemies if you can help it.',
  'Hex/Hunter\'s Mark: move to new target on kill. Sustain bonus damage.',
  'Magic ammunition: +1 arrows exist. Ask your DM about crafting.',
];

export const RANGED_COMBAT_TIPS = [
  'Sharpshooter + CBE is the best ranged DPR combo in the game.',
  'Archery Fighting Style (+2) partially offsets Sharpshooter -5.',
  'Use advantage (Faerie Fire, Steady Aim, flanking) to offset -5 penalty.',
  'Longbow for range (150ft). Hand crossbow for DPR (BA attack).',
  'Don\'t use Sharpshooter against high AC. Only when you have advantage or enemy AC is low.',
  'Ranged characters should prioritize DEX > CON > WIS.',
  'Gloom Stalker R1 burst is the highest ranged nova in the game.',
  'Eldritch Blast is technically the best ranged attack — force damage, multiple hits, invocations.',
];
