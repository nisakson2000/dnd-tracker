/**
 * playerRuneKnightGuide.js
 * Player Mode: Rune Knight Fighter subclass optimization
 * Pure JS — no React dependencies.
 */

export const RUNE_KNIGHT_BASICS = {
  class: 'Fighter (Rune Knight)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Giant-themed Fighter who inscribes magical runes on equipment.',
  keyFeature: 'Giant\'s Might: bonus action to become Large (+1d6 damage, advantage on STR checks/saves).',
};

export const RUNE_KNIGHT_FEATURES = [
  { feature: 'Giant\'s Might', level: 3, effect: 'Bonus action: Large size, +1d6 extra damage (once per turn), advantage on STR checks/saves. PB uses/long rest.', note: 'Being Large lets you grapple Huge creatures. +1d6 damage per turn scales well.' },
  { feature: 'Rune Carver', level: 3, effect: 'Learn 2 runes at L3 (more at 7, 10, 15). Each has passive + active ability.', note: 'Runes are incredibly powerful. Each one is like a mini-feat.' },
  { feature: 'Great Stature', level: 10, effect: 'Grow 3d4 inches permanently. Giant\'s Might damage becomes 1d8.', note: 'Damage scales from d6 to d8.' },
  { feature: 'Master of Runes', level: 15, effect: 'Each rune can be used twice per short rest instead of once.', note: 'Double rune uses = double the power.' },
  { feature: 'Runic Juggernaut', level: 18, effect: 'Giant\'s Might: become Huge (not just Large). Damage becomes 1d10. Reach +5ft.', note: 'Huge size with 10ft reach. Grapple Gargantuan creatures.' },
];

export const RUNES_RANKED = [
  { rune: 'Fire Rune', passive: 'Double proficiency on tool checks.', active: 'On hit: +2d6 fire damage + restrained for 1 minute (STR save each turn).', rating: 'S', note: 'Restrained = advantage on your attacks, disadvantage on their attacks. The best rune.' },
  { rune: 'Storm Rune', passive: 'Advantage on Arcana checks. Can\'t be surprised.', active: 'Reaction: advantage or disadvantage on any attack/check/save within 60ft. 1 minute.', rating: 'S', note: 'Pseudo-Bardic Inspiration/Cutting Words for 1 minute. Incredible support.' },
  { rune: 'Stone Rune', passive: 'Advantage on Insight. Darkvision 120ft.', active: 'Reaction: creature ends turn within 30ft → charmed and incapacitated (WIS save). 1 minute.', rating: 'S', note: 'Basically Hold Person as a reaction. Incapacitated = can\'t act.' },
  { rune: 'Cloud Rune', passive: 'Advantage on Deception and Sleight of Hand.', active: 'Reaction: when you or ally within 30ft is hit, redirect the attack to another creature within 30ft.', rating: 'A', note: 'Redirect enemy attacks onto other enemies. Incredibly cool.' },
  { rune: 'Frost Rune', passive: 'Advantage on Animal Handling and Intimidation.', active: 'Bonus action: +2 to STR and CON checks/saves for 10 minutes.', rating: 'B', note: 'Stacks with Giant\'s Might advantage on STR. Makes grappling nearly guaranteed.' },
  { rune: 'Hill Rune', passive: 'Advantage on saves vs poison. Poison resistance.', active: 'Bonus action: resistance to bludgeoning/piercing/slashing for 1 minute.', rating: 'A', note: 'Physical damage resistance without Raging. Defensive powerhouse.' },
];

export const RUNE_KNIGHT_TACTICS = [
  { tactic: 'Giant\'s Might + Grapple', detail: 'Become Large. Grapple up to Huge creatures. +1d6 damage. Advantage on Athletics.', rating: 'S' },
  { tactic: 'Fire Rune restrain', detail: 'Hit → Fire Rune → 2d6 fire + restrained. All subsequent attacks have advantage.', rating: 'S' },
  { tactic: 'Storm Rune support', detail: 'Active for 1 minute. Give advantage to allies\' saves and disadvantage to enemy attacks.', rating: 'S' },
  { tactic: 'Cloud Rune redirect', detail: 'Enemy crits your ally? Redirect that crit onto another enemy. Damage reflected.', rating: 'A' },
  { tactic: 'PAM + Fire Rune', detail: 'PAM bonus attack triggers Fire Rune restrain. Then remaining attacks with advantage.', rating: 'S' },
];

export function giantsMightDamage(level) {
  if (level >= 18) return 10; // d10
  if (level >= 10) return 8; // d8
  return 6; // d6
}

export function runesKnown(level) {
  if (level >= 15) return 5;
  if (level >= 10) return 4;
  if (level >= 7) return 3;
  return 2;
}

export function grappleSizeLimit(level) {
  if (level >= 18) return 'Gargantuan';
  if (level >= 3) return 'Huge'; // Large + 1 size category
  return 'Large'; // Medium creature grapples Large
}
