/**
 * playerDifficultyClassGuide.js
 * Player Mode: Understanding and optimizing your save DC
 * Pure JS — no React dependencies.
 */

export const DC_BASICS = {
  formula: '8 + proficiency bonus + spellcasting ability modifier',
  maxDC: 'At L20 with +5 modifier: 8 + 6 + 5 = 19. With +1 items: 20. With Ioun Stone: 21.',
  importanceOfMaxing: '+1 to DC = 5% more likely every save-or-suck spell lands. Prioritize maxing your casting stat.',
  note: 'Your DC determines how effective ALL your save-based spells are. It\'s the most important number for casters.',
};

export const DC_PROGRESSION = [
  { level: 1, profBonus: 2, withPlus3: 13, withPlus4: 14, withPlus5: 15 },
  { level: 4, profBonus: 2, withPlus3: 13, withPlus4: 14, withPlus5: 15 },
  { level: 5, profBonus: 3, withPlus3: 14, withPlus4: 15, withPlus5: 16 },
  { level: 8, profBonus: 3, withPlus3: 14, withPlus4: 15, withPlus5: 16 },
  { level: 9, profBonus: 4, withPlus3: 15, withPlus4: 16, withPlus5: 17 },
  { level: 13, profBonus: 5, withPlus3: 16, withPlus4: 17, withPlus5: 18 },
  { level: 17, profBonus: 6, withPlus3: 17, withPlus4: 18, withPlus5: 19 },
];

export const SAVE_TARGETING = {
  strongSaves: ['DEX', 'CON', 'WIS'],
  weakSaves: ['STR', 'INT', 'CHA'],
  note: 'Most monsters have high DEX/CON/WIS saves. Target STR/INT/CHA when possible.',
  examples: [
    { save: 'STR', goodSpells: ['Entangle', 'Web', 'Maximilian\'s Earthen Grasp', 'Telekinesis'], note: 'Casters and flying creatures have bad STR.' },
    { save: 'INT', goodSpells: ['Mind Sliver', 'Phantasmal Force', 'Synaptic Static', 'Feeblemind'], note: 'Most monsters have terrible INT. Best save to target.' },
    { save: 'CHA', goodSpells: ['Banishment', 'Zone of Truth', 'Command'], note: 'Beasts and many creatures have bad CHA. Fiends have good CHA.' },
    { save: 'DEX', goodSpells: ['Fireball', 'Lightning Bolt'], note: 'Many creatures have decent DEX. But AoE damage still does half on save.' },
    { save: 'CON', goodSpells: ['Blight', 'Cloudkill'], note: 'Most monsters have good CON. Worst save to target usually.' },
    { save: 'WIS', goodSpells: ['Hold Person', 'Hypnotic Pattern', 'Fear'], note: 'Common target. Many powerful WIS-save spells. But many monsters have decent WIS.' },
  ],
};

export const DC_BOOSTING_METHODS = [
  { method: 'Max your casting stat', effect: '+1 DC per point of modifier', priority: 1, note: 'Always do this first. +3 to +5 = +2 DC = 10% better spell success.' },
  { method: 'Amulet/Rod/Bloodwell +1/+2/+3', effect: '+1 to +3 DC', priority: 2, note: 'Rod of the Pact Keeper, Amulet of the Devout, etc. Magic items that boost DC.' },
  { method: 'Heightened Spell (Sorcerer)', effect: 'Disadvantage on save', priority: 3, note: '3 SP. Target saves with disadvantage. Equivalent to roughly +5 DC.' },
  { method: 'Hound of Ill Omen (Shadow)', effect: 'Disadvantage on save', priority: 3, note: '3 SP. Same effect as Heightened but via summon.' },
  { method: 'Bestow Curse (save penalty)', effect: '-1d4 to saves (one ability)', priority: 3, note: 'Requires concentration and setup but strong.' },
  { method: 'Bane', effect: '-1d4 to saves', priority: 3, note: 'Party-wide debuff. -1d4 avg = -2.5 to all saves.' },
  { method: 'Mind Sliver cantrip', effect: '-1d4 to next save', priority: 3, note: 'Cantrip. Target -1d4 to next save before end of your next turn. Combo with save spell.' },
];

export function spellSaveDC(profBonus, abilityMod, itemBonus = 0) {
  return 8 + profBonus + abilityMod + itemBonus;
}

export function saveChance(targetSaveMod, dc) {
  return Math.min(0.95, Math.max(0.05, (21 - (dc - targetSaveMod)) / 20));
}

export function saveChanceWithDisadvantage(targetSaveMod, dc) {
  const single = saveChance(targetSaveMod, dc);
  return single * single; // both rolls must succeed
}
