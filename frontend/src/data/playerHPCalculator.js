/**
 * playerHPCalculator.js
 * Player Mode: HP calculation, hit dice tracking, and temp HP rules
 * Pure JS — no React dependencies.
 */

export const CLASS_HIT_DICE = {
  Barbarian: { die: 'd12', average: 7 },
  Fighter: { die: 'd10', average: 6 },
  Paladin: { die: 'd10', average: 6 },
  Ranger: { die: 'd10', average: 6 },
  Bard: { die: 'd8', average: 5 },
  Cleric: { die: 'd8', average: 5 },
  Druid: { die: 'd8', average: 5 },
  Monk: { die: 'd8', average: 5 },
  Rogue: { die: 'd8', average: 5 },
  Warlock: { die: 'd8', average: 5 },
  Sorcerer: { die: 'd6', average: 4 },
  Wizard: { die: 'd6', average: 4 },
};

export const TEMP_HP_RULES = {
  stacking: 'Temp HP does NOT stack. You choose to keep current or replace with new.',
  healing: 'Healing does NOT restore temp HP. They are separate.',
  duration: 'Temp HP lasts until depleted or after a long rest (unless specified).',
  damage: 'Temp HP takes damage first, then remaining damage hits real HP.',
  deathSaves: 'Temp HP at 0 does NOT prevent death saves — it is a buffer above 0.',
};

export const HP_BOOST_SOURCES = [
  { source: 'Tough Feat', bonus: '+2 HP per level', note: 'Retroactive. Best HP feat in the game.' },
  { source: 'CON Increase', bonus: '+1 HP per level per +1 CON mod', note: 'Retroactive. Also improves concentration saves.' },
  { source: 'Hill Dwarf', bonus: '+1 HP per level', note: 'Stacks with Tough for +3 HP/level.' },
  { source: 'Aid Spell', bonus: '+5/+10/+15 max HP', note: '8 hours, no concentration. Entire party buff.' },
  { source: 'Heroes\' Feast', bonus: '+2d10 max HP', note: '24 hours. Also poison/fear immunity.' },
  { source: 'Draconic Resilience (Sorcerer)', bonus: '+1 HP per sorcerer level', note: 'Like a free Tough feat for sorcerers.' },
];

export function calculateMaxHP(className, level, conMod) {
  const classInfo = CLASS_HIT_DICE[className];
  if (!classInfo) return null;
  const dieMax = parseInt(classInfo.die.replace('d', ''));
  // Level 1: max die + CON. Levels 2+: average + CON each.
  const firstLevel = dieMax + conMod;
  const otherLevels = (level - 1) * (classInfo.average + conMod);
  return Math.max(firstLevel + otherLevels, level); // minimum 1 HP per level
}

export function getHitDiceRemaining(totalLevel, spent) {
  return Math.max(0, totalLevel - (spent || 0));
}

export function hitDiceRecovery(totalLevel) {
  return Math.max(1, Math.floor(totalLevel / 2));
}

export function calculateHealOnShortRest(dieType, conMod, numDice) {
  const dieMax = parseInt(dieType.replace('d', ''));
  const avg = (dieMax / 2 + 0.5) + conMod;
  return {
    average: Math.floor(avg * numDice),
    minimum: numDice * (1 + conMod),
    maximum: numDice * (dieMax + conMod),
  };
}
