/**
 * playerAbilitySaveDC.js
 * Player Mode: Save DC calculation, optimization, and target selection
 * Pure JS — no React dependencies.
 */

export const SAVE_DC_FORMULA = {
  spellSaveDC: '8 + proficiency bonus + spellcasting ability modifier',
  monsterAbilityDC: '8 + proficiency bonus + relevant ability modifier',
  featureDC: 'Varies by feature — check description',
  maxAtLevel20: {
    withPlus5Mod: '8 + 6 + 5 = 19',
    withPlus6Mod: '8 + 6 + 6 = 20 (with Tome of Understanding, etc.)',
    withIounStone: '8 + 6 + 5 + bonuses = varies',
  },
};

export const DC_BY_LEVEL = [
  { level: 1, proficiency: 2, dc16: 13, dc18: 14, dc20: 15 },
  { level: 4, proficiency: 2, dc16: 13, dc18: 14, dc20: 15 },
  { level: 5, proficiency: 3, dc16: 14, dc18: 15, dc20: 16 },
  { level: 8, proficiency: 3, dc16: 14, dc18: 16, dc20: 16 },
  { level: 9, proficiency: 4, dc16: 15, dc18: 17, dc20: 17 },
  { level: 12, proficiency: 4, dc16: 15, dc18: 17, dc20: 17 },
  { level: 13, proficiency: 5, dc16: 16, dc18: 18, dc20: 18 },
  { level: 16, proficiency: 5, dc16: 16, dc18: 18, dc20: 18 },
  { level: 17, proficiency: 6, dc16: 17, dc18: 19, dc20: 19 },
];

export const SAVE_TARGETING = [
  { save: 'STR', strongMonsters: ['Giants', 'Dragons', 'Beast types', 'Constructs'], weakMonsters: ['Casters', 'Undead (many)', 'Aberrations'], spells: ['Entangle', 'Web (break free)', 'Telekinesis'] },
  { save: 'DEX', strongMonsters: ['Rogues', 'Monks', 'Small agile creatures'], weakMonsters: ['Slow heavy creatures', 'Constructs', 'Oozes', 'Plants'], spells: ['Fireball', 'Lightning Bolt', 'Grease'] },
  { save: 'CON', strongMonsters: ['Constructs', 'Giants', 'Dragons', 'Undead'], weakMonsters: ['Casters (many)', 'Fey', 'Humanoids'], spells: ['Stunning Strike', 'Blindness/Deafness', 'Blight'] },
  { save: 'INT', strongMonsters: ['Wizards', 'Mind flayers', 'Beholders'], weakMonsters: ['Beasts', 'Most undead', 'Barbarian types', 'Constructs'], spells: ['Synaptic Static', 'Phantasmal Force', 'Mind Sliver'] },
  { save: 'WIS', strongMonsters: ['Clerics', 'Druids', 'Fey', 'Celestials'], weakMonsters: ['Constructs', 'Undead (some)', 'Low-WIS humanoids'], spells: ['Hold Person', 'Hypnotic Pattern', 'Banishment'] },
  { save: 'CHA', strongMonsters: ['Bards', 'Sorcerers', 'Paladins', 'Fiends'], weakMonsters: ['Beasts', 'Constructs', 'Most mundane creatures'], spells: ['Banishment', 'Forcecage (escape)', 'Zone of Truth'] },
];

export const DC_BOOSTERS = [
  { source: 'Maximize casting stat', effect: '+1 DC per 2 ability score points', cost: 'ASI/feat opportunity', note: 'Always max your casting stat first. 20 → +5 mod.' },
  { source: 'Proficiency scaling', effect: '+1 DC at levels 5, 9, 13, 17', cost: 'Leveling', note: 'Automatic. DC naturally improves as you level.' },
  { source: 'Heightened Spell (Sorcerer)', effect: 'Target has disadvantage on save', cost: '3 sorcery points', note: 'Effectively +5 to DC against one target.' },
  { source: 'Unsettling Words (Eloquence Bard)', effect: 'Target subtracts BI die from save', cost: '1 BI die', note: '-d8 to -d12 on save. Stacks with high DC.' },
  { source: 'Bestow Curse', effect: 'Disadvantage on saves of chosen ability', cost: '3rd level spell', note: 'Pre-debuff, then hit with save-or-suck.' },
  { source: 'Robe of the Archmagi', effect: '+2 to spell save DC', cost: 'Legendary item', note: 'DC 21 at level 17. Nearly impossible for most enemies to save.' },
  { source: 'Ioun Stone of Mastery', effect: '+1 proficiency bonus', cost: 'Legendary item', note: '+1 DC and +1 spell attack. Stacks with everything.' },
];

export function calculateSaveDC(proficiencyBonus, abilityModifier, bonuses) {
  return 8 + proficiencyBonus + abilityModifier + (bonuses || 0);
}

export function enemySaveChance(saveDC, enemySaveBonus) {
  const needed = saveDC - enemySaveBonus;
  return Math.min(95, Math.max(5, (21 - needed) * 5));
}

export function bestSaveToTarget(creatureType) {
  const weaknesses = {
    Beast: 'INT',
    Undead: 'INT',
    Construct: 'INT',
    Humanoid: 'WIS',
    Fey: 'INT',
    Fiend: 'WIS',
    Dragon: 'INT',
    Giant: 'DEX',
    Ooze: 'DEX',
    Plant: 'DEX',
  };
  return weaknesses[creatureType] || 'WIS';
}
