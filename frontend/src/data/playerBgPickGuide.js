/**
 * playerBgPickGuide.js
 * Player Mode: Background selection — features, skill proficiencies, optimization
 * Pure JS — no React dependencies.
 */

export const BACKGROUND_RANKINGS = [
  { background: 'Criminal / Spy', skills: ['Deception', 'Stealth'], tools: ['Thieves\' tools', 'Gaming set'], feature: 'Criminal Contact: underworld connection.', rating: 'S', bestFor: 'Rogue, Warlock.' },
  { background: 'Acolyte', skills: ['Insight', 'Religion'], feature: 'Shelter of the Faithful: free temple lodging.', rating: 'A+', bestFor: 'Cleric, Paladin.' },
  { background: 'Soldier', skills: ['Athletics', 'Intimidation'], feature: 'Military Rank: command NPCs.', rating: 'A+', bestFor: 'Fighter, Barbarian.' },
  { background: 'Noble', skills: ['History', 'Persuasion'], feature: 'Position of Privilege: high society.', rating: 'A', bestFor: 'Bard, Sorcerer.' },
  { background: 'Outlander', skills: ['Athletics', 'Survival'], feature: 'Wanderer: always find food/water.', rating: 'A+', bestFor: 'Ranger, Druid.' },
  { background: 'Sage', skills: ['Arcana', 'History'], feature: 'Researcher.', rating: 'A', bestFor: 'Wizard, Artificer.' },
  { background: 'Charlatan', skills: ['Deception', 'Sleight of Hand'], feature: 'False Identity.', rating: 'A', bestFor: 'Rogue, Bard.' },
  { background: 'Urchin', skills: ['Sleight of Hand', 'Stealth'], tools: ['Thieves\' tools'], feature: 'City Secrets.', rating: 'A', bestFor: 'Rogue.' },
  { background: 'Haunted One', skills: ['Choose 2 of Arcana/Investigation/Religion/Survival'], feature: 'Heart of Darkness.', rating: 'A', bestFor: 'Flexible pick.' },
  { background: 'Guild Artisan', skills: ['Insight', 'Persuasion'], feature: 'Guild Membership.', rating: 'A', bestFor: 'Artificer, Bard.' },
  { background: 'Hermit', skills: ['Medicine', 'Religion'], tools: ['Herbalism kit'], feature: 'Discovery.', rating: 'B+', bestFor: 'Cleric, Druid.' },
  { background: 'Folk Hero', skills: ['Animal Handling', 'Survival'], feature: 'Rustic Hospitality.', rating: 'B+', bestFor: 'Ranger.' },
];

export const CUSTOM_BG_RULE = {
  rule: 'PHB allows custom backgrounds: choose 2 skills, 2 tools/languages, any feature.',
  best: [
    { skills: ['Perception', 'Stealth'], why: 'Best adventurer combo.' },
    { skills: ['Persuasion', 'Insight'], why: 'Best social combo.' },
    { skills: ['Athletics', 'Perception'], why: 'Best martial combo.' },
  ],
};

export const BG_TIPS = [
  'Custom backgrounds let you pick exactly what you need.',
  'Criminal gives Thieves\' Tools without being a Rogue.',
  'Perception is the most important skill. Get it somewhere.',
  'Outlander: never get lost, always find food.',
  'Acolyte: free healing at temples. Money saver.',
  'Background features are roleplay, not combat.',
  'Herbalism kit: craft healing potions in downtime.',
  'Choose skills that complement your class, don\'t overlap.',
  'Ask your DM about custom backgrounds. Most allow them.',
  'Charlatan: false identity for infiltration campaigns.',
];
