/**
 * playerExtraActionSurgeGuide.js
 * Player Mode: Action Surge optimization — when and how to maximize it
 * Pure JS — no React dependencies.
 */

export const SURGE_RULES = {
  what: 'Extra action on your turn. 1/short rest (2 at L17).',
  class: 'Fighter L2.',
  spellcasting: 'CAN cast 2 leveled spells (not bonus action rule).',
  multiclass: 'Fighter 2 dip = Action Surge for any class.',
};

export const BEST_USES = [
  { use: 'Double Attack', how: '8 attacks at L20 Fighter.', rating: 'S+' },
  { use: 'Double Spell', how: '2 leveled spells one turn.', rating: 'S+' },
  { use: 'Round 1 Burst', how: 'Gloom Stalker + Surge = 7 attacks.', rating: 'S+' },
  { use: 'Smite Nova', how: 'Extra attacks = extra smites.', rating: 'S' },
  { use: 'Attack + Spell', how: 'Full attack + leveled spell.', rating: 'S' },
];

export const SURGE_TIPS = [
  'Fighter L2: best feature in 5e.',
  'Short rest recovery. Use then rest.',
  'Caster + Fighter 2: 2 spells in one turn.',
  'Best 2-level dip for any class.',
  'Gloom Stalker 5/Fighter 2: 7 attacks round 1.',
  'Paladin: extra attacks = extra smites.',
  'NOT a bonus action. Bonus still available.',
  'Don\'t hoard. Short rest refills.',
  'L17: two uses. Triple turn.',
  'Use on boss fights. Maximum impact.',
];
