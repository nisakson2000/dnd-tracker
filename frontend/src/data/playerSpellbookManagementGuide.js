/**
 * playerSpellbookManagementGuide.js
 * Player Mode: Wizard Spellbook — copying, preparation, and management
 * Pure JS — no React dependencies.
 */

export const SPELLBOOK_RULES = {
  startingSpells: '6 wizard spells at L1.',
  levelUp: '+2 free wizard spells per Wizard level.',
  copying: '2 hours + 50gp per spell level to copy from scroll or another spellbook.',
  preparation: 'Prepare INT mod + Wizard level spells per long rest.',
  rituals: 'Can ritual cast ANY spell in your spellbook (don\'t need to prepare it).',
  replacement: 'If spellbook is lost, you can reconstruct: 2hr + 50gp per spell level for prepared spells. Unprepared spells are gone.',
  note: 'Your spellbook IS your class feature. Protect it. Back it up.',
};

export const SPELLBOOK_ECONOMICS = [
  { source: 'Level up', cost: 'Free', spells: '2 per level', note: 'Always pick spells you can\'t get elsewhere (non-ritual, unique).' },
  { source: 'Spell scrolls', cost: '50gp × spell level + 2hr', spells: '1 per scroll', note: 'Scroll is consumed. Buy from shops or find in loot.' },
  { source: 'Another wizard\'s book', cost: '50gp × spell level + 2hr', spells: 'As many as available', note: 'Source book not consumed. Best bulk copying method.' },
  { source: 'Order of Scribes (L2)', cost: '2 min × spell level + fine inks', spells: 'Same rules', note: 'Drastically faster copying. 2 minutes vs 2 hours per level.' },
];

export const MUST_HAVE_RITUAL_SPELLS = [
  { spell: 'Find Familiar', level: 1, note: 'Best utility spell. Scouting, Help action, deliver touch spells. RITUAL.' },
  { spell: 'Detect Magic', level: 1, note: 'Identify magical auras. Use constantly. RITUAL saves slots.' },
  { spell: 'Identify', level: 1, note: 'ID magic items. Alternative: short rest (but slower).' },
  { spell: 'Comprehend Languages', level: 1, note: 'Read/understand any language. Essential for exploration.' },
  { spell: 'Unseen Servant', level: 1, note: 'Invisible helper. Carries items, opens doors, triggers traps.' },
  { spell: 'Leomund\'s Tiny Hut', level: 3, note: 'Perfect rest shelter. Blocks everything. 8-hour ritual.' },
  { spell: 'Phantom Steed', level: 3, note: 'Fast travel mount. 100ft speed. Lasts 1 hour. Ritual.' },
  { spell: 'Water Breathing', level: 3, note: 'Entire party breathes underwater. 24 hours. RITUAL.' },
  { spell: 'Rary\'s Telepathic Bond', level: 5, note: 'Party-wide telepathy. 1 hour. Ritual. Amazing coordination.' },
  { spell: 'Contact Other Plane', level: 5, note: 'Ask 5 yes/no questions. Risk of insanity (DC 15 INT save).' },
];

export const PREPARATION_STRATEGY = {
  daily: [
    'Review upcoming goals: dungeon, travel, social, combat?',
    'Always prepare: Shield, Counterspell, a save-or-suck, a damage spell.',
    'Rituals don\'t need preparation. Don\'t waste prep slots on them.',
    'Keep 1-2 utility spells prepared for surprises.',
    'Adjust based on expected enemies (fire for trolls, radiant for undead).',
  ],
  alwaysPrepared: [
    'Shield (L1) — +5 AC reaction',
    'Counterspell (L3) — deny enemy spells',
    'Fireball (L3) — AoE damage',
    'Web (L2) — battlefield control',
    'Misty Step (L2) — emergency escape',
  ],
  situational: [
    'Knock — if no Rogue in party',
    'Fly — outdoor/vertical dungeons',
    'Dispel Magic — heavy magic environments',
    'Remove Curse — if cursed items are expected',
    'Banishment — extraplanar enemies',
  ],
};

export const SPELLBOOK_PROTECTION_TIPS = [
  'MAKE A BACKUP. Copy your spellbook into a second book. Store it safely.',
  'Backup costs 50gp × spell level per spell. Expensive but insurance.',
  'Bag of Holding: store backup spellbook in extradimensional space.',
  'Leomund\'s Secret Chest: store backup on Ethereal Plane.',
  'If your spellbook is destroyed, you can only reconstruct currently prepared spells.',
  'Order of Scribes Wizard: backup spellbook as a sentient object. Safer.',
  'Don\'t let the DM see you not protecting your spellbook. They WILL target it.',
  'Waterproofing: wax coating, waterproof container, or Prestidigitation to dry.',
];

export const SPELLBOOK_TIPS = [
  'Level up spells = free. Always pick non-ritual, non-findable spells.',
  'Copy ritual spells from scrolls/books. They don\'t need preparation slots.',
  'Find Familiar and Tiny Hut are RITUALS. Never waste a preparation slot on them.',
  'INT mod + Wizard level = prepared spells. INT 20 at L10 = 15 prepared spells.',
  'Preparation is flexible. Change your entire list every long rest.',
  'Copying from another Wizard\'s book is the cheapest way to learn spells. Be friendly.',
  'Always have Shield prepared. +5 AC as reaction. Non-negotiable.',
  'Order of Scribes: 2 minutes per spell level to copy. Insanely fast.',
  'Back up your spellbook. Lost = all unprepared spells gone forever.',
  'Ritual casting takes 10 extra minutes. Worth it to save spell slots.',
];
