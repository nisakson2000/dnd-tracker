/**
 * playerBackgroundOptimization.js
 * Player Mode: Background selection and feature optimization for character builds
 * Pure JS — no React dependencies.
 */

export const BEST_BACKGROUNDS = [
  {
    background: 'Criminal/Spy',
    skills: 'Deception, Stealth',
    tools: 'Thieves\' Tools, gaming set',
    feature: 'Criminal Contact: reliable contact for underground information.',
    bestFor: 'Rogue, Warlock, Bard — anyone with a shady side.',
    rating: 'A',
  },
  {
    background: 'Acolyte',
    skills: 'Insight, Religion',
    tools: 'None',
    feature: 'Shelter of the Faithful: free room/board at temples. Cleric backup from your faith.',
    bestFor: 'Cleric, Paladin — religious characters.',
    rating: 'A',
  },
  {
    background: 'Sage',
    skills: 'Arcana, History',
    tools: 'None',
    feature: 'Researcher: know where to find information. Lore access.',
    bestFor: 'Wizard, Artificer — knowledge-focused builds.',
    rating: 'A',
  },
  {
    background: 'Outlander',
    skills: 'Athletics, Survival',
    tools: 'Musical instrument',
    feature: 'Wanderer: never get lost, always find food for yourself + 5 others.',
    bestFor: 'Ranger, Druid, Barbarian — wilderness survival.',
    rating: 'A',
  },
  {
    background: 'Noble',
    skills: 'History, Persuasion',
    tools: 'Gaming set',
    feature: 'Position of Privilege: welcome in high society. Free lodging.',
    bestFor: 'Paladin, Bard, Sorcerer — social encounters.',
    rating: 'B',
  },
  {
    background: 'Soldier',
    skills: 'Athletics, Intimidation',
    tools: 'Gaming set, land vehicles',
    feature: 'Military Rank: soldiers recognize your authority. Can requisition supplies.',
    bestFor: 'Fighter, Barbarian, Paladin — military characters.',
    rating: 'B',
  },
  {
    background: 'Haunted One (CoS)',
    skills: 'Choose 2 from Arcana, Investigation, Religion, Survival',
    tools: 'None',
    feature: 'Heart of Darkness: commoners go out of their way to help you. Dark secret.',
    bestFor: 'Horror campaigns. Flexible skill choices.',
    rating: 'A',
  },
  {
    background: 'Urchin',
    skills: 'Sleight of Hand, Stealth',
    tools: 'Disguise kit, Thieves\' Tools',
    feature: 'City Secrets: travel through cities at double speed between locations.',
    bestFor: 'Rogue, Monk — urban campaigns.',
    rating: 'B',
  },
  {
    background: 'Far Traveler (SCAG)',
    skills: 'Insight, Perception',
    tools: 'Choose 1 musical instrument or gaming set',
    feature: 'All Eyes on You: foreigners are curious about you. Social advantage.',
    bestFor: 'Exotic race/class combos. Good RP hook.',
    rating: 'B',
  },
  {
    background: 'Clan Crafter (SCAG)',
    skills: 'History, Insight',
    tools: 'One artisan tool',
    feature: 'Respect of the Stout Folk: free lodging among dwarves/crafters.',
    bestFor: 'Artificer, Forge Cleric — crafting builds.',
    rating: 'B',
  },
];

export const CUSTOM_BACKGROUND = {
  rule: 'PHB p. 125: You can customize a background. Choose 2 skills, 2 tool/language proficiencies, and a feature from any background.',
  bestCombos: [
    { skills: 'Stealth + Perception', reason: 'Best scout combo. See threats, avoid being seen.' },
    { skills: 'Perception + Investigation', reason: 'Find everything. Traps, secrets, hidden enemies.' },
    { skills: 'Persuasion + Deception', reason: 'Social powerhouse. Convince or deceive anyone.' },
    { skills: 'Athletics + Acrobatics', reason: 'Physical challenges. Climbing, swimming, escaping grapples.' },
  ],
  note: 'Custom backgrounds are always allowed by RAW. Tell your DM your concept and build around it.',
};

export function backgroundSkillOverlap(classSkills, backgroundSkills) {
  const overlap = backgroundSkills.filter(s => classSkills.includes(s));
  return { overlapping: overlap, wasted: overlap.length, tip: overlap.length > 0 ? 'Choose different skills to avoid waste' : 'No overlap — good choice!' };
}
