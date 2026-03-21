/**
 * playerRitualCastingGuide.js
 * Player Mode: Ritual casting rules, best ritual spells, and optimization
 * Pure JS — no React dependencies.
 */

export const RITUAL_RULES = {
  time: 'Normal casting time + 10 minutes',
  slots: 'Does NOT consume a spell slot when cast as a ritual',
  whoCanRitual: [
    { class: 'Wizard', rule: 'Can ritual cast any spell in their spellbook with the ritual tag (doesn\'t need to be prepared)' },
    { class: 'Cleric', rule: 'Can ritual cast prepared spells with the ritual tag' },
    { class: 'Druid', rule: 'Can ritual cast prepared spells with the ritual tag' },
    { class: 'Bard', rule: 'Can ritual cast known spells with the ritual tag (Pact Magic)' },
    { class: 'Artificer', rule: 'Can ritual cast prepared spells with the ritual tag' },
    { class: 'Warlock (Pact of the Tome)', rule: 'Book of Ancient Secrets invocation: ritual cast any ritual spell found and transcribed' },
    { class: 'Ritual Caster feat', rule: 'Choose a class list. Learn 2 ritual spells. Can find and transcribe more.' },
  ],
  important: 'You must have the spell prepared (or in your spellbook for Wizards) to ritual cast it. Except Wizard — they just need it in the book.',
};

export const BEST_RITUAL_SPELLS = [
  { spell: 'Detect Magic', level: 1, class: 'Multiple', use: 'Scan rooms for magic items, traps, enchantments. Cast constantly in dungeons.', rating: 'S' },
  { spell: 'Identify', level: 1, class: 'Multiple', use: 'Identify magic items and their properties without risking cursed item attunement.', rating: 'S' },
  { spell: 'Find Familiar', level: 1, class: 'Wizard', use: 'Scouting, Help action, touch spell delivery. Owl is S-tier (Flyby + Help).', rating: 'S' },
  { spell: 'Tiny Hut', level: 3, class: 'Bard/Wizard', use: 'Safe long rest anywhere. Dome blocks everything. 8-hour duration.', rating: 'S' },
  { spell: 'Water Breathing', level: 3, class: 'Multiple', use: '10 creatures for 24 hours. Cast before any water section.', rating: 'A' },
  { spell: 'Speak with Animals', level: 1, class: 'Multiple', use: 'Information gathering from animals. Often overlooked utility.', rating: 'A' },
  { spell: 'Comprehend Languages', level: 1, class: 'Multiple', use: 'Read any written language. Understand any spoken language. Dungeon inscriptions.', rating: 'A' },
  { spell: 'Phantom Steed', level: 3, class: 'Wizard', use: '100ft speed mount for 1 hour. Free overland travel speed boost.', rating: 'A' },
  { spell: 'Gentle Repose', level: 2, class: 'Cleric/Wizard', use: 'Extends the Revivify timer indefinitely. Cast on dead ally, revive when ready.', rating: 'A' },
  { spell: 'Silence', level: 2, class: 'Cleric/Ranger', use: 'NOT a ritual by default. But Silence CANNOT be ritual cast — listed for awareness.', rating: 'N/A' },
  { spell: 'Commune', level: 5, class: 'Cleric', use: '3 yes/no questions to your deity. Free divination. Once per long rest.', rating: 'A' },
  { spell: 'Contact Other Plane', level: 5, class: 'Warlock/Wizard', use: '5 questions. Risk of insanity (DC 15 INT save). High reward.', rating: 'B' },
  { spell: 'Rary\'s Telepathic Bond', level: 5, class: 'Wizard', use: 'Party-wide telepathy for 1 hour. Perfect silent communication.', rating: 'A' },
  { spell: 'Tenser\'s Floating Disk', level: 1, class: 'Wizard', use: 'Carry 500 lbs of loot. Free pack mule. 1 hour.', rating: 'B' },
];

export const RITUAL_OPTIMIZATION = [
  { tip: 'Wizard spellbook advantage', detail: 'Wizards can ritual cast ANY ritual spell in their book without preparing it. Copy every ritual you find.' },
  { tip: 'Detect Magic spam', detail: 'Cast Detect Magic as a ritual every time you enter a new room. It\'s free. Always be detecting.' },
  { tip: 'Gentle Repose + Revivify combo', detail: 'Ally dies, no diamonds? Ritual cast Gentle Repose (no slot). Body stays fresh. Revivify works whenever you get diamonds.' },
  { tip: 'Phantom Steed chain', detail: 'Ritual cast Phantom Steed repeatedly. Each lasts 1 hour. Start the next cast 50 min into the current one. Permanent 100ft mount.' },
  { tip: 'Book of Ancient Secrets', detail: 'Warlock (Tome Pact) with this invocation can learn ANY class\'s ritual spells. The best ritual caster in the game.' },
  { tip: 'Ritual Caster feat for non-casters', detail: 'Fighters, Rogues, Barbarians can take this feat and gain ritual casting. Detect Magic + Find Familiar on a Fighter is amazing.' },
];

export function canRitualCast(className, spellName, isPrepared, isInSpellbook) {
  if (className === 'Wizard' && isInSpellbook) return true;
  if (['Cleric', 'Druid', 'Artificer'].includes(className) && isPrepared) return true;
  if (className === 'Bard' && isPrepared) return true; // "Known" = always prepared for Bards
  return false;
}

export function getRitualSpellsForClass(className) {
  const classSpells = {
    Wizard: ['Detect Magic', 'Identify', 'Find Familiar', 'Tiny Hut', 'Phantom Steed', 'Contact Other Plane', 'Rary\'s Telepathic Bond', 'Tenser\'s Floating Disk', 'Comprehend Languages'],
    Cleric: ['Detect Magic', 'Gentle Repose', 'Silence', 'Commune', 'Speak with Dead', 'Ceremony'],
    Druid: ['Detect Magic', 'Speak with Animals', 'Water Breathing', 'Commune with Nature'],
    Bard: ['Detect Magic', 'Comprehend Languages', 'Speak with Animals', 'Tiny Hut'],
  };
  return classSpells[className] || [];
}
