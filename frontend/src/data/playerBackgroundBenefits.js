/**
 * playerBackgroundBenefits.js
 * Player Mode: Background features, skill proficiencies, and tools
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// BACKGROUNDS
// ---------------------------------------------------------------------------

export const BACKGROUNDS = [
  {
    name: 'Acolyte',
    skills: ['Insight', 'Religion'],
    languages: 2,
    tools: [],
    feature: 'Shelter of the Faithful',
    featureDesc: 'You and your party can receive free healing at temples of your faith. Clergy will support you at a modest lifestyle.',
    equipment: 'Holy symbol, prayer book, 5 sticks of incense, vestments, 15 gp',
  },
  {
    name: 'Charlatan',
    skills: ['Deception', 'Sleight of Hand'],
    languages: 0,
    tools: ['Disguise Kit', 'Forgery Kit'],
    feature: 'False Identity',
    featureDesc: 'You have a second identity with documentation, acquaintances, and disguises. You can forge documents if you\'ve seen similar ones.',
  },
  {
    name: 'Criminal',
    skills: ['Deception', 'Stealth'],
    languages: 0,
    tools: ['Gaming Set (one)', 'Thieves\' Tools'],
    feature: 'Criminal Contact',
    featureDesc: 'You have a reliable contact who acts as a liaison to a criminal network.',
  },
  {
    name: 'Entertainer',
    skills: ['Acrobatics', 'Performance'],
    languages: 0,
    tools: ['Disguise Kit', 'Musical Instrument (one)'],
    feature: 'By Popular Demand',
    featureDesc: 'You can find a place to perform. Free lodging and food of modest/comfortable quality.',
  },
  {
    name: 'Folk Hero',
    skills: ['Animal Handling', 'Survival'],
    languages: 0,
    tools: ['Artisan\'s Tools (one)', 'Vehicles (Land)'],
    feature: 'Rustic Hospitality',
    featureDesc: 'Common folk will shelter you, hiding you from law if needed.',
  },
  {
    name: 'Guild Artisan',
    skills: ['Insight', 'Persuasion'],
    languages: 1,
    tools: ['Artisan\'s Tools (one)'],
    feature: 'Guild Membership',
    featureDesc: 'Guild provides lodging, legal support, political connections. 5gp/month dues.',
  },
  {
    name: 'Hermit',
    skills: ['Medicine', 'Religion'],
    languages: 1,
    tools: ['Herbalism Kit'],
    feature: 'Discovery',
    featureDesc: 'You have discovered a unique truth — a powerful revelation worked out with DM.',
  },
  {
    name: 'Noble',
    skills: ['History', 'Persuasion'],
    languages: 1,
    tools: ['Gaming Set (one)'],
    feature: 'Position of Privilege',
    featureDesc: 'People assume the best of you. Welcome in high society. Common folk accommodate you.',
  },
  {
    name: 'Outlander',
    skills: ['Athletics', 'Survival'],
    languages: 1,
    tools: ['Musical Instrument (one)'],
    feature: 'Wanderer',
    featureDesc: 'Excellent memory for geography. Can find food/water for yourself and 5 others daily in the wild.',
  },
  {
    name: 'Sage',
    skills: ['Arcana', 'History'],
    languages: 2,
    tools: [],
    feature: 'Researcher',
    featureDesc: 'When you don\'t know information, you often know where and from whom to learn it.',
  },
  {
    name: 'Sailor',
    skills: ['Athletics', 'Perception'],
    languages: 0,
    tools: ['Navigator\'s Tools', 'Vehicles (Water)'],
    feature: 'Ship\'s Passage',
    featureDesc: 'Free passage on a sailing ship for you and your party in exchange for crew work.',
  },
  {
    name: 'Soldier',
    skills: ['Athletics', 'Intimidation'],
    languages: 0,
    tools: ['Gaming Set (one)', 'Vehicles (Land)'],
    feature: 'Military Rank',
    featureDesc: 'You have military rank. Soldiers of lower rank defer to you. Can invoke rank for access to fortresses.',
  },
  {
    name: 'Urchin',
    skills: ['Sleight of Hand', 'Stealth'],
    languages: 0,
    tools: ['Disguise Kit', 'Thieves\' Tools'],
    feature: 'City Secrets',
    featureDesc: 'You know secret patterns and flow through the city. Travel between any two locations in a city at twice normal speed.',
  },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get background by name.
 */
export function getBackground(name) {
  return BACKGROUNDS.find(b => b.name.toLowerCase() === (name || '').toLowerCase()) || null;
}

/**
 * Get all skill proficiencies from a background.
 */
export function getBackgroundSkills(name) {
  const bg = getBackground(name);
  return bg ? bg.skills : [];
}

/**
 * Search backgrounds by skill.
 */
export function findBackgroundsBySkill(skillName) {
  return BACKGROUNDS.filter(b =>
    b.skills.some(s => s.toLowerCase() === skillName.toLowerCase())
  );
}
