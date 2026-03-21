/**
 * playerMagicCrafting.js
 * Player Mode: Artificer infusions and magic item creation
 * Pure JS — no React dependencies.
 */

export const INFUSION_BASICS = {
  known: '4 (L2), 6 (L6), 8 (L10), 10 (L14), 12 (L18).',
  active: 'Half known infusions active at once.',
  note: 'Free magic items for your party every long rest.',
};

export const TOP_INFUSIONS = [
  { name: 'Enhanced Weapon', level: 2, effect: '+1 weapon (+2 at L10).', rating: 'S' },
  { name: 'Enhanced Defense', level: 2, effect: '+1 AC to armor/shield (+2 at L10).', rating: 'S' },
  { name: 'Mind Sharpener', level: 2, effect: '4 charges: auto-succeed concentration save.', rating: 'S' },
  { name: 'Cloak of Protection', level: 2, effect: '+1 AC and saves.', rating: 'S' },
  { name: 'Winged Boots', level: 6, effect: 'Fly speed = walk speed.', rating: 'S' },
  { name: 'Homunculus Servant', level: 2, effect: 'Tiny construct. Force Strike + Channel Magic.', rating: 'A' },
  { name: 'Bag of Holding', level: 2, effect: 'Free 500 lb storage.', rating: 'A' },
  { name: 'Spell-Refueling Ring', level: 6, effect: 'Recover 1 slot (≤3rd)/day.', rating: 'A' },
  { name: 'Helm of Awareness', level: 10, effect: 'Adv initiative. Can\'t be surprised.', rating: 'A' },
  { name: 'Enhanced Arcane Focus', level: 2, effect: '+1 spell attacks. Ignore half cover.', rating: 'A' },
];

export const INFUSION_PRIORITY = [
  '1. Enhanced Weapon (for martial)',
  '2. Enhanced Defense (for tank)',
  '3. Cloak of Protection (for squishy)',
  '4. Mind Sharpener (for concentrator)',
  '5. Bag of Holding (party utility)',
];

export function infusionsKnown(level) {
  if (level >= 18) return 12;
  if (level >= 14) return 10;
  if (level >= 10) return 8;
  if (level >= 6) return 6;
  return level >= 2 ? 4 : 0;
}

export function activeInfusions(level) {
  return Math.ceil(infusionsKnown(level) / 2);
}
