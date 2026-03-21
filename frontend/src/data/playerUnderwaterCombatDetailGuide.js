/**
 * playerUnderwaterCombatDetailGuide.js
 * Player Mode: Underwater combat rules and strategies
 * Pure JS — no React dependencies.
 */

export const UNDERWATER_COMBAT_RULES = {
  meleeAttacks: {
    rule: 'Melee weapon attacks have disadvantage unless the weapon is a dagger, javelin, shortsword, spear, or trident.',
    note: 'Slashing and bludgeoning weapons are ineffective underwater. Piercing/thrusting weapons work.',
    validWeapons: ['Dagger', 'Javelin', 'Shortsword', 'Spear', 'Trident'],
  },
  rangedAttacks: {
    rule: 'Ranged weapon attacks auto-miss beyond normal range. Within normal range: disadvantage unless it\'s a crossbow, net, or thrown weapon (javelin, trident, etc.).',
    note: 'Bows are useless. Crossbows work with disadvantage. Thrown piercing weapons work with disadvantage.',
    validRanged: ['Crossbow (light/heavy/hand)', 'Net', 'Thrown piercing weapons'],
  },
  spellcasting: {
    rule: 'Verbal components create a bubble of air (most DMs). Somatic components work normally. Fire spells: DM discretion.',
    note: 'RAW: no explicit underwater spellcasting restriction. But fire spells logically shouldn\'t work underwater.',
    fireSpells: 'Most DMs rule fire spells don\'t work or deal reduced damage underwater.',
  },
  movement: {
    rule: 'Swimming speed = half movement unless you have a swim speed.',
    note: 'Heavy armor: typically disadvantage on Athletics checks to swim. Some DMs rule you sink.',
  },
};

export const UNDERWATER_EFFECTIVE_OPTIONS = [
  { option: 'Shape Water (cantrip)', effect: 'Move water, freeze it, change flow. Utility cantrip becomes combat tool.', rating: 'S', note: 'Freeze water around enemies, create currents, drain areas.' },
  { option: 'Lightning spells', effect: 'Lightning works underwater and some DMs rule it spreads to nearby creatures in water.', rating: 'A+', note: 'DM-dependent. Witch Bolt, Lightning Bolt, Call Lightning.' },
  { option: 'Cold spells', effect: 'Freezing water. Ray of Frost, Cone of Cold work normally underwater.', rating: 'A+', note: 'Thematic and functional. Freeze the water around enemies.' },
  { option: 'Thunder spells', effect: 'Sound travels well underwater. Thunderwave, Shatter work at full effectiveness.', rating: 'A', note: 'Some DMs rule thunder damage is enhanced underwater.' },
  { option: 'Trident + Shield', effect: 'Trident is one of the few full-function melee weapons underwater.', rating: 'A', note: 'Thematic and rules-legal. No disadvantage.' },
  { option: 'Create or Destroy Water', effect: 'Destroy water in an area = potential dry pocket. Create water = flood an area.', rating: 'B+', note: 'Creative utility. DM-dependent on scale.' },
  { option: 'Water Breathing', effect: 'Eliminates drowning risk for 24 hours. No concentration.', rating: 'S', note: 'CAST THIS BEFORE going underwater. Ritual cast = no slot.' },
];

export const DROWNING_RULES = {
  holdBreath: 'You can hold your breath for 1 + CON modifier minutes (minimum 30 seconds).',
  running_out: 'When you run out of breath, you can survive for a number of rounds equal to your CON modifier (minimum 1).',
  drowning: 'At the start of your next turn after that, you drop to 0 HP and are dying. You can\'t be stabilized or regain HP until you can breathe again.',
  tips: [
    'Water Breathing (ritual, L3) eliminates this entirely.',
    'Air Genasi can hold breath indefinitely.',
    'Some races have natural swim speeds: Triton, Sea Elf, Lizardfolk.',
    'Bottle of Endless Water: create breathable pocket.',
  ],
};

export const BEST_UNDERWATER_RACES = [
  { race: 'Triton', why: 'Swim speed, breathe water, cold resistance, Guardian of the Depths.', rating: 'S' },
  { race: 'Sea Elf', why: 'Swim speed, breathe water, aquatic elf features.', rating: 'S' },
  { race: 'Lizardfolk', why: 'Swim speed, hold breath 15 minutes, natural armor.', rating: 'A+' },
  { race: 'Water Genasi', why: 'Swim speed, breathe water, Shape Water, resistance to acid.', rating: 'A+' },
  { race: 'Locathah', why: 'Swim speed, limited amphibiousness (needs water every 4 hours).', rating: 'A' },
  { race: 'Air Genasi', why: 'Hold breath indefinitely. No swim speed but never drowns.', rating: 'B+' },
];

export const UNDERWATER_STRATEGIES = [
  'Cast Water Breathing before entering water — ritual cast costs no slot.',
  'Equip piercing weapons before underwater encounters — shortswords, spears, tridents.',
  'Casters: focus on cold, lightning, thunder damage. Avoid fire.',
  'Heavy armor wearers: consider removing armor or getting a swim speed source.',
  'Use the 3D space — underwater combat is fully 3-dimensional.',
  'Grappling underwater: push enemies deeper, away from the surface.',
  'If you don\'t have a swim speed, Fly spell works underwater (DM-dependent).',
];
