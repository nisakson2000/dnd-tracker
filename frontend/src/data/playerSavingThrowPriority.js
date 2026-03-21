/**
 * playerSavingThrowPriority.js
 * Player Mode: Saving throw importance ranking and tips
 * Pure JS — no React dependencies.
 */

export const SAVE_RANKINGS = [
  {
    save: 'DEX',
    tier: 'Common',
    color: '#22c55e',
    frequency: 'Very Common — fireballs, dragon breath, traps.',
    bestDefense: 'Shield Master (add shield bonus), Evasion (Rogue/Monk), Absorb Elements, high DEX.',
    dangerousSpells: ['Fireball', 'Lightning Bolt', 'Cone of Cold', 'Disintegrate'],
  },
  {
    save: 'WIS',
    tier: 'Critical',
    color: '#ef4444',
    frequency: 'Very Common — mind control, fear, charm. Often the most dangerous.',
    bestDefense: 'Resilient (WIS), Wisdom proficiency (Cleric/Druid/Ranger), Mind Blank, Devotion Paladin Aura.',
    dangerousSpells: ['Hold Person', 'Hypnotic Pattern', 'Banishment', 'Dominate Person', 'Polymorph'],
  },
  {
    save: 'CON',
    tier: 'Important',
    color: '#f97316',
    frequency: 'Common — poison, concentration, death effects.',
    bestDefense: 'Resilient (CON), War Caster, high CON score, Dwarven Resilience.',
    dangerousSpells: ['Power Word Stun', 'Blight', 'Contagion', 'Cloudkill'],
  },
  {
    save: 'CHA',
    tier: 'Rare but Deadly',
    color: '#a855f7',
    frequency: 'Uncommon — Banishment, Planar effects, some undead.',
    bestDefense: 'Paladin (proficiency), high CHA, Countercharm (Bard).',
    dangerousSpells: ['Banishment', 'Divine Word', 'Dispel Evil and Good'],
  },
  {
    save: 'STR',
    tier: 'Uncommon',
    color: '#3b82f6',
    frequency: 'Rare in spells. Grapple/shove checks, some traps.',
    bestDefense: 'High STR, Athletics proficiency, Freedom of Movement.',
    dangerousSpells: ['Telekinesis', 'Entangle', 'Earthquake'],
  },
  {
    save: 'INT',
    tier: 'Rare',
    color: '#6b7280',
    frequency: 'Very rare. Mostly aberration/illusion effects.',
    bestDefense: 'INT is rarely targeted — usually safe to dump.',
    dangerousSpells: ['Feeblemind', 'Synaptic Static', 'Mind Flayer Extract Brain'],
  },
];

export const SAVE_PROFICIENCY_BY_CLASS = {
  Barbarian: ['STR', 'CON'],
  Bard: ['DEX', 'CHA'],
  Cleric: ['WIS', 'CHA'],
  Druid: ['INT', 'WIS'],
  Fighter: ['STR', 'CON'],
  Monk: ['STR', 'DEX'],
  Paladin: ['WIS', 'CHA'],
  Ranger: ['STR', 'DEX'],
  Rogue: ['DEX', 'INT'],
  Sorcerer: ['CON', 'CHA'],
  Warlock: ['WIS', 'CHA'],
  Wizard: ['INT', 'WIS'],
};

export const SAVE_IMPROVEMENT_OPTIONS = [
  { method: 'Resilient feat', effect: '+1 to chosen ability, gain save proficiency.', note: 'Resilient (WIS) and Resilient (CON) are the most popular.' },
  { method: 'Paladin Aura (6th)', effect: 'Add CHA mod to ALL saves for allies within 10ft (30ft at 18th).', note: 'Best save booster in the game. Stacks with proficiency.' },
  { method: 'Ring/Cloak of Protection', effect: '+1 to AC and ALL saving throws.', note: 'Requires attunement. Stacks with everything.' },
  { method: 'Lucky feat', effect: '3 luck points per day. Reroll any d20 (including saves).', note: 'Versatile but limited uses.' },
  { method: 'Diamond Soul (Monk 14)', effect: 'Proficiency in ALL saving throws.', note: 'Spend 1 ki to reroll a failed save.' },
  { method: 'Bless spell', effect: '+1d4 to saves and attacks for 3 creatures.', note: 'Concentration. Average +2.5 to all saves.' },
];

export function getSaveInfo(save) {
  return SAVE_RANKINGS.find(s => s.save.toUpperCase() === (save || '').toUpperCase()) || null;
}

export function getClassSaves(className) {
  return SAVE_PROFICIENCY_BY_CLASS[className] || [];
}

export function getWeakSaves(className) {
  const proficient = getClassSaves(className);
  const allSaves = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  return allSaves.filter(s => !proficient.includes(s));
}
