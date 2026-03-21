/**
 * playerRitualSpellOptGuide.js
 * Player Mode: Ritual casting — rules, best rituals, and class differences
 * Pure JS — no React dependencies.
 */

export const RITUAL_RULES = {
  time: 'Normal casting time + 10 minutes.',
  slotCost: 'NO spell slot used.',
  who: 'Wizard (spellbook, no prep), Cleric/Druid (must prepare), Bard (must know), Warlock (Book of Ancient Secrets).',
  note: 'Free spells. Never waste a slot on a ritual.',
};

export const BEST_RITUALS = [
  { spell: 'Find Familiar', level: 1, rating: 'S+', note: 'Permanent familiar. Scout, Help, touch spells.' },
  { spell: 'Detect Magic', level: 1, rating: 'S+', note: 'Free magic detection. Cast everywhere.' },
  { spell: 'Tiny Hut', level: 3, rating: 'S+', note: 'Impenetrable dome. Safe rest anywhere.' },
  { spell: 'Water Breathing', level: 3, rating: 'S', note: '24 hours for 10 creatures. Free.' },
  { spell: 'Phantom Steed', level: 3, rating: 'A+', note: '100ft speed mount. 1 hour.' },
  { spell: 'Comprehend Languages', level: 1, rating: 'A+', note: 'Understand any language. 1 hour.' },
  { spell: 'Identify', level: 1, rating: 'A+', note: 'Learn magic item properties.' },
  { spell: 'Telepathic Bond', level: 5, rating: 'S', note: 'Party telepathy. 1 hour.' },
  { spell: 'Commune', level: 5, rating: 'A+', note: '3 yes/no from deity. Cleric.' },
  { spell: 'Speak with Animals', level: 1, rating: 'A', note: 'Talk to beasts. Utility.' },
];

export const RITUAL_CLASS_RANKING = [
  { class: 'Wizard', rating: 'S+', note: 'Any ritual in spellbook. No preparation needed.' },
  { class: 'Tome Warlock', rating: 'S+', note: 'Book of Ancient Secrets: rituals from ANY class.' },
  { class: 'Cleric/Druid', rating: 'A', note: 'Must prepare. Uses preparation slots.' },
  { class: 'Bard', rating: 'B+', note: 'Must know. Limited spells known.' },
  { class: 'Artificer', rating: 'A', note: 'Must prepare. Like Cleric.' },
];

export const RITUAL_TIPS = [
  'Ritual = free spells. Never waste slots on something you can ritual cast.',
  'Wizards: rituals don\'t need preparation. Collect every ritual scroll.',
  'Tiny Hut: 11-minute ritual for impenetrable safe rest.',
  'Detect Magic as ritual: every new room. Free.',
  'Book of Ancient Secrets: steal rituals from all class lists.',
  'Copy ritual scrolls into spellbook. Free power.',
];
