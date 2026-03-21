/**
 * playerDwarfRaceGuide.js
 * Player Mode: Dwarf — the sturdy warrior
 * Pure JS — no React dependencies.
 */

export const DWARF_BASICS = {
  race: 'Dwarf',
  source: 'Player\'s Handbook',
  asis: '+2 CON (all), +2 STR (Mountain) or +1 WIS (Hill)',
  speed: '25ft (not reduced by heavy armor)',
  size: 'Medium',
  darkvision: '60ft',
  note: 'Tanky and reliable. CON bonus for everyone. Poison resistance. Mountain Dwarf gets +2/+2 (best in PHB for stats). Hill Dwarf gets extra HP per level. Speed not reduced by armor.',
};

export const DWARF_TRAITS_COMMON = [
  { trait: 'Dwarven Resilience', effect: 'Advantage on saves vs poison. Resistance to poison damage.', note: 'Poison is common. Advantage + resistance = very strong defensive trait.' },
  { trait: 'Dwarven Combat Training', effect: 'Proficiency with battleaxe, handaxe, light hammer, warhammer.', note: 'Weapon proficiency for caster Dwarves. Wizards with warhammers.' },
  { trait: 'Tool Proficiency', effect: 'Proficiency with smith\'s tools, brewer\'s supplies, or mason\'s tools.', note: 'Free tool proficiency. Smith\'s tools most useful.' },
  { trait: 'Stonecunning', effect: 'Add 2× proficiency bonus to History checks related to stonework.', note: 'Niche but thematic. Useful in dungeons and dwarven ruins.' },
  { trait: 'Speed', effect: '25ft. Speed not reduced by wearing heavy armor.', note: 'Slow but heavy armor doesn\'t slow you further. Important for STR builds.' },
];

export const DWARF_SUBRACES = {
  mountain: {
    name: 'Mountain Dwarf',
    asis: '+2 STR, +2 CON',
    traits: [{ trait: 'Dwarven Armor Training', effect: 'Proficiency with light and medium armor.', note: 'Medium armor on any class. Wizard in half plate = AC 17 with shield.' }],
    note: 'THE stat race. +2/+2 is the best in PHB. Medium armor proficiency makes any class tanky.',
    rating: 'S',
  },
  hill: {
    name: 'Hill Dwarf',
    asis: '+1 WIS',
    traits: [{ trait: 'Dwarven Toughness', effect: '+1 HP per level.', note: 'At L20: +20 HP. Stacks with Tough feat for +4/level. Tankiest race in the game.' }],
    note: 'WIS + extra HP. Perfect for Clerics and Druids. Most HP possible.',
    rating: 'A',
  },
  duergar: {
    name: 'Duergar (Gray Dwarf)',
    asis: '+1 STR',
    traits: [
      { trait: 'Superior Darkvision', effect: '120ft darkvision.', note: 'Double range darkvision.' },
      { trait: 'Duergar Magic', effect: 'Enlarge/Reduce at L3, Invisibility at L5. Once each per LR.', note: 'Free Enlarge (advantage + 1d4 damage) and Invisibility. Great value.' },
      { trait: 'Sunlight Sensitivity', effect: 'Disadvantage on attacks and Perception in sunlight.', note: 'Harsh penalty outdoors. Best for Underdark campaigns.' },
    ],
    note: 'Great underground. Free Enlarge + Invisibility. Sunlight Sensitivity limits surface use.',
    rating: 'B+',
  },
};

export const DWARF_CLASS_SYNERGY = [
  { class: 'Fighter', priority: 'S', reason: 'Mountain: +2 STR, +2 CON. Poison resistance. Heavy armor speed not reduced. Perfect.', subrace: 'Mountain' },
  { class: 'Cleric', priority: 'S', reason: 'Hill: +2 CON, +1 WIS. Extra HP per level. Poison resistance. Ideal frontline Cleric.', subrace: 'Hill' },
  { class: 'Wizard', priority: 'A', reason: 'Mountain: medium armor proficiency. Half plate Wizard = AC 17. +2 CON for concentration.', subrace: 'Mountain' },
  { class: 'Barbarian', priority: 'A', reason: 'Mountain: +2 STR, +2 CON. Poison resistance stacks with Rage. Slow speed doesn\'t matter with Reckless.', subrace: 'Mountain' },
  { class: 'Druid', priority: 'A', reason: 'Hill: WIS + CON + extra HP. Moon Druid: extra HP in Wild Shape too. Tanky druid.', subrace: 'Hill' },
];

export const DWARF_TACTICS = [
  { tactic: 'Mountain Dwarf Wizard', detail: 'Medium armor Wizard. Half plate + Shield = AC 19. +2 CON for concentration. Tanky caster.', rating: 'S' },
  { tactic: 'Hill Dwarf + Tough feat', detail: '+3 HP/level (1 racial + 2 Tough). At L20: +60 HP over base. Highest HP character possible.', rating: 'A' },
  { tactic: 'Duergar Enlarge melee', detail: 'Free Enlarge: Large size, advantage on STR, +1d4 damage. Great for grapple/melee builds.', rating: 'A' },
  { tactic: 'Poison resistance tanking', detail: 'Advantage + resistance to poison. Ignore many monster abilities. Green dragons, assassins, poisoners.', rating: 'A' },
];

export function hillDwarfHP(level, conMod) {
  const baseHP = 8 + conMod;
  const perLevel = 5 + conMod + 1;
  return { level1: baseHP + 1, totalAtLevel: baseHP + 1 + (level - 1) * perLevel, note: `+1 HP/level from Dwarven Toughness` };
}
