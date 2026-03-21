/**
 * playerDwarfGuide.js
 * Player Mode: Dwarf race optimization and subrace analysis
 * Pure JS — no React dependencies.
 */

export const DWARF_TRAITS = {
  asi: '+2 CON',
  size: 'Medium',
  speed: '25ft (not reduced by heavy armor)',
  darkvision: '60ft',
  dwarvenResilience: 'Advantage on saves vs poison. Resistance to poison damage.',
  dwarvenCombatTraining: 'Proficiency: battleaxe, handaxe, light hammer, warhammer.',
  toolProficiency: 'Choose: smith\'s tools, brewer\'s supplies, or mason\'s tools.',
  stonecunning: 'Double proficiency on History checks related to stonework.',
};

export const DWARF_SUBTYPES = [
  {
    subtype: 'Hill Dwarf',
    asi: '+1 WIS',
    trait: 'Dwarven Toughness: +1 HP per level.',
    bestFor: 'Cleric (WIS + CON + HP), Druid, any class wanting durability.',
    rating: 'A',
    note: 'At level 10: +10 HP. At level 20: +20 HP. Stacks with Tough feat.',
  },
  {
    subtype: 'Mountain Dwarf',
    asi: '+2 STR',
    trait: 'Dwarven Armor Training: medium and light armor proficiency.',
    bestFor: 'Wizard (free armor!), Sorcerer, any caster who wants AC.',
    rating: 'S',
    note: '+2 STR AND +2 CON. Best raw stats for any martial or gish build. Wizard in half plate.',
  },
  {
    subtype: 'Duergar (Underdark Dwarf)',
    asi: '+1 STR',
    trait: 'Superior Darkvision 120ft. Sunlight Sensitivity. Enlarge/Invisibility 1/day each.',
    bestFor: 'Underdark campaigns. Enlarge is strong on martials.',
    rating: 'B',
    note: 'Sunlight Sensitivity is painful outdoors. Amazing underground.',
  },
  {
    subtype: 'Mark of Warding (Eberron)',
    asi: '+1 INT',
    trait: 'Armor of Agathys and Arcane Lock added to spell lists. Wards and Seals.',
    bestFor: 'Abjuration Wizard, Artificer.',
    rating: 'A',
    note: 'Armor of Agathys on a Wizard = temp HP + cold damage retaliation.',
  },
];

export const DWARF_BUILDS = [
  { build: 'Mountain Dwarf Wizard', detail: '+2 CON, +2 STR. Medium armor + shield = 19 AC Wizard at level 1. Bladesinger or War Wizard.', rating: 'S' },
  { build: 'Hill Dwarf Life Cleric', detail: '+2 CON, +1 WIS. Dwarven Toughness + heavy armor + healing. Unkillable healer.', rating: 'S' },
  { build: 'Mountain Dwarf Fighter', detail: '+2 STR, +2 CON. Perfect stats. Poison resistance. Best raw martial.', rating: 'A' },
  { build: 'Hill Dwarf Moon Druid', detail: 'WIS for spells. Dwarven Toughness HP carries into Wild Shape. CON for concentration.', rating: 'A' },
  { build: 'Duergar Rune Knight', detail: 'Enlarge (racial) + Giant\'s Might (subclass) = Large or Huge. Grapple everything.', rating: 'A' },
];

export function dwarvenToughnessHP(level) {
  return level; // +1 HP per level
}

export function mountainDwarfWizardAC(dexMod) {
  // Half plate (15) + DEX (max 2) + shield (2) = up to 19
  return 15 + Math.min(2, dexMod) + 2;
}
