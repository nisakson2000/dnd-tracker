/**
 * playerSavingThrowTargetingGuide.js
 * Player Mode: Which saves to target — weakest monster saves
 * Pure JS — no React dependencies.
 */

export const SAVE_TARGETING_OVERVIEW = {
  concept: 'Different creatures have different weak saves. Target the weak save to maximize spell effectiveness.',
  rule: 'Monster manual analysis: most monsters have 2-3 strong saves and 3-4 weak ones.',
};

export const SAVE_ANALYSIS = [
  {
    save: 'Intelligence (INT)',
    weakFor: 'Beasts, monstrosities, most martial humanoids, giants, oozes',
    strongFor: 'Aberrations, spellcasters, mind flayers',
    avgMonsterBonus: 'Very low (+0 to +2 average)',
    bestSpells: ['Synaptic Static', 'Mind Sliver', 'Phantasmal Force', 'Feeblemind'],
    rating: 'S (weakest save overall)',
    note: 'Most monsters dump INT. Target this when available.',
  },
  {
    save: 'Charisma (CHA)',
    weakFor: 'Beasts, constructs, most undead, many monstrosities',
    strongFor: 'Fiends, fey, bards, sorcerers',
    avgMonsterBonus: 'Low (+1 to +3 average)',
    bestSpells: ['Banishment', 'Zone of Truth', 'Calm Emotions'],
    rating: 'A+ (second weakest)',
    note: 'Banishment targets CHA. Great vs non-CHA creatures.',
  },
  {
    save: 'Dexterity (DEX)',
    weakFor: 'Large/huge creatures, heavy armor users, zombies',
    strongFor: 'Rogues, monks, small agile creatures',
    avgMonsterBonus: 'Moderate (+2 to +5)',
    bestSpells: ['Fireball', 'Lightning Bolt', 'Web (restrained DEX check)'],
    rating: 'B+ (moderate)',
    note: 'Common save. Many monsters have decent DEX. Evasion negates.',
  },
  {
    save: 'Wisdom (WIS)',
    weakFor: 'Constructs, some undead, low-WIS beasts',
    strongFor: 'Clerics, druids, many high-CR monsters, fiends',
    avgMonsterBonus: 'Moderate-high (+3 to +7)',
    bestSpells: ['Hold Person', 'Hypnotic Pattern', 'Fear', 'Command'],
    rating: 'B (many monsters are strong)',
    note: 'WIS saves are common and many monsters are proficient. Still good spells.',
  },
  {
    save: 'Constitution (CON)',
    weakFor: 'Casters, some fey, some humanoids',
    strongFor: 'Almost everything big, beefy, or tough',
    avgMonsterBonus: 'High (+3 to +8)',
    bestSpells: ['Stunning Strike', 'Blight', 'Poison spells'],
    rating: 'C+ (strongest save overall)',
    note: 'Most monsters have high CON. Stunning Strike\'s main problem.',
  },
  {
    save: 'Strength (STR)',
    weakFor: 'Casters, small creatures, some undead',
    strongFor: 'Most monsters (beasts, giants, dragons)',
    avgMonsterBonus: 'High (+3 to +8)',
    bestSpells: ['Entangle', 'Earthbind', 'Maximilian\'s Earthen Grasp'],
    rating: 'C (second strongest)',
    note: 'Most monsters are physically strong. Weak casters are the exception.',
  },
];

export const TARGETING_STRATEGY = [
  { strategy: 'Default to INT saves', detail: 'Synaptic Static, Mind Sliver, Phantasmal Force. Most monsters have +0 INT save.', rating: 'S' },
  { strategy: 'CHA saves for banishment', detail: 'Banishment targets CHA. Most non-fey, non-fiend creatures have weak CHA.', rating: 'A+' },
  { strategy: 'WIS saves for control', detail: 'Best control spells (Hold Person, Hypnotic Pattern) target WIS. Accept the risk.', rating: 'A' },
  { strategy: 'Avoid CON saves when possible', detail: 'CON is the strongest monster save. Your spells will fail more often.', rating: 'Important' },
  { strategy: 'Use Mind Sliver first', detail: 'Mind Sliver (INT save) → target takes -1d4 on next save → cast real spell.', rating: 'S' },
];

export const LEGENDARY_RESISTANCE = {
  feature: 'Legendary Resistance',
  rule: 'Boss monsters can choose to succeed on failed saves. Usually 3/day.',
  counter: [
    'Burn LR with lower-level spells first. Then hit with the real spell.',
    'Use spell attack rolls instead (no save = no LR). Disintegrate, Guiding Bolt.',
    'Wall of Force has no save. Can\'t be LR\'d.',
    'Silvery Barbs: force reroll after they use LR on the first save.',
    'Maze: INT check, not save. LR doesn\'t apply.',
  ],
  note: 'Bosses with LR require strategy. Don\'t waste your best spell on their first save.',
};
