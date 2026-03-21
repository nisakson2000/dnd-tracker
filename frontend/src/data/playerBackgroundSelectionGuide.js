/**
 * playerBackgroundSelectionGuide.js
 * Player Mode: Background selection — skills, tools, and features
 * Pure JS — no React dependencies.
 */

export const BACKGROUND_OVERVIEW = {
  grants: ['2 skill proficiencies', '2 tool/language proficiencies', 'Equipment', 'Background feature'],
  note: 'Plan skills to avoid overlap with class proficiencies.',
};

export const BEST_BACKGROUNDS = [
  { background: 'Criminal', skills: 'Deception, Stealth', tools: 'Thieves\' tools, gaming set', rating: 'S', note: 'Thieves\' tools for non-Rogues.' },
  { background: 'Outlander', skills: 'Athletics, Survival', feature: 'Auto-forage for 5 people', rating: 'A+' },
  { background: 'Sage', skills: 'Arcana, History', feature: 'Know where to find lore', rating: 'A+' },
  { background: 'Acolyte', skills: 'Insight, Religion', feature: 'Free temple lodging', rating: 'A' },
  { background: 'Noble', skills: 'History, Persuasion', feature: 'Access to high society', rating: 'A' },
  { background: 'Charlatan', skills: 'Deception, Sleight of Hand', feature: 'False Identity', rating: 'A' },
  { background: 'Urchin', skills: 'Sleight of Hand, Stealth', tools: 'Thieves\' tools', rating: 'A' },
  { background: 'Guild Artisan', skills: 'Insight, Persuasion', feature: 'Guild contacts', rating: 'A' },
  { background: 'Soldier', skills: 'Athletics, Intimidation', feature: 'Military Rank', rating: 'A' },
  { background: 'Hermit', skills: 'Medicine, Religion', tools: 'Herbalism kit', rating: 'B+' },
];

export const SKILL_PRIORITY_BY_ROLE = {
  tank: ['Athletics', 'Perception', 'Intimidation'],
  caster: ['Arcana', 'Perception', 'Investigation'],
  face: ['Persuasion', 'Deception', 'Insight'],
  scout: ['Stealth', 'Perception', 'Survival'],
  note: 'Perception is the best skill for EVERYONE.',
};

export const CUSTOM_BACKGROUNDS = {
  rule: 'PHB allows custom: any 2 skills, any 2 tools/languages, any feature.',
  tip: 'Best custom: Perception + most-needed skill, thieves\' tools + a language.',
};

export const TOOL_PROFICIENCY_VALUE = [
  { tool: 'Thieves\' tools', note: 'Pick locks, disable traps. Essential.', rating: 'S' },
  { tool: 'Herbalism kit', note: 'Craft Potions of Healing (DM-dependent).', rating: 'A' },
  { tool: 'Disguise kit', note: 'Disguises without magic. Pairs with Deception.', rating: 'A' },
  { tool: 'Cook\'s utensils', note: 'Chef feat synergy.', rating: 'A' },
  { tool: 'Forgery kit', note: 'Fake documents for infiltration.', rating: 'B+' },
];
