/**
 * playerFreeSpellcasting.js
 * Player Mode: Ritual casting rules, best ritual spells, and optimization
 * Pure JS — no React dependencies.
 */

export const RITUAL_RULES = {
  time: 'Casting time + 10 minutes. No spell slot.',
  whoCanRitual: [
    { class: 'Wizard', rule: 'Any ritual in spellbook (no prep needed).', rating: 'S' },
    { class: 'Cleric/Druid/Artificer', rule: 'Prepared ritual spells only.', rating: 'A' },
    { class: 'Bard', rule: 'Known ritual spells only.', rating: 'B' },
    { class: 'Tome Warlock', rule: 'Book of Ancient Secrets: ANY class ritual list.', rating: 'S' },
    { class: 'Ritual Caster feat', rule: 'Choose a class. Copy rituals from scrolls.', rating: 'A' },
  ],
};

export const BEST_RITUALS = [
  { spell: 'Detect Magic', level: 1, note: 'THE most useful ritual. Free magic detection.' },
  { spell: 'Find Familiar', level: 1, note: 'Scout, Help action, deliver spells.' },
  { spell: 'Identify', level: 1, note: 'Learn magic item properties instantly.' },
  { spell: 'Comprehend Languages', level: 1, note: 'Understand any language 1 hour.' },
  { spell: 'Unseen Servant', level: 1, note: 'Trigger traps, carry things.' },
  { spell: 'Water Breathing', level: 3, note: '10 creatures, 24 hours. Free.' },
  { spell: 'Tiny Hut', level: 3, note: 'Safe rest anywhere. Impenetrable dome.' },
  { spell: 'Phantom Steed', level: 3, note: '100ft mount. Re-ritual every hour.' },
  { spell: 'Commune', level: 5, note: '3 yes/no questions to deity.' },
  { spell: 'Telepathic Bond', level: 5, note: 'Silent party communication 1 hour.' },
];

export const RITUAL_TIPS = [
  'Wizard: copy EVERY ritual spell you find. Cast them all free.',
  'Always Detect Magic before new areas. It\'s free.',
  'Phantom Steed ritual = free 100ft travel mount.',
  'Water Breathing pre-cast: 24h, 10 targets, no slot.',
  'Book of Ancient Secrets = "ritual cast everything."',
];

export function ritualTime(baseMinutes) {
  return baseMinutes + 10;
}

export function canRitualCast(cls, isPrepared, inSpellbook) {
  if (cls === 'Wizard') return inSpellbook;
  if (['Cleric', 'Druid', 'Artificer'].includes(cls)) return isPrepared;
  return true; // Bard: known spells
}
