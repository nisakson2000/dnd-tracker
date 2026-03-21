/**
 * playerBackgroundOptGuide.js
 * Player Mode: All backgrounds ranked — best picks by class and playstyle
 * Pure JS — no React dependencies.
 */

export const BACKGROUNDS_RANKED = [
  { background: 'Outlander', skills: 'Athletics, Survival', feature: 'Wanderer: never get lost, always find food/water for 6.', rating: 'S', note: 'Best exploration background. Auto food+water is huge.' },
  { background: 'Criminal/Spy', skills: 'Deception, Stealth', feature: 'Criminal Contact: reliable underworld connection.', rating: 'S', note: 'Best Rogue background. Stealth + Deception + underground contacts.' },
  { background: 'Acolyte', skills: 'Insight, Religion', feature: 'Shelter of the Faithful: free temple lodging + support.', rating: 'A+', note: 'Free rest + meals at temples. Good for Clerics/Paladins.' },
  { background: 'Noble', skills: 'History, Persuasion', feature: 'Position of Privilege: welcome in high society.', rating: 'A+', note: 'Great for Face characters. Access to nobility.' },
  { background: 'Sage', skills: 'Arcana, History', feature: 'Researcher: know where to find information.', rating: 'A+', note: 'Perfect for Wizards. Know where any lore can be found.' },
  { background: 'Soldier', skills: 'Athletics, Intimidation', feature: 'Military Rank: command soldiers, access military resources.', rating: 'A', note: 'Good for Fighters/Paladins. Military authority.' },
  { background: 'Folk Hero', skills: 'Animal Handling, Survival', feature: 'Rustic Hospitality: commoners shelter and hide you.', rating: 'A', note: 'Common folk love you. Great for Robin Hood types.' },
  { background: 'Charlatan', skills: 'Deception, Sleight of Hand', feature: 'False Identity: established alternate persona.', rating: 'A+', note: 'Con artist. Fake identity with documents.' },
  { background: 'Urchin', skills: 'Sleight of Hand, Stealth', feature: 'City Secrets: secret routes through urban areas (2× speed).', rating: 'A', note: 'Urban Rogue. Secret passages for fast travel.' },
  { background: 'Hermit', skills: 'Medicine, Religion', feature: 'Discovery: unique and powerful discovery.', rating: 'A (DM dependent)', note: 'DM defines your discovery. Can be incredible.' },
  { background: 'Guild Artisan', skills: 'Insight, Persuasion', feature: 'Guild Membership: guild support, lodging, legal help.', rating: 'A', note: 'Professional network. Good for Artificers.' },
  { background: 'Sailor/Pirate', skills: 'Athletics, Perception', feature: 'Ship\'s Passage: free sea travel.', rating: 'B+', note: 'Campaign-dependent. Great for naval campaigns.' },
  { background: 'Entertainer', skills: 'Acrobatics, Performance', feature: 'By Popular Demand: free lodging in exchange for performing.', rating: 'B+', note: 'Classic Bard. Free lodging anywhere.' },
  { background: 'Haunted One', skills: 'Choose 2 from Arcana/Investigation/Religion/Survival', feature: 'Heart of Darkness: commoners help you flee evil.', rating: 'A', note: 'Great for horror campaigns. Flexible skills.' },
  { background: 'Far Traveler', skills: 'Insight, Perception', feature: 'All Eyes on You: curiosity draws attention and help.', rating: 'A', note: 'Perception + Insight is a great skill combo.' },
];

export const BEST_BACKGROUND_BY_CLASS = [
  { class: 'Fighter', backgrounds: ['Soldier (Athletics+Intimidation)', 'Outlander (Athletics+Survival)'] },
  { class: 'Rogue', backgrounds: ['Criminal (Deception+Stealth)', 'Urchin (Sleight of Hand+Stealth)', 'Charlatan (Deception+SoH)'] },
  { class: 'Wizard', backgrounds: ['Sage (Arcana+History)', 'Hermit (Medicine+Religion)'] },
  { class: 'Cleric', backgrounds: ['Acolyte (Insight+Religion)', 'Soldier (Athletics+Intimidation)'] },
  { class: 'Bard', backgrounds: ['Entertainer (Acrobatics+Performance)', 'Charlatan (Deception+SoH)', 'Noble (History+Persuasion)'] },
  { class: 'Paladin', backgrounds: ['Noble (History+Persuasion)', 'Soldier (Athletics+Intimidation)', 'Acolyte (Insight+Religion)'] },
  { class: 'Ranger', backgrounds: ['Outlander (Athletics+Survival)', 'Folk Hero (Animal Handling+Survival)'] },
  { class: 'Warlock', backgrounds: ['Charlatan (Deception+SoH)', 'Criminal (Deception+Stealth)', 'Hermit (unique discovery)'] },
  { class: 'Druid', backgrounds: ['Hermit (Medicine+Religion)', 'Outlander (Athletics+Survival)'] },
  { class: 'Monk', backgrounds: ['Hermit (Medicine+Religion)', 'Outlander (Athletics+Survival)'] },
  { class: 'Sorcerer', backgrounds: ['Noble (History+Persuasion)', 'Sage (Arcana+History)'] },
  { class: 'Barbarian', backgrounds: ['Outlander (Athletics+Survival)', 'Soldier (Athletics+Intimidation)'] },
  { class: 'Artificer', backgrounds: ['Guild Artisan (Insight+Persuasion)', 'Sage (Arcana+History)'] },
];

export const BACKGROUND_TIPS = [
  'Background skills don\'t have to match your class. Fill gaps in your skill list.',
  'Outlander: never worry about food/water. Removes survival logistics.',
  'Criminal Contact: a reliable NPC for information and illegal services.',
  'Sage Researcher: you always know WHERE to find answers, even if you don\'t know them.',
  'Custom backgrounds are allowed (PHB p.125): pick any 2 skills, 2 tool/language prof, feature from any background.',
  'Background features are roleplay tools, not combat features. Choose for flavor.',
  'Perception is the most important skill. Choose a background that doesn\'t overlap with class skills.',
  'Charlatan\'s false identity: have paperwork for a fake persona. Great for infiltration.',
];
