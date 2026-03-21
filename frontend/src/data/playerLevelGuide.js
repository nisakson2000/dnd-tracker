/**
 * playerLevelGuide.js
 * Player Mode: Level-by-level progression guide for all tiers of play
 * Pure JS — no React dependencies.
 */

export const TIERS_OF_PLAY = [
  {
    tier: 1,
    name: 'Local Heroes',
    levels: '1-4',
    description: 'New adventurers. Handle local threats.',
    typicalEnemies: 'Goblins, bandits, wolves, low-CR undead, cultists.',
    challenges: 'Learning abilities, resource management, basic tactics.',
    tips: 'Don\'t be reckless — characters die easily at low levels. Use short rests.',
  },
  {
    tier: 2,
    name: 'Heroes of the Realm',
    levels: '5-10',
    description: 'Established adventurers. Regional reputation.',
    typicalEnemies: 'Giants, young dragons, vampire spawn, mind flayers, elementals.',
    challenges: 'More complex encounters, multiple combats per day, travel adventures.',
    tips: 'Level 5 is a HUGE power spike for every class. Embrace your new abilities.',
  },
  {
    tier: 3,
    name: 'Masters of the Realm',
    levels: '11-16',
    description: 'Powerful heroes. Continental influence.',
    typicalEnemies: 'Adult dragons, liches, beholders, demon lords\' minions.',
    challenges: 'Political intrigue, planar threats, legendary creatures.',
    tips: 'You have the tools to handle almost anything. Think creatively.',
  },
  {
    tier: 4,
    name: 'Masters of the World',
    levels: '17-20',
    description: 'Legendary heroes. World-shaping power.',
    typicalEnemies: 'Ancient dragons, demigods, archdevils, tarrasque.',
    challenges: 'World-ending threats, divine politics, planar warfare.',
    tips: 'Your characters can reshape reality. Think big.',
  },
];

export const XP_MILESTONES = [
  { level: 1, xp: 0 },
  { level: 2, xp: 300 },
  { level: 3, xp: 900 },
  { level: 4, xp: 2700 },
  { level: 5, xp: 6500 },
  { level: 6, xp: 14000 },
  { level: 7, xp: 23000 },
  { level: 8, xp: 34000 },
  { level: 9, xp: 48000 },
  { level: 10, xp: 64000 },
  { level: 11, xp: 85000 },
  { level: 12, xp: 100000 },
  { level: 13, xp: 120000 },
  { level: 14, xp: 140000 },
  { level: 15, xp: 165000 },
  { level: 16, xp: 195000 },
  { level: 17, xp: 225000 },
  { level: 18, xp: 265000 },
  { level: 19, xp: 305000 },
  { level: 20, xp: 355000 },
];

export const LEVEL_UP_UNIVERSAL = [
  'Roll Hit Die (or take average) + CON mod for new HP.',
  'Check class table for new features.',
  'Check if proficiency bonus increased (levels 5, 9, 13, 17).',
  'Prepared casters: you may be able to prepare more spells.',
  'Known casters: check if you learn new spells (or can swap one).',
  'At levels 4, 8, 12, 16, 19: ASI or feat (Fighter gets extras at 6, 14).',
  'Update your spell save DC and spell attack bonus if casting ability increased.',
  'Check if cantrip damage scales (levels 5, 11, 17).',
];

export function getTier(level) {
  if (level <= 4) return TIERS_OF_PLAY[0];
  if (level <= 10) return TIERS_OF_PLAY[1];
  if (level <= 16) return TIERS_OF_PLAY[2];
  return TIERS_OF_PLAY[3];
}

export function getXPForLevel(level) {
  const entry = XP_MILESTONES.find(m => m.level === level);
  return entry ? entry.xp : 0;
}

export function getXPToNextLevel(currentLevel, currentXP) {
  const nextLevel = XP_MILESTONES.find(m => m.level === currentLevel + 1);
  if (!nextLevel) return 0;
  return Math.max(0, nextLevel.xp - currentXP);
}
