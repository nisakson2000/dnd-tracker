/**
 * playerSpellSaveDC.js
 * Player Mode: Spell save DC reference and optimization
 * Pure JS — no React dependencies.
 */

export const SAVE_DC_FORMULA = {
  base: '8 + proficiency bonus + spellcasting ability modifier',
  spellcastingMods: {
    INT: ['Wizard', 'Artificer', 'Eldritch Knight', 'Arcane Trickster'],
    WIS: ['Cleric', 'Druid', 'Ranger', 'Monk (Ki)'],
    CHA: ['Bard', 'Paladin', 'Sorcerer', 'Warlock'],
  },
};

export const DC_BY_LEVEL = [
  { level: 1, profBonus: 2, mod16: 11, mod18: 12, mod20: 13 },
  { level: 5, profBonus: 3, mod16: 12, mod18: 13, mod20: 14 },
  { level: 9, profBonus: 4, mod16: 13, mod18: 14, mod20: 15 },
  { level: 13, profBonus: 5, mod16: 14, mod18: 15, mod20: 16 },
  { level: 17, profBonus: 6, mod16: 15, mod18: 16, mod20: 17 },
];

export const DC_BOOSTERS = [
  { source: '+1/+2/+3 Arcane Focus', boost: '+1/+2/+3 to spell save DC', rarity: 'Uncommon/Rare/Very Rare', note: 'Rod of the Pact Keeper (Warlock), Wand of the War Mage (any), Amulet of the Devout (Cleric/Paladin).' },
  { source: 'Robe of the Archmagi', boost: '+2 to spell save DC', rarity: 'Legendary', note: 'Also +2 to spell attack rolls. Best caster item.' },
  { source: 'Ioun Stone of Mastery', boost: '+1 to proficiency bonus', rarity: 'Legendary', note: 'Increases EVERYTHING proficiency-based, including DC.' },
  { source: 'Maximize spellcasting stat', boost: '+1 to DC per point', rarity: 'N/A', note: 'Getting from 18 to 20 in your casting stat = +1 DC.' },
];

export const SAVE_TARGETING_GUIDE = [
  { save: 'STR', strongAgainst: ['Fighters', 'Barbarians', 'Paladins'], weakAgainst: ['Wizards', 'Sorcerers', 'Bards'], spellExamples: ['Entangle', 'Maximilian\'s Earthen Grasp'] },
  { save: 'DEX', strongAgainst: ['Fighters (heavy armor)', 'Clerics', 'Barbarians'], weakAgainst: ['Rogues', 'Monks', 'Rangers'], spellExamples: ['Fireball', 'Lightning Bolt'] },
  { save: 'CON', strongAgainst: ['Wizards', 'Sorcerers', 'Rogues'], weakAgainst: ['Barbarians', 'Fighters', 'Paladins'], spellExamples: ['Banishment', 'Cloudkill'] },
  { save: 'INT', strongAgainst: ['Wizards', 'Artificers'], weakAgainst: ['Barbarians', 'Fighters', 'most monsters'], spellExamples: ['Mind Sliver', 'Phantasmal Force', 'Feeblemind'] },
  { save: 'WIS', strongAgainst: ['Clerics', 'Druids', 'Rangers', 'Monks'], weakAgainst: ['Fighters', 'Barbarians', 'Rogues'], spellExamples: ['Hold Person', 'Charm Person', 'Fear'] },
  { save: 'CHA', strongAgainst: ['Bards', 'Sorcerers', 'Warlocks', 'Paladins'], weakAgainst: ['Fighters', 'Monks', 'Wizards'], spellExamples: ['Banishment', 'Zone of Truth'] },
];

export function calculateSpellSaveDC(profBonus, abilityMod, itemBonus) {
  return 8 + profBonus + abilityMod + (itemBonus || 0);
}

export function getBestSaveToTarget(targetType) {
  return SAVE_TARGETING_GUIDE.filter(s =>
    s.weakAgainst.some(w => w.toLowerCase().includes((targetType || '').toLowerCase()))
  );
}

export function estimateSaveChance(saveDC, targetSaveMod) {
  const needed = saveDC - targetSaveMod;
  const chance = Math.max(5, Math.min(95, (21 - needed) * 5));
  return { failChance: `${100 - chance}%`, successChance: `${chance}%` };
}
