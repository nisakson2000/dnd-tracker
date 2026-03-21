/**
 * playerLanguageProfGuide.js
 * Player Mode: Languages — all languages ranked, when they matter, and how to learn them
 * Pure JS — no React dependencies.
 */

export const STANDARD_LANGUAGES = [
  { language: 'Common', speakers: 'Humans, most civilized races', rating: 'S+ (mandatory)', note: 'Everyone speaks Common. Trade language.' },
  { language: 'Dwarvish', speakers: 'Dwarves', rating: 'A', note: 'Common in underground/mountain campaigns. Dwarven ruins.' },
  { language: 'Elvish', speakers: 'Elves', rating: 'A+', note: 'Widely spoken. Many magical texts in Elvish.' },
  { language: 'Giant', speakers: 'Giants, Ogres', rating: 'A', note: 'Useful for giant-themed encounters. Storm King\'s Thunder.' },
  { language: 'Gnomish', speakers: 'Gnomes', rating: 'B', note: 'Niche. Gnomish inventors and illusionists.' },
  { language: 'Goblin', speakers: 'Goblins, Hobgoblins, Bugbears', rating: 'A', note: 'Very common enemy type. Useful for negotiation.' },
  { language: 'Halfling', speakers: 'Halflings', rating: 'B', note: 'Rarely needed. Halflings usually speak Common.' },
  { language: 'Orc', speakers: 'Orcs', rating: 'A', note: 'Common enemy type. Useful in wilderness campaigns.' },
];

export const EXOTIC_LANGUAGES = [
  { language: 'Abyssal', speakers: 'Demons', rating: 'A+', note: 'Demonic texts and summoning. Fiend-heavy campaigns.' },
  { language: 'Celestial', speakers: 'Angels, celestials', rating: 'A', note: 'Divine texts. Cleric/Paladin flavor.' },
  { language: 'Draconic', speakers: 'Dragons, dragonborn, kobolds', rating: 'S', note: 'Many magical texts. Dragon encounters. Sorcerer spell notations.' },
  { language: 'Deep Speech', speakers: 'Aberrations (mind flayers, beholders)', rating: 'A+', note: 'Underdark campaigns. Mind Flayer lore.' },
  { language: 'Infernal', speakers: 'Devils', rating: 'A+', note: 'Devil contracts. Avernus campaigns. Tieflings.' },
  { language: 'Primordial', speakers: 'Elementals', rating: 'A', note: 'Includes Aquan, Auran, Ignan, Terran dialects. Elemental planes.' },
  { language: 'Sylvan', speakers: 'Fey creatures', rating: 'A', note: 'Feywild campaigns. Fey negotiations.' },
  { language: 'Undercommon', speakers: 'Underdark traders', rating: 'A+', note: 'Lingua franca of the Underdark. Essential for Underdark campaigns.' },
  { language: 'Thieves\' Cant', speakers: 'Rogues', rating: 'A (Rogues only)', note: 'Secret Rogue language. Built into class.' },
  { language: 'Druidic', speakers: 'Druids', rating: 'A (Druids only)', note: 'Secret Druid language. Built into class.' },
];

export const LEARNING_LANGUAGES = [
  { method: 'Race/Background', time: 'Character creation', cost: 'Free', note: 'Choose during creation.' },
  { method: 'Linguist feat', time: 'ASI level', cost: 'Feat slot', note: '+1 INT + 3 languages + create ciphers.' },
  { method: 'Downtime training', time: '250 days (Xanathar\'s: 10 workweeks)', cost: '250 gp (Xanathar\'s: 25 gp/workweek)', note: 'Learn any language given a teacher.' },
  { method: 'Comprehend Languages', time: 'Spell (ritual)', cost: '1st level slot or 10 min ritual', note: 'Understand any spoken/written language. 1 hour.' },
  { method: 'Tongues', time: 'Spell', cost: '3rd level slot', note: 'Speak and understand any language. 1 hour. Concentration.' },
];

export const LANGUAGE_TIPS = [
  'Common is universal. You always know it.',
  'Draconic: most useful exotic language. Dragon encounters + magical texts.',
  'Campaign-dependent: ask DM what languages will be useful.',
  'Comprehend Languages (ritual): read any text. Essential Wizard ritual.',
  'Tongues: speak any language. Great for social encounters.',
  'Thieves\' Cant and Druidic are secret class languages. Free.',
  'Linguist feat: +1 INT + 3 languages. Great for Wizards.',
  'Undercommon: essential for Underdark campaigns. Don\'t skip it.',
];
