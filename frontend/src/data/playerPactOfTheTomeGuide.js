/**
 * playerPactOfTheTomeGuide.js
 * Player Mode: Pact of the Tome Warlock — the cantrip collector
 * Pure JS — no React dependencies.
 */

export const TOME_BASICS = {
  pactBoon: 'Pact of the Tome',
  source: 'Player\'s Handbook',
  benefit: 'Choose 3 cantrips from ANY class list. They count as Warlock cantrips.',
  note: 'Best cantrip selection in the game. Grab Guidance, Shillelagh, or any cantrip from any class. Book of Ancient Secrets adds ritual casting.',
};

export const BEST_CANTRIP_PICKS = [
  { cantrip: 'Guidance', source: 'Cleric/Druid', effect: '+1d4 to any ability check', rating: 'S', note: 'Best cantrip in D&D. +1d4 to every skill check. Warlocks can\'t normally get this.' },
  { cantrip: 'Shillelagh', source: 'Druid', effect: 'Weapon uses CHA for attack/damage, 1d8 damage', rating: 'A', note: 'CHA-based melee weapon. Great for Hexblade multiclass or melee Tome Lock.' },
  { cantrip: 'Spare the Dying', source: 'Cleric', effect: 'Stabilize dying creature at range', rating: 'B', note: 'Free stabilization. Nice to have, not essential if you have Healing Word.' },
  { cantrip: 'Thorn Whip', source: 'Druid', effect: '1d6 piercing + pull 10ft', rating: 'B', note: 'Forced movement cantrip. Pull enemies into hazards or toward you.' },
  { cantrip: 'Mage Hand', source: 'Wizard', effect: 'Spectral hand for manipulation at 30ft', rating: 'A', note: 'If you don\'t already have it. Useful utility cantrip.' },
  { cantrip: 'Light', source: 'Cleric/Wizard', effect: 'Object sheds 20ft bright light', rating: 'B', note: 'For races without darkvision. Otherwise niche.' },
  { cantrip: 'Druidcraft', source: 'Druid', effect: 'Predict weather, bloom flowers, sensory effects', rating: 'C', note: 'Flavor cantrip. Only if you want RP utility.' },
];

export const BOOK_OF_ANCIENT_SECRETS = {
  invocation: 'Book of Ancient Secrets',
  requirement: 'Pact of the Tome',
  benefit: 'Learn 2 L1 ritual spells from any class. Can copy more ritual spells found during adventures.',
  note: 'This turns Warlock into a ritual caster. Find Familiar + Detect Magic for free. Can learn ANY ritual from ANY class.',
};

export const BEST_RITUAL_PICKS = [
  { spell: 'Find Familiar', level: 1, note: 'Get a familiar as a Warlock without multiclassing. Essential.', rating: 'S' },
  { spell: 'Detect Magic', level: 1, note: 'Free magic detection. Ritual = no slot cost.', rating: 'S' },
  { spell: 'Comprehend Languages', level: 1, note: 'Free language understanding. Great utility.', rating: 'A' },
  { spell: 'Identify', level: 1, note: 'Free item identification.', rating: 'A' },
  { spell: 'Speak with Animals', level: 1, note: 'Free animal communication. Surprisingly useful.', rating: 'B' },
  { spell: 'Tiny Hut (if found)', level: 3, note: 'Can copy from a Wizard\'s spellbook if found. Safe rest anywhere.', rating: 'S' },
  { spell: 'Water Breathing (if found)', level: 3, note: '24-hour water breathing for 10 creatures. Free.', rating: 'A' },
];

export const TOME_VS_OTHER_PACTS = {
  vsBlade: 'Tome is utility/cantrips. Blade is melee combat. Tome for caster-focused Warlocks.',
  vsChain: 'Tome gives cantrips + rituals. Chain gives a powerful familiar. Both are excellent for different reasons.',
  vsTalisman: 'Tome is strictly better in most cases. Talisman is a fallback for builds that don\'t want the others.',
  recommendation: 'Tome + Book of Ancient Secrets is the strongest utility combo. Take this if you want versatility.',
};

export function tomeCantripsKnown(baseWarlockCantrips, tomeCantrips = 3) {
  return baseWarlockCantrips + tomeCantrips;
}
