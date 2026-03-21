/**
 * playerMagicItemSlotGuide.js
 * Player Mode: Attunement rules, slot management, and best magic items
 * Pure JS — no React dependencies.
 */

export const ATTUNEMENT_RULES = {
  slots: 'Maximum 3 attuned items at once.',
  process: 'Short rest spent focusing on the item.',
  ending: 'Voluntary (no action), exceed 100ft for 24h, die, another creature attunes.',
  artificer: 'Artificer: 4 at L10, 5 at L14, 6 at L18.',
};

export const BEST_ATTUNEMENT_ITEMS = [
  { item: 'Cloak of Protection', rarity: 'Uncommon', effect: '+1 AC and all saves.', rating: 'S+' },
  { item: 'Ring of Protection', rarity: 'Rare', effect: '+1 AC and all saves.', rating: 'S+' },
  { item: 'Amulet of Health', rarity: 'Rare', effect: 'CON becomes 19.', rating: 'S+' },
  { item: 'Belt of Giant Strength', rarity: 'Varies', effect: 'STR 21-29.', rating: 'S+' },
  { item: 'Staff of Power', rarity: 'Very Rare', effect: '+2 AC/saves/attacks/DC.', rating: 'S+' },
  { item: 'Bracers of Defense', rarity: 'Rare', effect: '+2 AC (no armor/shield).', rating: 'S' },
  { item: 'Winged Boots', rarity: 'Uncommon', effect: 'Fly = walk speed, 4h.', rating: 'S' },
  { item: 'Headband of Intellect', rarity: 'Uncommon', effect: 'INT becomes 19.', rating: 'A+' },
];

export const BEST_NO_ATTUNEMENT = [
  { item: '+X Armor/Shield', effect: 'AC bonus. No attunement.' },
  { item: 'Bag of Holding', effect: '500 lbs extradimensional storage.' },
  { item: 'Immovable Rod', effect: 'Holds 8,000 lbs in place.' },
  { item: 'Broom of Flying', effect: '50ft fly speed.' },
  { item: 'Sending Stones', effect: 'Sending 1/day between pair.' },
];

export const ATTUNEMENT_TIPS = [
  'Only 3 slots. Prioritize always-on items.',
  'Cloak + Ring of Protection: +2 AC and +2 all saves.',
  'Amulet of Health: dump CON, get 19 free.',
  'Prefer non-attunement items when possible.',
  'Artificer: extra attunement slots at L10/14/18.',
  'Identify or short rest reveals attunement needs.',
  'Winged Boots: flight changes everything.',
  'Staff of Power: best caster item.',
  'Don\'t attune to situational items.',
  'Belt of Giant Strength: dump STR at creation.',
];
