/**
 * playerRacialFeatureRankGuide.js
 * Player Mode: Best racial features ranked across all races
 * Pure JS — no React dependencies.
 */

export const TOP_RACIAL_FEATURES = [
  { race: 'Half-Elf', feature: 'Flexible ASI (+2 CHA, +1/+1 any)', rating: 'S+', why: 'Best ASI spread. Fits any CHA class.' },
  { race: 'Variant Human', feature: 'Free Feat at L1', rating: 'S+', why: 'Any feat at level 1. PAM, GWM, SS, Lucky, etc.' },
  { race: 'Custom Lineage', feature: 'Free Feat + Darkvision or Skill', rating: 'S+', why: 'V.Human but better. +2 to any stat.' },
  { race: 'Yuan-Ti Pureblood', feature: 'Magic Resistance (advantage on saves vs spells)', rating: 'S+', why: 'Advantage on ALL spell saves. Broken.' },
  { race: 'Satyr', feature: 'Magic Resistance + Fey type', rating: 'S+', why: 'Magic Resistance + immune to humanoid-targeting spells.' },
  { race: 'Elf (all)', feature: 'Fey Ancestry (advantage vs charm, immune to sleep)', rating: 'S', why: 'Common conditions. Always useful.' },
  { race: 'Dwarf', feature: 'Dwarven Resilience (advantage vs poison, resistance)', rating: 'S', why: 'Poison is common. Half damage + advantage on saves.' },
  { race: 'Halfling', feature: 'Lucky (reroll natural 1s on d20)', rating: 'S', why: 'Never critically fail. Passive reliability.' },
  { race: 'Gnome', feature: 'Gnome Cunning (advantage INT/WIS/CHA saves vs magic)', rating: 'S+', why: 'Mini Magic Resistance. Covers most dangerous saves.' },
  { race: 'Half-Orc', feature: 'Relentless Endurance (drop to 1 HP instead of 0, 1/long rest)', rating: 'A+', why: 'Free death save. Stays up in combat.' },
  { race: 'Goliath', feature: 'Stone\'s Endurance (reduce damage by 1d12+CON, 1/short rest)', rating: 'A+', why: 'Free damage reduction. Short rest recovery.' },
  { race: 'Aasimar', feature: 'Healing Hands (heal HP = level, 1/long rest)', rating: 'A', why: 'Free healing. Scales with level.' },
  { race: 'Aarakocra', feature: 'Flight (50ft fly speed)', rating: 'S+', why: 'Permanent flight from L1. Breaks encounters.' },
  { race: 'Gem Dragonborn', feature: 'Gem Flight (L5)', rating: 'S', why: 'Flight at L5 for 1 minute. Prof bonus uses.' },
  { race: 'Tortle', feature: 'Natural Armor (AC 17 flat)', rating: 'A+', why: 'AC 17 with no armor. No DEX needed. Dump DEX safely.' },
];

export const BEST_RACE_BY_BUILD = {
  caster: 'Gnome (Cunning), Yuan-Ti (Magic Resistance), Half-Elf (ASI)',
  melee: 'Half-Orc (Relentless), Goliath (Stone\'s Endurance), V.Human (feat)',
  ranged: 'V.Human (Sharpshooter L1), Halfling (Lucky), Aarakocra (flight)',
  tank: 'Tortle (AC 17), Goliath (damage reduction), Dwarf (poison resist)',
  skillMonkey: 'Half-Elf (2 skills + ASI), V.Human (Skill Expert), Tabaxi (climb + skills)',
  social: 'Half-Elf (+2 CHA + skills), Changeling (Shapechanger), Fierna Tiefling',
};

export const RACIAL_FEATURE_TIPS = [
  'V.Human/Custom Lineage: feat at L1 is the strongest racial feature.',
  'Magic Resistance (Yuan-Ti, Satyr): advantage on ALL spell saves.',
  'Gnome Cunning: advantage on INT/WIS/CHA saves vs magic.',
  'Halfling Lucky: reroll natural 1s. Passive and powerful.',
  'Half-Orc Relentless: drop to 1 HP instead of 0. Once per long rest.',
  'Flight (Aarakocra): 50ft fly from L1. Check if DM allows.',
  'Tortle: AC 17 flat. Perfect for MAD classes (Monk, Cleric).',
  'Dwarf poison resistance: always useful. Many monsters use poison.',
  'Elf Fey Ancestry: charm immunity is common and dangerous.',
  'Half-Elf: most flexible race. +2 CHA, +1/+1, 2 skills, darkvision.',
];
