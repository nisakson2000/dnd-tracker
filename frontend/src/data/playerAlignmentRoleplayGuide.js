/**
 * playerAlignmentRoleplayGuide.js
 * Player Mode: Alignment — what it means and how to use it
 * Pure JS — no React dependencies.
 */

export const ALIGNMENT_GRID = [
  { alignment: 'Lawful Good', shorthand: 'LG', archetype: 'The Crusader', example: 'Superman, Brienne of Tarth', note: 'Follows rules AND does the right thing.' },
  { alignment: 'Neutral Good', shorthand: 'NG', archetype: 'The Benefactor', example: 'Spider-Man, Gandalf', note: 'Does good without caring about rules.' },
  { alignment: 'Chaotic Good', shorthand: 'CG', archetype: 'The Rebel', example: 'Robin Hood, Han Solo', note: 'Breaks rules to do the right thing.' },
  { alignment: 'Lawful Neutral', shorthand: 'LN', archetype: 'The Judge', example: 'Judge Dredd, Stannis Baratheon', note: 'The law is the law. Personal morals secondary.' },
  { alignment: 'True Neutral', shorthand: 'N', archetype: 'The Undecided', example: 'Most animals, druids focused on balance', note: 'No strong commitment to any axis.' },
  { alignment: 'Chaotic Neutral', shorthand: 'CN', archetype: 'The Free Spirit', example: 'Jack Sparrow, Catwoman', note: 'Values freedom above all. Unpredictable.' },
  { alignment: 'Lawful Evil', shorthand: 'LE', archetype: 'The Tyrant', example: 'Darth Vader, Magneto', note: 'Uses rules and structure for selfish/cruel ends.' },
  { alignment: 'Neutral Evil', shorthand: 'NE', archetype: 'The Malefactor', example: 'Sauron, Voldemort', note: 'Does whatever benefits themselves.' },
  { alignment: 'Chaotic Evil', shorthand: 'CE', archetype: 'The Destroyer', example: 'The Joker, Demons', note: 'Destruction and cruelty for their own sake.' },
];

export const ALIGNMENT_TIPS = [
  'Alignment describes tendencies, not a straitjacket. Characters can act against their alignment.',
  'Good characters can do bad things sometimes. Evil characters can do kind things.',
  'Chaotic Neutral ≠ "I do random stuff." It means valuing freedom above order.',
  'Lawful ≠ "follows the law." It means valuing structure, honor, codes (personal or societal).',
  'Evil PCs should still cooperate with the party. "It\'s what my character would do" is a bad excuse for ruining the game.',
  'Alignment can change over time based on actions. A Lawful Good paladin who commits atrocities may shift.',
  'Many modern tables ignore alignment entirely. Check with your DM.',
];

export const ALIGNMENT_AND_MECHANICS = [
  { mechanic: 'Detect Evil and Good', note: 'Detects creature TYPES (aberrations, celestials, fiends, etc.), NOT alignment.' },
  { mechanic: 'Protection from Evil and Good', note: 'Same — creature types, not alignment.' },
  { mechanic: 'Holy Avenger', note: 'Extra damage vs fiends and undead. Not alignment-based in 5e.' },
  { mechanic: 'Robe of the Archmagi', note: 'Requires specific alignment (good, evil, or neutral).' },
  { mechanic: 'Book of Exalted Deeds', note: 'Good-aligned only. Alignment restriction on artifact.' },
  { mechanic: 'Helm of Opposite Alignment', note: 'Curse: changes your alignment.' },
];

export const ALIGNMENT_IN_PLAY = {
  note: '5e de-emphasized alignment compared to older editions. It\'s a roleplaying guide, not a game mechanic.',
  advice: [
    'Use alignment as a starting point, not a destination.',
    'Define your character by their goals, values, and bonds — not their alignment.',
    'If you can\'t decide alignment, play a few sessions and let it emerge from your actions.',
    'The best characters have internal conflicts. A Lawful Good paladin tempted by pragmatism is more interesting than one who\'s always perfectly good.',
  ],
};
