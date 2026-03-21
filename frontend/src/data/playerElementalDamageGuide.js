/**
 * playerElementalDamageGuide.js
 * Player Mode: Damage types — what's commonly resisted, what's safe
 * Pure JS — no React dependencies.
 */

export const DAMAGE_TYPE_RANKINGS = [
  { type: 'Force', rating: 'S+', note: 'Safest. Almost nothing resists. EB, Magic Missile, Disintegrate.' },
  { type: 'Radiant', rating: 'S', note: 'Rarely resisted. Extra vs undead. Cleric/Paladin staple.' },
  { type: 'Psychic', rating: 'S', note: 'Rarely resisted. Useless vs constructs. Mind Sliver, Synaptic Static.' },
  { type: 'Thunder', rating: 'A+', note: 'Few resist. Shatter, Thunder Step.' },
  { type: 'Necrotic', rating: 'A', note: 'Ironic: many undead immune to necrotic.' },
  { type: 'Acid', rating: 'A', note: 'Stops troll regen. Decent coverage.' },
  { type: 'Lightning', rating: 'B+', note: 'Some absorb it (Shambling Mound). Lightning Bolt.' },
  { type: 'Cold', rating: 'B+', note: 'Many cold creatures immune. Common resistance.' },
  { type: 'Fire', rating: 'B', note: 'Most common resistance. Fireball compensates with AoE.' },
  { type: 'Poison', rating: 'C', note: 'MOST resisted. Undead, constructs, fiends all immune.' },
  { type: 'Magical BPS', rating: 'A', note: 'Magical weapons bypass resistance. Essential by L5.' },
  { type: 'Nonmagical BPS', rating: 'C', note: 'Many creatures resist nonmagical physical. Get magic weapons.' },
];

export const VULNERABILITY_CHART = [
  { creature: 'Troll', weakness: 'Fire/acid stops regeneration.' },
  { creature: 'Vampire', weakness: 'Radiant, sunlight, running water.' },
  { creature: 'Mummy', weakness: 'Fire.' },
  { creature: 'Treant', weakness: 'Fire. Trees burn.' },
  { creature: 'Skeleton', weakness: 'Bludgeoning. Bones break.' },
  { creature: 'Ice creatures', weakness: 'Fire (usually).' },
  { creature: 'Lycanthropes', weakness: 'Silvered weapons.' },
];

export const KEY_SPELLS = {
  absorbElements: {
    spell: 'Absorb Elements (L1)',
    action: 'Reaction on acid/cold/fire/lightning/thunder damage.',
    effect: 'Resist that type until next turn. +1d6 on next melee.',
    note: 'ESSENTIAL. Halve dragon breath. Must-have.',
  },
  protectionFromEnergy: {
    spell: 'Protection from Energy (L3)',
    action: 'Action. Concentration 1 hour.',
    effect: 'Resistance to one damage type for 1 hour.',
    note: 'Before boss fights. Pick the damage type they deal.',
  },
};

export const DAMAGE_TYPE_TIPS = [
  'Force: safest damage type. Almost nothing resists.',
  'Radiant: great vs undead. Rarely resisted.',
  'Poison: MOST resisted. Avoid as primary damage.',
  'Fire: most common resistance. But Fireball AoE compensates.',
  'Magical weapons bypass BPS resistance. Essential by L5.',
  'Absorb Elements: halve elemental damage as reaction.',
  'Troll regen: fire or acid stops it. Always bring fire.',
  'Silvered weapons: lycanthropes and some devils.',
  'Diversify party damage types. Don\'t all do fire.',
  'Psychic: rarely resisted but useless vs constructs.',
];
