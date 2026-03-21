/**
 * playerSession0PrepGuide.js
 * Player Mode: Session 0 preparation — what players should know and discuss
 * Pure JS — no React dependencies.
 */

export const SESSION_0_TOPICS = [
  {
    topic: 'Campaign Setting',
    questions: [
      'What world/setting are we playing in?',
      'What is the overall tone? (dark, heroic, comedic, gritty)',
      'What level do we start at?',
      'How long will the campaign run?',
      'Is this a published module or homebrew?',
    ],
    whyItMatters: 'Knowing the setting and tone shapes your character concept, backstory, and expectations.',
  },
  {
    topic: 'Character Creation Rules',
    questions: [
      'What sources are allowed? (PHB only? All official? Homebrew?)',
      'How do we generate ability scores? (Point buy, standard array, rolling?)',
      'Are any races/classes/subclasses banned?',
      'Is Tasha\'s custom origin/lineage allowed?',
      'Starting equipment or rolled gold?',
      'Any free feats at level 1?',
    ],
    whyItMatters: 'Avoid building a character that gets vetoed at Session 1.',
  },
  {
    topic: 'Party Composition',
    questions: [
      'What are other players planning?',
      'Do we need a healer? A tank? A face?',
      'Can we coordinate backstory connections?',
      'How do our characters know each other?',
    ],
    whyItMatters: 'Avoids 4 Rogues and no healers. Connected backstories create better roleplay.',
  },
  {
    topic: 'Table Rules',
    questions: [
      'PvP: allowed? How handled?',
      'What happens when someone misses a session?',
      'Phone/distraction policy?',
      'How long are sessions? How often?',
      'Snacks/food arrangements?',
    ],
    whyItMatters: 'Clear expectations prevent conflicts and keep the game fun for everyone.',
  },
  {
    topic: 'Safety Tools',
    questions: [
      'Are there topics/themes to avoid?',
      'Is there a safety tool in place? (X-card, Lines & Veils, etc.)',
      'How do we handle uncomfortable situations at the table?',
    ],
    whyItMatters: 'Everyone should feel safe and comfortable. This is a game.',
  },
  {
    topic: 'House Rules',
    questions: [
      'Critical hits: RAW or homebrew? (max damage + roll, etc.)',
      'Flanking: used? (+2 or advantage?)',
      'Potions: action or bonus action to drink?',
      'Death saves: public or secret?',
      'Milestone or XP leveling?',
      'Encumbrance: tracked or ignored?',
      'Variant rules: Gritty Realism rests? Lingering injuries?',
    ],
    whyItMatters: 'House rules change optimization. Potions as BA buffs healing builds. Flanking buffs melee.',
  },
  {
    topic: 'Roleplay Expectations',
    questions: [
      'How much roleplay vs combat?',
      'First or third person narration? ("I say..." vs "My character says...")',
      'Voices: expected? Optional? No pressure?',
      'How detailed should backstories be?',
    ],
    whyItMatters: 'Matching expectations prevents one player doing improv while another wants tactical combat.',
  },
];

export const SESSION_0_PLAYER_CHECKLIST = [
  'Read the Player\'s Handbook (at minimum: your class chapter + combat rules).',
  'Have a character concept (not necessarily finished sheet) ready.',
  'Know your class features through at least level 3.',
  'Have a short backstory (2-3 paragraphs max).',
  'Know your spells if you\'re a caster.',
  'Bring dice, pencil, and character sheet (physical or digital).',
  'Have questions about the setting ready.',
  'Be open to adjusting your character for party balance.',
  'Discuss potential backstory ties with other players.',
  'Set up any digital tools (D&D Beyond, VTT, etc.) beforehand.',
];

export const SESSION_0_RED_FLAGS = [
  { flag: '"My character wouldn\'t work with the group"', fix: 'Make a character who WANTS to be in a party. This is non-negotiable.' },
  { flag: '"I have a 10-page backstory"', fix: 'Keep it to 1 page. Leave room for the campaign to develop your character.' },
  { flag: '"I want to play a chaotic evil loner"', fix: 'CE is fine if you\'re evil TOGETHER. Loner characters ruin group fun.' },
  { flag: '"Can I have a homebrew race/class?"', fix: 'Homebrew needs DM approval and balance testing. Don\'t push it.' },
  { flag: '"I don\'t need to know the rules"', fix: 'Learn at least your own character\'s abilities. Respect everyone\'s time.' },
  { flag: '"What if I betray the party?"', fix: 'PvP should be discussed and agreed upon. Surprise betrayal = bad experience.' },
];

export const SESSION_0_TIPS = [
  'Session 0 saves campaigns. An hour of planning prevents weeks of problems.',
  'This is NOT a waste of time. It\'s the foundation of a good campaign.',
  'If the DM skips Session 0, bring up these topics yourself. Politely.',
  'Take notes. You\'ll forget what was agreed on.',
  'Be flexible. Session 0 is about compromise and collaboration.',
  'If something makes you uncomfortable, say so NOW, not 3 months in.',
  'Ask about the DM\'s style: tactical? Narrative? Sandbox? Railroad? Know what you\'re signing up for.',
  'Coordinate backstories with at least one other player. Built-in RP hooks.',
];
