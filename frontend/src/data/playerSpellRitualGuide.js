/**
 * playerSpellRitualGuide.js
 * Player Mode: Ritual casting guide — free spells with 10 extra minutes
 * Pure JS — no React dependencies.
 */

export const RITUAL_BASICS = {
  concept: 'Ritual casting lets you cast certain spells without spending a spell slot, taking 10 extra minutes.',
  who: 'Wizards (any ritual in spellbook), Clerics/Druids (prepared rituals only), Bards (known rituals only), Ritual Caster feat (any class).',
  rule: 'Spell must have the "ritual" tag. Casting time increases by 10 minutes. Does NOT consume a spell slot.',
  note: 'Rituals are essentially free spells. If you\'re not in combat, always ritual cast to save slots.',
};

export const BEST_RITUAL_SPELLS = [
  { spell: 'Detect Magic (1st)', class: 'Bard, Cleric, Druid, Wizard', effect: 'Sense magic within 30ft for 10 min. Concentration.', note: 'Cast as ritual constantly in dungeons. Find magic items, traps, enchantments. Free.', rating: 'S' },
  { spell: 'Identify (1st)', class: 'Wizard, Artificer, Bard', effect: 'Learn properties of a magic item or spell on a target.', note: 'Identify every magic item for free. Short rest also works but this is faster.', rating: 'A' },
  { spell: 'Find Familiar (1st)', class: 'Wizard', effect: 'Summon a familiar. Owl is best (flyby, Help action, darkvision scouting).', note: 'Cast once. Familiar lasts until killed. Re-summon as ritual if it dies. Essential Wizard spell.', rating: 'S' },
  { spell: 'Speak with Animals (1st)', class: 'Bard, Druid, Ranger', effect: 'Talk to animals for 10 min.', note: 'Free animal conversation. Gather info, gain allies, avoid fights.', rating: 'A' },
  { spell: 'Comprehend Languages (1st)', class: 'Bard, Wizard, Warlock', effect: 'Understand any language for 1 hour.', note: 'Read ancient texts, eavesdrop on foreign conversations. Free.', rating: 'A' },
  { spell: 'Unseen Servant (1st)', class: 'Bard, Wizard, Warlock', effect: 'Invisible force performs simple tasks for 1 hour.', note: 'Open doors, carry things, trigger traps from safety. Free utility.', rating: 'B' },
  { spell: 'Tiny Hut (3rd)', class: 'Bard, Wizard', effect: '10ft dome. Impervious to attacks/spells. Comfortable rest inside.', note: 'Perfect safe rest. Nothing gets in. Free cast. 8 hour duration. Essential for camping.', rating: 'S' },
  { spell: 'Water Breathing (3rd)', class: 'Druid, Ranger, Wizard', effect: 'Up to 10 creatures breathe underwater for 24 hours.', note: 'Entire party breathes underwater for 24 hours. Free. Cast before any water area.', rating: 'A' },
  { spell: 'Phantom Steed (3rd)', class: 'Wizard', effect: 'Create a horse with 100ft speed for 1 hour.', note: '100ft speed mount for free. Ritual cast every hour for unlimited fast travel.', rating: 'A' },
  { spell: 'Commune (5th)', class: 'Cleric', effect: 'Ask your deity 3 yes/no questions.', note: 'Free divine guidance. Ask about enemy weaknesses, quest goals, dangers ahead.', rating: 'S' },
  { spell: 'Contact Other Plane (5th)', class: 'Warlock, Wizard', effect: 'Ask a cosmic entity 5 questions. INT save or insanity.', note: '5 questions per cast. Risky (INT save DC 15) but very informative.', rating: 'A' },
  { spell: 'Rary\'s Telepathic Bond (5th)', class: 'Wizard', effect: 'Up to 8 creatures share telepathy for 1 hour.', note: 'Party-wide telepathy. Silent communication. Coordinate tactics. Free.', rating: 'A' },
];

export const RITUAL_CASTER_FEAT = {
  feat: 'Ritual Caster',
  prerequisite: 'INT or WIS 13+',
  benefit: 'Choose a class: learn 2 ritual spells from that list. Can add more to your ritual book when found.',
  bestChoices: [
    { class: 'Wizard', reason: 'Largest ritual spell list. Find Familiar, Detect Magic, Tiny Hut, Phantom Steed.', rating: 'S' },
    { class: 'Cleric', reason: 'Detect Magic, Augury, Commune. WIS-based.', rating: 'A' },
    { class: 'Druid', reason: 'Detect Magic, Speak with Animals, Water Breathing.', rating: 'A' },
  ],
  note: 'Wizard Ritual Caster on a Rogue or Fighter adds massive utility. Find Familiar alone is worth the feat.',
};

export const RITUAL_TIPS = [
  'Always ritual cast outside of combat. Never waste spell slots on Detect Magic or Identify.',
  'Wizards can ritual cast any spell in their spellbook — even if not prepared. Keep ritual spells in the book.',
  'Clerics/Druids must have the ritual spell prepared to ritual cast it.',
  'Casting time is spell\'s normal time + 10 minutes. A 1 action spell becomes 10 min + 1 action.',
  'You CAN ritual cast during a short rest (both take about 1 hour).',
  'Phantom Steed: cast every hour for perpetual 100ft speed mount. Chain-ritual during travel.',
];

export function ritualCastTime(normalCastTime) {
  return normalCastTime + 10; // minutes (assuming normal is in minutes, 1 action ≈ 0)
}

export function slotsSevedByRitual(ritualCastsPerDay, slotLevel) {
  return ritualCastsPerDay; // Each ritual saves 1 spell slot
}
