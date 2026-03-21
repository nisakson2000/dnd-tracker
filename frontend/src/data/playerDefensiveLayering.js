/**
 * playerDefensiveLayering.js
 * Player Mode: Stacking defensive options for maximum survivability
 * Pure JS — no React dependencies.
 */

export const DEFENSIVE_LAYERS = {
  concept: 'Defense in D&D comes in layers. Stack multiple non-conflicting defenses.',
  layers: [
    { layer: 'AC', examples: 'Armor, Shield, Shield spell, Bladesong, Haste', note: 'Prevents hits entirely. Best first line of defense.' },
    { layer: 'Duplicates/Decoys', examples: 'Mirror Image (3 duplicates)', note: 'No concentration. Absorbs hits before they reach you.' },
    { layer: 'Disadvantage on attacks', examples: 'Blur, Dodge action, Darkness (if you can see), Invisibility', note: 'Reduces hit chance further.' },
    { layer: 'Damage resistance', examples: 'Rage, Absorb Elements, Stoneskin, Shadar-kai teleport', note: 'Halves damage that gets through.' },
    { layer: 'Temp HP', examples: 'Armor of Agathys, Inspiring Leader, Aid (max HP), Heroism', note: 'Buffer before real HP takes damage.' },
    { layer: 'Saving throws', examples: 'Paladin Aura, Resilient feat, Bless, Shield Master DEX saves', note: 'Reduces magic damage and effects.' },
    { layer: 'Death prevention', examples: 'Death Ward, Relentless Endurance (Half-Orc), Undying Sentinel (Paladin)', note: 'Last line: prevents actual death.' },
  ],
};

export const TANK_BUILDS_BY_AC = [
  { ac: '22-24', build: 'Plate (18) + Shield (2) + Defense FS (1) + Shield spell (5) when needed.', class: 'Fighter, Paladin, Cleric' },
  { ac: '23-26', build: 'Bladesinger: Mage Armor (13) + DEX (4-5) + INT (4-5) + Shield (5).', class: 'Wizard (Bladesinger)' },
  { ac: '24-27', build: 'Warforged Artificer: Arcane Armor + Shield + Enhanced Defense + Shield spell.', class: 'Artificer (Armorer)' },
  { ac: '20-23', build: 'Barbarian: Unarmored (10 + DEX + CON) + Shield. No heavy armor.', class: 'Barbarian' },
  { ac: '20-22', build: 'Monk: Unarmored (10 + DEX + WIS). No armor, no shield.', class: 'Monk' },
];

export const RESISTANCE_STACKING = {
  rule: 'Resistance doesn\'t stack. Two sources of fire resistance still = half damage, not quarter.',
  exception: 'Resistance + immunity: immunity wins. Resistance + vulnerability: cancel out to normal damage.',
  absorb: 'Absorb Elements: reaction resistance to triggering damage. Doesn\'t conflict with permanent resistance (just overlaps).',
  bestResistances: [
    'Bear Totem Barbarian: resistance to ALL damage except psychic while raging.',
    'Shadar-kai: resistance to ALL damage until next turn after teleporting.',
    'Stoneskin (4th): resistance to nonmagical bludgeoning/piercing/slashing. Concentration.',
    'Warding Bond (2nd): target gets resistance to all damage (caster shares damage).',
  ],
};

export function effectiveHP(maxHP, ac, enemyAttackBonus, hasResistance, hasMirrorImage) {
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (ac - enemyAttackBonus)) / 20));
  let ehp = maxHP / hitChance;
  if (hasResistance) ehp *= 2;
  if (hasMirrorImage) ehp *= 1.5; // rough approximation of 3 duplicates
  return Math.round(ehp);
}

export function totalDefenseRating(ac, saveBonus, hasResistance, hasDeathWard) {
  let rating = ac * 2 + saveBonus;
  if (hasResistance) rating += 10;
  if (hasDeathWard) rating += 5;
  return rating;
}
