/**
 * playerAbsorbElementsGuide.js
 * Player Mode: Absorb Elements — essential elemental defense
 * Pure JS — no React dependencies.
 */

export const ABSORB_ELEMENTS_BASICS = {
  spell: 'Absorb Elements',
  level: 1,
  school: 'Abjuration',
  castTime: '1 reaction (when you take acid, cold, fire, lightning, or thunder damage)',
  duration: '1 round',
  classes: ['Wizard', 'Sorcerer', 'Druid', 'Ranger', 'Artificer'],
  effects: [
    'Resistance to the triggering element until start of your next turn.',
    'First melee attack on your next turn deals +1d6 of that element.',
    'At higher levels: +1d6 per slot level above 1st.',
  ],
  note: 'Half damage from dragon breath, Fireball, Lightning Bolt. One of the best L1 spells. Always prepare.',
};

export const ABSORB_ELEMENTS_MATH = [
  { source: 'Ancient Red Dragon breath (26d6 = 91 avg)', absorbed: '~45 damage reduced', note: 'Resistance halves 91 → 45. A L1 slot saves 45+ HP.' },
  { source: 'Fireball (8d6 = 28 avg, failed save)', absorbed: '~14 damage reduced', note: 'Even on failed save, resistance halves the damage.' },
  { source: 'Lightning Bolt (8d6 = 28 avg)', absorbed: '~14 damage reduced', note: 'Same as Fireball. Always worth a L1 slot.' },
  { source: 'Cone of Cold (8d8 = 36 avg)', absorbed: '~18 damage reduced', note: 'Cold damage. Absorb Elements covers it.' },
];

export const ABSORB_VS_SHIELD = {
  absorbElements: {
    trigger: 'Take elemental damage (any source: breath weapon, spell, trap)',
    effect: 'Resistance (half damage) + bonus melee damage next turn',
    bestAgainst: 'AoE spells, breath weapons, elemental traps',
  },
  shield: {
    trigger: 'Hit by attack roll',
    effect: '+5 AC until start of next turn',
    bestAgainst: 'Weapon attacks, spell attacks (rays, bolts)',
  },
  verdict: 'Both are essential L1 reactions. Shield for attacks, Absorb Elements for saves/AoE. Prepare BOTH always.',
};

export const MELEE_DAMAGE_BONUS = {
  base: '+1d6 elemental damage on first melee hit next turn.',
  scaling: [
    { slot: 1, bonus: '1d6 (avg 3.5)' },
    { slot: 2, bonus: '2d6 (avg 7)' },
    { slot: 3, bonus: '3d6 (avg 10.5)' },
    { slot: 4, bonus: '4d6 (avg 14)' },
    { slot: 5, bonus: '5d6 (avg 17.5)' },
  ],
  note: 'Melee bonus is a nice perk, not the main reason to cast. The resistance is the star.',
  combos: [
    'Paladin multiclass: Absorb Elements → Divine Smite on same hit. Massive burst.',
    'Rogue: Absorb Elements + Sneak Attack = big single hit.',
    'Ranger: Absorb Elements + Hunter\'s Mark damage stacking.',
  ],
};

export const CLASS_ACCESS = [
  { class: 'Wizard', access: 'Class list. Always prepare.', note: 'Wizards are fragile. Resistance saves lives.' },
  { class: 'Sorcerer', access: 'Class list. Must spend a known spell.', note: 'Worth the known spell slot. Essential.' },
  { class: 'Druid', access: 'Class list. Always prepare.', note: 'Druids face elemental damage often. Essential.' },
  { class: 'Ranger', access: 'Class list. Must prepare.', note: 'Good with melee Ranger builds (bonus damage on next hit).' },
  { class: 'Artificer', access: 'Class list. Always prepare.', note: 'Artificers on the front line need this.' },
  { class: 'Others', access: 'Multiclass 1 level or Magic Initiate feat.', note: '1 Wizard dip gives Shield + Absorb Elements + Find Familiar.' },
];

export function absorbDamageReduction(incomingDamage) {
  const reduced = Math.floor(incomingDamage / 2);
  return { original: incomingDamage, afterAbsorb: incomingDamage - reduced, saved: reduced, note: `Absorb Elements: ${incomingDamage} → ${incomingDamage - reduced} (saved ${reduced} HP)` };
}
