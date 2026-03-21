/**
 * playerBackgroundOptimizationGuide.js
 * Player Mode: Background selection optimization for skills and features
 * Pure JS — no React dependencies.
 */

export const BACKGROUND_BASICS = {
  provides: ['2 skill proficiencies', '2 tool/language proficiencies', 'Equipment', 'Feature (RP benefit)'],
  customBackground: 'PHB p.125: Custom Background — choose any 2 skills, 2 tool/language proficiencies, and pick any feature. Very flexible.',
  note: 'Backgrounds are mostly for skills and flavor. The RP features rarely come up but can be powerful when they do.',
};

export const BACKGROUNDS_RANKED = [
  // S-tier (best skills/features)
  { background: 'Criminal/Spy', skills: ['Deception', 'Stealth'], tools: ['Thieves\' tools', 'Gaming set'], feature: 'Criminal Contact (underworld NPC)', rating: 'S', bestFor: 'Rogue, Warlock, Bard. Thieves\' tools + stealth + deception. Perfect thief package.' },
  { background: 'Outlander', skills: ['Athletics', 'Survival'], tools: ['Musical instrument'], feature: 'Wanderer (always find food/water, remember geography)', rating: 'A', bestFor: 'Barbarian, Ranger, Druid. Survival + Athletics covers exploration pillar.' },
  { background: 'Acolyte', skills: ['Insight', 'Religion'], tools: ['None (2 languages)'], feature: 'Shelter of the Faithful (free temple housing/aid)', rating: 'A', bestFor: 'Cleric, Paladin. Free food/shelter at any temple. Religion fits thematically.' },
  { background: 'Sage', skills: ['Arcana', 'History'], tools: ['None (2 languages)'], feature: 'Researcher (know where to find unknown lore)', rating: 'A', bestFor: 'Wizard, Artificer. Two INT skills. Researcher feature for lore campaigns.' },
  { background: 'Soldier', skills: ['Athletics', 'Intimidation'], tools: ['Gaming set', 'Land vehicles'], feature: 'Military Rank (soldiers recognize your authority)', rating: 'A', bestFor: 'Fighter, Paladin. Athletics + Intimidation are both useful.' },
  { background: 'Noble', skills: ['History', 'Persuasion'], tools: ['Gaming set (one)'], feature: 'Position of Privilege (welcomed by high society)', rating: 'A', bestFor: 'Bard, Paladin, Sorcerer. Persuasion is the best social skill.' },
  { background: 'Charlatan', skills: ['Deception', 'Sleight of Hand'], tools: ['Disguise kit', 'Forgery kit'], feature: 'False Identity (second identity with documentation)', rating: 'A', bestFor: 'Rogue, Bard, Warlock. Deception + Sleight of Hand + disguise kit.' },
  { background: 'Urchin', skills: ['Sleight of Hand', 'Stealth'], tools: ['Disguise kit', 'Thieves\' tools'], feature: 'City Secrets (know secret city passages)', rating: 'A', bestFor: 'Rogue. Same tools as Criminal but different skills. Stealth + Sleight of Hand.' },
  { background: 'Guild Artisan', skills: ['Insight', 'Persuasion'], tools: ['Artisan tools (one set)'], feature: 'Guild Membership (guild support, lodging, legal aid)', rating: 'A', bestFor: 'Artificer, any face character. Persuasion + Insight = social master.' },
  { background: 'Hermit', skills: ['Medicine', 'Religion'], tools: ['Herbalism kit'], feature: 'Discovery (unique secret/revelation)', rating: 'B', bestFor: 'Druid, Monk. Herbalism kit for potion crafting. Discovery is DM-dependent.' },
  { background: 'Folk Hero', skills: ['Animal Handling', 'Survival'], tools: ['Artisan tools', 'Land vehicles'], feature: 'Rustic Hospitality (commoners shelter you)', rating: 'B', bestFor: 'Ranger, Druid. Rural skills. Common folk help you.' },
  { background: 'Entertainer', skills: ['Acrobatics', 'Performance'], tools: ['Disguise kit', 'Musical instrument'], feature: 'By Popular Demand (free lodging via performances)', rating: 'B', bestFor: 'Bard. Performance is niche. Acrobatics has some value.' },
  { background: 'Sailor', skills: ['Athletics', 'Perception'], tools: ['Navigator\'s tools', 'Water vehicles'], feature: 'Ship\'s Passage (free travel by ship)', rating: 'A', bestFor: 'Any martial. Perception + Athletics are both great skills.' },
];

export const BACKGROUND_SKILL_TIPS = [
  { tip: 'Don\'t overlap with class skills', detail: 'If your class gives Stealth proficiency, choose a background without Stealth. Maximize unique skill coverage.' },
  { tip: 'Prioritize Perception', detail: 'If no class source, get Perception from background (Sailor, Custom). It\'s the most-used skill.' },
  { tip: 'Custom Background for optimization', detail: 'Custom Background: pick any 2 skills + any 2 tool/language. No mechanical downside. Just needs DM approval.' },
  { tip: 'Thieves\' tools from background', detail: 'If no Rogue in party, someone should take Criminal/Urchin for Thieves\' tools proficiency.' },
  { tip: 'Face characters: take Persuasion', detail: 'Noble, Guild Artisan, or Custom Background. Persuasion is the #1 social skill.' },
];

export function backgroundSkillOverlap(classSkills, backgroundSkills) {
  const overlap = backgroundSkills.filter(s => classSkills.includes(s));
  return { overlap, hasConflict: overlap.length > 0, recommendation: overlap.length > 0 ? 'Choose a different background to avoid skill overlap' : 'No overlap — good choice!' };
}
