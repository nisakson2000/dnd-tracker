/**
 * playerFeyEncounters.js
 * Player Mode: Fighting and negotiating with fey creatures
 * Pure JS — no React dependencies.
 */

export const FEY_TRAITS = {
  common: ['Charmed condition immunity (many, not all)', 'Magic Resistance (some)', 'Innate spellcasting', 'Tricky and deceptive', 'Weakness to cold iron (folklore, not RAW)'],
  behavior: 'Fey rarely fight fair. They use illusions, charms, and bargains. Violence is a last resort.',
  dealWarning: 'NEVER make open-ended deals with fey. They twist words. Be extremely specific.',
};

export const FEY_CREATURES = [
  { name: 'Pixie', cr: 0.25, danger: 'Low combat, high utility', note: 'Can cast Polymorph, Fly, Confusion. Invisible at will. More dangerous than CR suggests.' },
  { name: 'Sprite', cr: 0.25, danger: 'Poison', note: 'Heart Sight detects alignment. Poison arrows cause unconsciousness.' },
  { name: 'Satyr', cr: 0.5, danger: 'Magic Resistance', note: 'Advantage on saves vs magic. Charming personality. Ram attack.' },
  { name: 'Dryad', cr: 1, danger: 'Charm', note: 'Charm Person at will. Tree Stride teleportation. Fights near trees.' },
  { name: 'Green Hag', cr: 3, danger: 'Coven', note: 'Invisible, mimicry, illusory appearance. In coven: CR 5 with shared spellcasting.' },
  { name: 'Hag Coven', cr: 5, danger: 'Spellcasting', note: '3 hags share spell list. Can cast Polymorph, Lightning Bolt, Bestow Curse.' },
  { name: 'Eladrin', cr: 10, danger: 'Fey Step + abilities', note: '4 seasonal forms with different abilities. Fey Step + AoE effect.' },
  { name: 'Archfey (Warlock Patron)', cr: 'Varies', danger: 'Extreme', note: 'Titania, Oberon, Queen of Air and Darkness. Near-deity power.' },
];

export const ANTI_FEY_TOOLKIT = [
  { tool: 'Protection from Evil and Good', note: 'Prevents charm/frighten from fey. Disadvantage on their attacks.' },
  { tool: 'Dispel Magic', note: 'Counter fey illusions and enchantments.' },
  { tool: 'Calm Emotions', note: 'Suppress charm effects on allies. End fey enchantments.' },
  { tool: 'Moonbeam', note: 'Shapechanger check. Forces fey out of alternate forms.' },
  { tool: 'Zone of Truth', note: 'Fey deals rely on word-twisting. Zone of Truth prevents lies (but not misleading truths).' },
  { tool: 'Iron weapons (homebrew)', note: 'Many DMs rule cold iron hurts fey. Ask your DM. Not RAW 5e.' },
];

export const FEY_NEGOTIATION = [
  'Never say "anything" or "whatever you want." Be specific in every word.',
  'Fey can\'t lie (in some settings) but are masters of misleading truths.',
  'Names have power. Don\'t give your true name freely.',
  'Gifts create obligations. Don\'t accept gifts without understanding the cost.',
  'Time works differently in the Feywild. A day there might be a year in the Material Plane.',
  'Flattery works. Fey have enormous egos.',
  'Music and art are valid currencies with fey.',
];

export function hagCovenCR(numberOfHags) {
  if (numberOfHags >= 3) return 5;
  return 3;
}

export function feywildTimeDilation(daysInFeywild) {
  // Common DM ruling: 1 day Feywild = 1d4 weeks Material
  return { minWeeks: daysInFeywild, maxWeeks: daysInFeywild * 4, note: 'DM discretion — varies wildly' };
}
