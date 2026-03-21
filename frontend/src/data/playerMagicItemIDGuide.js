/**
 * playerMagicItemIDGuide.js
 * Player Mode: Identifying, attuning, and managing magic items
 * Pure JS — no React dependencies.
 */

export const ID_METHODS = [
  { method: 'Identify (L1 ritual)', time: '11 min', cost: '100gp pearl (not consumed)', rating: 'S', note: 'All properties revealed. Doesn\'t reveal curses RAW.' },
  { method: 'Short Rest handling', time: '1 hour', cost: 'Free', rating: 'A+', note: 'Focus during SR: learn properties. Same as Identify.' },
  { method: 'Detect Magic (ritual)', time: '11 min', cost: 'Free', rating: 'B+', note: 'School of magic only. Not specific properties.' },
  { method: 'Arcana check', time: 'Action', cost: 'Free', rating: 'B', note: 'DM-dependent. Not RAW standard.' },
];

export const ATTUNEMENT = {
  process: 'Short rest focusing on item. 1 new attunement per SR.',
  maxSlots: '3 (4-6 for Artificers at high level).',
  end: 'Voluntarily (no action), die, exceed slots, or lose item.',
  curseNote: 'Cursed items often can\'t be unattuned without Remove Curse.',
};

export const CURSED_ITEMS = [
  { type: 'Can\'t unattune', example: 'Sword of Vengeance', fix: 'Remove Curse spell.' },
  { type: 'Can\'t put down', example: 'Various cursed weapons', fix: 'Remove Curse.' },
  { type: 'Personality change', example: 'Helm of Opposite Alignment', fix: 'Remove Curse or Greater Restoration.' },
  { type: 'Drawback + benefit', example: 'Berserker Axe (+1, must attack nearest)', fix: 'Manageable. Remove Curse if too disruptive.' },
  { type: 'Gradual corruption', example: 'Sentient evil items, Eye of Vecna', fix: 'Varies. May need quest or artifact-level intervention.' },
];

export const ITEM_TIPS = [
  'Identify via short rest is free. Only spell-Identify when you can\'t wait an hour.',
  'Identify does NOT reveal curses. Be cautious with items from evil sources.',
  'Don\'t waste attunement slots on weak items.',
  'Consumables are meant to be used. Hoarding potions wastes gold.',
  'Bag of Holding + Portable Hole = both destroyed, everything sent to Astral Plane.',
  'Share items. +1 sword to the Fighter, not the Wizard.',
  'Artificers get 4-6 attunement slots. They\'re the magic item specialists.',
];
