/**
 * playerCombatStyleAnalysis.js
 * Player Mode: All Fighting Styles ranked and analyzed
 * Pure JS — no React dependencies.
 */

export const FIGHTING_STYLES = [
  { name: 'Archery', effect: '+2 to ranged attack rolls.', classes: ['Fighter', 'Ranger'], rating: 'S', note: 'Best offensive style. +10% hit rate.' },
  { name: 'Dueling', effect: '+2 damage with one-handed melee + free hand/shield.', classes: ['Fighter', 'Paladin', 'Ranger'], rating: 'A', note: 'Consistent. Sword-and-board best.' },
  { name: 'Defense', effect: '+1 AC while wearing armor.', classes: ['Fighter', 'Paladin', 'Ranger'], rating: 'A', note: 'Always useful. Safe default pick.' },
  { name: 'Great Weapon Fighting', effect: 'Reroll 1s/2s on 2H weapon damage dice.', classes: ['Fighter', 'Paladin'], rating: 'B', note: '+1-2 avg damage. Only weapon dice, not Smite.' },
  { name: 'Two-Weapon Fighting', effect: 'Add ability mod to off-hand damage.', classes: ['Fighter', 'Ranger'], rating: 'B', note: 'Mandatory for TWF builds.' },
  { name: 'Interception', effect: 'Reaction: reduce ally damage by 1d10+prof.', classes: ['Fighter', 'Paladin'], rating: 'A', note: 'Better than Protection. Guaranteed reduction.' },
  { name: 'Protection', effect: 'Reaction: disadvantage on attack vs nearby ally.', classes: ['Fighter', 'Paladin'], rating: 'C', note: 'Costs reaction. Situational.' },
  { name: 'Blind Fighting', effect: '10ft blindsight.', classes: ['Fighter', 'Paladin', 'Ranger'], rating: 'B', note: 'Fog Cloud/Darkness combo.' },
  { name: 'Unarmed Fighting', effect: '1d6/1d8 unarmed + grapple damage.', classes: ['Fighter'], rating: 'A', note: 'Wrestler builds without Monk.' },
  { name: 'Druidic Warrior', effect: '2 Druid cantrips (WIS-based).', classes: ['Ranger'], rating: 'A', note: 'Shillelagh = WIS melee Ranger.' },
  { name: 'Blessed Warrior', effect: '2 Cleric cantrips (CHA-based).', classes: ['Paladin'], rating: 'B', note: 'Toll the Dead gives ranged option.' },
  { name: 'Thrown Weapon Fighting', effect: '+2 damage + free draw for thrown.', classes: ['Fighter', 'Ranger'], rating: 'B', note: 'Enables thrown builds.' },
  { name: 'Superior Technique', effect: '1 maneuver + 1 d6 superiority die.', classes: ['Fighter'], rating: 'C', note: 'Only 1 die. Best as MC dip.' },
];

export const STYLE_PICKS = {
  'Sword & Board': 'Dueling or Defense',
  'Greatsword': 'Great Weapon Fighting',
  'Archer': 'Archery (always)',
  'TWF': 'Two-Weapon Fighting',
  'Tank': 'Defense or Interception',
  'Grappler': 'Unarmed Fighting',
};

export function styleDamageBonus(style, attacks) {
  const bonuses = { 'Dueling': 2, 'TWF': 4, 'GWF': 1.33, 'Thrown': 2 };
  return (bonuses[style] || 0) * attacks;
}
