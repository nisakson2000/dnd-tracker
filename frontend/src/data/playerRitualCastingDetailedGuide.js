/**
 * playerRitualCastingDetailedGuide.js
 * Player Mode: Ritual casting rules — free spells without slots
 * Pure JS — no React dependencies.
 */

export const RITUAL_CASTING_RULES = {
  basics: [
    'A spell with the "ritual" tag can be cast as a ritual.',
    'Ritual casting adds 10 minutes to the normal cast time.',
    'Ritual casting does NOT consume a spell slot.',
    'The spell must be prepared/known (class-dependent).',
  ],
  whoCanRitual: [
    { class: 'Wizard', rule: 'Can ritual cast any ritual spell in their spellbook. Does NOT need to be prepared.', rating: 'S' },
    { class: 'Cleric', rule: 'Can ritual cast prepared ritual spells only.', rating: 'A' },
    { class: 'Druid', rule: 'Can ritual cast prepared ritual spells only.', rating: 'A' },
    { class: 'Bard', rule: 'Can ritual cast known ritual spells only.', rating: 'B' },
    { class: 'Artificer', rule: 'Can ritual cast prepared ritual spells only.', rating: 'B' },
    { class: 'Warlock', rule: 'CANNOT ritual cast unless they have Book of Ancient Secrets (Pact of the Tome).', rating: 'C (without), S (with)' },
    { class: 'Sorcerer', rule: 'CANNOT ritual cast. Must use spell slots for everything.', rating: 'F' },
    { class: 'Ranger', rule: 'CANNOT ritual cast. Must use spell slots.', rating: 'F' },
    { class: 'Paladin', rule: 'CANNOT ritual cast. Must use spell slots.', rating: 'F' },
  ],
};

export const BEST_RITUALS_BY_LEVEL = [
  { level: 1, spells: ['Detect Magic', 'Find Familiar', 'Identify', 'Speak with Animals', 'Ceremony', 'Comprehend Languages', 'Unseen Servant'] },
  { level: 2, spells: ['Augury', 'Gentle Repose', 'Magic Mouth', 'Silence (not ritual)', 'Beast Sense', 'Skywrite'] },
  { level: 3, spells: ['Leomund\'s Tiny Hut', 'Phantom Steed', 'Water Breathing', 'Feign Death', 'Meld into Stone'] },
  { level: 4, spells: ['Divination', 'Water Walk'] },
  { level: 5, spells: ['Commune', 'Contact Other Plane', 'Rary\'s Telepathic Bond'] },
  { level: 6, spells: ['Drawmij\'s Instant Summons', 'Forbiddance'] },
];

export const RITUAL_TIPS = [
  'Wizards: copy every ritual scroll you find into your spellbook. Free casting forever.',
  'Don\'t burn spell slots on utility rituals. Detect Magic, Identify — always ritual cast these.',
  'Find Familiar: always ritual cast. 1 hour + 10gp. Never waste a slot on it.',
  'Tiny Hut: 11-minute ritual for an invulnerable 8-hour rest dome. Always ritual cast.',
  'In dungeons: ritual casting takes time. Sometimes you must spend the slot for speed.',
  'Phantom Steed: ritual cast every hour for free horse travel. No slot needed.',
  'Ritual Caster feat: non-casters can learn ritual casting. Incredible for Fighters/Rogues.',
];

export const WIZARD_RITUAL_ADVANTAGE = {
  key: 'Wizards can ritual cast from their spellbook WITHOUT preparing the spell.',
  implication: [
    'Scribe every ritual into your spellbook — they\'re always available.',
    'You don\'t need to sacrifice prepared spell slots for utility rituals.',
    'This makes Wizards the best ritual casters by a huge margin.',
    'Copying cost: 50gp + 2 hours per spell level.',
  ],
  note: 'This is one of the Wizard\'s strongest class features and is often overlooked.',
};

export function ritualCastTime(baseMinutes) {
  return { ritual: baseMinutes + 10, normal: baseMinutes, saved: 'One spell slot', note: `Ritual: ${baseMinutes + 10} min. Normal: ${baseMinutes} min. Slot saved.` };
}
