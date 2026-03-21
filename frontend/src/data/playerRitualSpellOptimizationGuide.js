/**
 * playerRitualSpellOptimizationGuide.js
 * Player Mode: Ritual casting optimization — free spells every day
 * Pure JS — no React dependencies.
 */

export const RITUAL_RULES = {
  extraTime: '+10 minutes to casting time.',
  noSlot: 'Does NOT expend a spell slot.',
  whoCanRitual: 'Wizard, Cleric, Druid, Bard (only known), Artificer.',
  cannotRitual: 'Sorcerer, Warlock (unless Pact of Tome), Ranger, Paladin.',
  wizardAdvantage: 'Wizard ritual casts from spellbook without preparing.',
  ritualCasterFeat: 'Any class can learn ritual spells via the Ritual Caster feat.',
};

export const BEST_RITUALS = [
  { spell: 'Detect Magic', level: 1, note: 'Scan every room. Always ritual. Never slot this.', rating: 'S' },
  { spell: 'Find Familiar', level: 1, note: 'Summon scout/helper for free. Essential for Wizards.', rating: 'S' },
  { spell: 'Tiny Hut', level: 3, note: 'Safe camp for 8 hours. Free long rest protection.', rating: 'S' },
  { spell: 'Identify', level: 1, note: 'ID magic items. Free with ritual. Some tables use short rest variant instead.', rating: 'A' },
  { spell: 'Comprehend Languages', level: 1, note: 'Read/understand any language. Free translation.', rating: 'A' },
  { spell: 'Water Breathing', level: 3, note: '24 hours, 10 creatures. Free water exploration.', rating: 'A' },
  { spell: 'Phantom Steed', level: 3, note: '100ft speed horse. Chain-cast for infinite fast travel.', rating: 'A' },
  { spell: 'Commune', level: 5, note: '3 yes/no questions to deity. Free info gathering.', rating: 'A' },
  { spell: 'Rary\'s Telepathic Bond', level: 5, note: 'Party telepathy for 1 hour. Free coordination.', rating: 'A' },
];

export const RITUAL_TIPS = [
  { tip: 'Never slot a ritual if you have 10 minutes', detail: 'Save spell slots for combat. Rituals are free.' },
  { tip: 'Wizards: copy every ritual you find', detail: 'Each ritual in your book = permanent free spell.' },
  { tip: 'Ritual Caster feat for non-casters', detail: 'Fighters/Rogues: take the feat for Find Familiar, Detect Magic, Tiny Hut.' },
  { tip: 'Chain-cast Phantom Steed', detail: 'Start casting next Phantom Steed 10 min before current one expires. Infinite fast mount.' },
  { tip: 'Tiny Hut every night', detail: 'Wizard/Bard: ritual Tiny Hut = safe camp every long rest.' },
];

export function ritualCastTime(normalMinutes) {
  return normalMinutes + 10;
}

export function slotsSavedPerDay(ritualCasts) {
  return ritualCasts;
}
