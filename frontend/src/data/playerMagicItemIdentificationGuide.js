/**
 * playerMagicItemIdentificationGuide.js
 * Player Mode: Magic item identification methods
 * Pure JS — no React dependencies.
 */

export const IDENTIFICATION_METHODS = [
  {
    method: 'Identify spell (L1, Ritual)',
    time: '1 minute (ritual: 11 minutes)',
    cost: 'Free (ritual) or L1 slot',
    reveals: 'All properties, how to use, charges, attunement requirement, curses (DM-dependent)',
    note: 'Primary method. Ritual cast = no slot cost. RAW does NOT reveal curses (DMG p.139), but many DMs allow it.',
  },
  {
    method: 'Short Rest study',
    time: '1 short rest (1 hour minimum)',
    cost: 'Free',
    reveals: 'All properties, how to use, attunement requirement',
    note: 'DMG variant rule (many DMs use it). Focus on one item during a short rest to learn its properties. Free and common.',
  },
  {
    method: 'Attunement',
    time: '1 short rest',
    cost: 'Free (uses an attunement slot)',
    reveals: 'All properties upon attuning',
    note: 'Risky: if the item is cursed, you\'re now attuned to a cursed item. Identify first when possible.',
  },
  {
    method: 'Detect Magic spell (L1, Ritual)',
    time: '1 action (ritual: 11 minutes)',
    cost: 'Free (ritual) or L1 slot',
    reveals: 'Presence of magic and its school. Does NOT reveal properties.',
    note: 'Tells you "this is magical, school of Evocation" but not what it does. First step in identification.',
  },
  {
    method: 'Arcana check',
    time: 'Action',
    cost: 'Free',
    reveals: 'DM-dependent. Some DMs allow Arcana to identify common magic items.',
    note: 'Not RAW for identification but commonly house-ruled. DC varies by rarity.',
  },
  {
    method: 'Experimentation',
    time: 'Varies',
    cost: 'Free (but risky)',
    reveals: 'Depends on what you try.',
    note: 'Drink the potion, swing the sword, speak a command word. Fun but dangerous with unknown items.',
  },
];

export const IDENTIFICATION_BY_RARITY = [
  { rarity: 'Common', arcana_dc: 10, note: 'Easy to identify. Most shopkeepers know these.' },
  { rarity: 'Uncommon', arcana_dc: 15, note: 'Moderate. Requires some magical knowledge.' },
  { rarity: 'Rare', arcana_dc: 20, note: 'Difficult. Specialist needed.' },
  { rarity: 'Very Rare', arcana_dc: 25, note: 'Very hard. Few people know these items.' },
  { rarity: 'Legendary', arcana_dc: 30, note: 'Nearly impossible without Identify. These are unique artifacts.' },
];

export const CURSED_ITEMS = {
  identification: 'Identify spell does NOT reveal curses (RAW, DMG p.139). Some DMs override this.',
  detection: 'Usually discovered only after attuning or using the item.',
  removal: 'Remove Curse (L3) ends attunement to cursed item. Greater Restoration or Wish for powerful curses.',
  common_curses: [
    { curse: 'Can\'t unattune', effect: 'You can\'t voluntarily end attunement. Takes an attunement slot permanently.', removal: 'Remove Curse' },
    { curse: 'Personality change', effect: 'Item changes your alignment, personality, or goals.', removal: 'Remove Curse + roleplay' },
    { curse: 'Disadvantage', effect: 'Disadvantage on attacks/saves with other items of the same type.', removal: 'Remove Curse' },
    { curse: 'Berserker', effect: 'Must attack nearest creature when damaged. WIS save to resist.', removal: 'Remove Curse (Berserker Axe)' },
  ],
  note: 'Always Identify items before attuning if possible. Even though Identify doesn\'t reveal curses RAW, cautious play helps.',
};

export const IDENTIFICATION_TACTICS = [
  { tactic: 'Ritual Identify everything', detail: 'Wizard/Bard with Identify: ritual cast on every magic item found. Free, takes 11 minutes. Do it during short rests.', rating: 'S' },
  { tactic: 'Short rest study', detail: 'If no Identify available: study one item per short rest. Free identification but one at a time.', rating: 'A' },
  { tactic: 'Detect Magic first pass', detail: 'Ritual Detect Magic to scan a room. Find which items are magical, then Identify them specifically.', rating: 'A' },
  { tactic: 'Never blind-attune', detail: 'Don\'t attune to unknown items. Identify first. Cursed items trap you upon attunement.', rating: 'A' },
  { tactic: 'Hire an identifier', detail: 'In cities: pay a wizard to Identify items. Typically 20-50gp per item. Cheaper than a party member learning the spell.', rating: 'B' },
];

export function identifyCost(numItems, hasRitualCaster = true) {
  if (hasRitualCaster) return { totalCost: 0, time: `${numItems * 11} minutes`, note: 'Ritual casting = free but slow' };
  return { totalCost: numItems, time: `${numItems} minutes`, slots: `${numItems} L1 slots`, note: 'Spell slot per item' };
}
