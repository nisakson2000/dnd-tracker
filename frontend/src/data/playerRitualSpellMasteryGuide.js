/**
 * playerRitualSpellMasteryGuide.js
 * Player Mode: Ritual casting — rules, best rituals, and optimization
 * Pure JS — no React dependencies.
 */

export const RITUAL_RULES = {
  howItWorks: 'Cast any "ritual" tagged spell without a slot. Takes 10 extra minutes.',
  whoCanRitual: [
    { class: 'Wizard', method: 'From spellbook. Don\'t need it prepared.', rating: 'S+' },
    { class: 'Pact of the Tome (Book of Ancient Secrets)', method: 'ANY ritual from any class.', rating: 'S' },
    { class: 'Cleric/Druid/Artificer', method: 'Must have it prepared.', rating: 'A' },
    { class: 'Bard', method: 'Must know it.', rating: 'B+' },
    { class: 'Ritual Caster feat', method: 'Ritual book. Add from scrolls.', rating: 'A+' },
  ],
  cannotRitual: ['Sorcerer', 'Ranger', 'Paladin', 'Eldritch Knight', 'Arcane Trickster'],
};

export const BEST_RITUALS = [
  { spell: 'Find Familiar', level: 1, rating: 'S+', note: 'Permanent scout + Help action + touch spell delivery. Owl with Flyby.' },
  { spell: 'Detect Magic', level: 1, rating: 'S+', note: 'See magical auras. Use constantly. Free with ritual.' },
  { spell: 'Tiny Hut', level: 3, rating: 'S+', note: 'Impenetrable dome. Safe long rests anywhere.' },
  { spell: 'Water Breathing', level: 3, rating: 'A+', note: '10 creatures breathe underwater 24 hours.' },
  { spell: 'Phantom Steed', level: 3, rating: 'A+', note: '100ft speed mount. Recast every hour.' },
  { spell: 'Identify', level: 1, rating: 'A+', note: 'Learn magic item properties. Some DMs skip with SR.' },
  { spell: 'Comprehend Languages', level: 1, rating: 'A+', note: 'Understand any language for 1 hour.' },
  { spell: 'Alarm', level: 1, rating: 'A', note: 'Ward area. Alert on intrusion. Cast before sleep.' },
  { spell: 'Gentle Repose', level: 2, rating: 'A', note: 'Extend Revivify to 10 days.' },
  { spell: 'Commune', level: 5, rating: 'A+', note: '3 yes/no questions to deity. Cleric.' },
  { spell: 'Rary\'s Telepathic Bond', level: 5, rating: 'S', note: '8 creatures linked telepathically. Perfect coordination.' },
  { spell: 'Speak with Dead', level: 3, rating: 'A', note: '5 questions to a corpse. Investigation.' },
  { spell: 'Forbiddance', level: 6, rating: 'A', note: 'Ward vs teleportation + type damage. Permanent with daily casting.' },
];

export const RITUAL_TIPS = [
  'Wizards: copy every ritual scroll. You never need to prepare them.',
  'Book of Ancient Secrets: ANY class ritual. Find Familiar + Detect Magic + more.',
  'Ritual Caster feat: best non-caster utility. Fighter with Find Familiar is amazing.',
  'Always ritual if you have 10 minutes. Save spell slots for emergencies.',
  'Detect Magic before every suspicious room. Free trap detection.',
  'Phantom Steed: recast every 50 min for 100ft travel speed indefinitely.',
  'Gentle Repose immediately after an ally dies. Extends Revivify window to 10 days.',
];
