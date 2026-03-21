/**
 * playerAlignmentGuide.js
 * Player Mode: Alignment descriptions and roleplaying guides
 * Pure JS — no React dependencies.
 */

export const ALIGNMENTS = [
  { id: 'LG', name: 'Lawful Good', short: 'Crusader', description: 'Follows rules and codes to do what is right. Protects the innocent and upholds justice.', examples: ['Paladin of Tyr', 'Knight who refuses to break their oath'] },
  { id: 'NG', name: 'Neutral Good', short: 'Benefactor', description: 'Does the best they can to help others. Follows rules when helpful, breaks them when necessary.', examples: ['Healer who helps anyone', 'Robin Hood archetype'] },
  { id: 'CG', name: 'Chaotic Good', short: 'Rebel', description: 'Acts on conscience with little regard for law. Values freedom and doing what\'s right.', examples: ['Freedom fighter', 'Vigilante hero'] },
  { id: 'LN', name: 'Lawful Neutral', short: 'Judge', description: 'Lives by a code, laws, or traditions without bias toward good or evil.', examples: ['Fair judge', 'Monk following tradition', 'Soldier following orders'] },
  { id: 'N', name: 'True Neutral', short: 'Undecided', description: 'Acts naturally without strong moral compass. May seek balance.', examples: ['Druid maintaining balance', 'Commoner minding their own business'] },
  { id: 'CN', name: 'Chaotic Neutral', short: 'Free Spirit', description: 'Follows their own whims. Values personal freedom above all.', examples: ['Trickster who lives by their wits', 'Wanderer following their heart'] },
  { id: 'LE', name: 'Lawful Evil', short: 'Dominator', description: 'Methodically takes what they want within a code of conduct.', examples: ['Tyrant king', 'Corrupt official', 'Devil'] },
  { id: 'NE', name: 'Neutral Evil', short: 'Malefactor', description: 'Does whatever they can get away with. Pure self-interest.', examples: ['Mercenary with no loyalty', 'Scheming villain'] },
  { id: 'CE', name: 'Chaotic Evil', short: 'Destroyer', description: 'Acts with arbitrary violence and cruelty. No respect for rules, life, or anything.', examples: ['Demon', 'Psychotic villain', 'Barbarian warlord'] },
];

export function getAlignment(id) {
  return ALIGNMENTS.find(a => a.id === id) || null;
}

export function getAlignmentByName(name) {
  return ALIGNMENTS.find(a => a.name.toLowerCase() === (name || '').toLowerCase()) || null;
}

export function getAlignmentGrid() {
  return [
    ['LG', 'NG', 'CG'],
    ['LN', 'N', 'CN'],
    ['LE', 'NE', 'CE'],
  ];
}
