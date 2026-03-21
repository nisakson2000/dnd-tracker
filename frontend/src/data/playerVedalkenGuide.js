/**
 * playerVedalkenGuide.js
 * Player Mode: Vedalken race guide — the analytical perfectionists
 * Pure JS — no React dependencies.
 */

export const VEDALKEN_BASICS = {
  race: 'Vedalken',
  source: 'Guildmasters\' Guide to Ravnica',
  asi: '+2 INT, +1 WIS',
  speed: 30,
  size: 'Medium',
  languages: ['Common', 'Vedalken', 'one of your choice'],
  theme: 'Logical, methodical, endlessly curious. Blue-skinned scholars obsessed with perfection.',
};

export const VEDALKEN_TRAITS = [
  { trait: 'Vedalken Dispassion', effect: 'Advantage on INT, WIS, and CHA saving throws.', rating: 'S', note: 'Advantage on THREE mental saves. This is incredibly powerful. Resists charm, fear, wisdom drains, INT effects.' },
  { trait: 'Tireless Precision', effect: 'Proficiency with one tool and one skill (from History, Investigation, Medicine, Performance, Sleight of Hand). Add 1d4 to checks with those.', rating: 'A', note: '+1d4 to a skill check is like permanent Guidance for that skill. Great for Investigation or Medicine.' },
  { trait: 'Partially Amphibious', effect: 'Breathe underwater for 1 hour. Must be on land for at least 1 hour to recharge.', rating: 'C', note: 'Very niche. 1 hour underwater every other hour. Not true water breathing.' },
];

export const VEDALKEN_BUILDS = [
  { build: 'Wizard (any school)', why: '+2 INT is perfect. Advantage on INT/WIS/CHA saves is insane for a d6 HP class. Abjuration or Divination.', rating: 'S' },
  { build: 'Artificer (any)', why: '+2 INT + WIS. Advantage on mental saves. Tool proficiency stacks. Perfect fit.', rating: 'S' },
  { build: 'Knowledge Cleric', why: '+1 WIS for casting. Advantage on WIS saves stacks with Cleric. Investigation expertise synergy.', rating: 'A' },
  { build: 'Inquisitive Rogue', why: 'Investigation + Insight focus. +1d4 to Investigation. Advantage on mental saves for durability.', rating: 'A' },
];

export function vedalkenDispassionSaveChance(baseSaveBonus, dc) {
  // Advantage on mental saves
  const singleChance = Math.min(0.95, Math.max(0.05, (21 - (dc - baseSaveBonus)) / 20));
  return 1 - (1 - singleChance) * (1 - singleChance); // advantage
}
