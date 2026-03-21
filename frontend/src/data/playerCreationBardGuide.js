/**
 * playerCreationBardGuide.js
 * Player Mode: College of Creation Bard — the maker of things
 * Pure JS — no React dependencies.
 */

export const CREATION_BASICS = {
  class: 'Bard (College of Creation)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Create objects from nothing. Animate items. Performance of Creation for utility.',
  note: 'Creative and flexible. Note of Potential upgrades Bardic Inspiration. Performance of Creation can solve puzzles/problems with conjured items. Animating Performance is a solid combat pet.',
};

export const CREATION_FEATURES = [
  { feature: 'Mote of Potential', level: 3, effect: 'When you give Bardic Inspiration, a mote orbits the creature. When BI die used: ability check → treats roll as 2 and picks higher. Attack roll → BI die damage to creatures within 5ft of target (CON save half). Save → roll BI die, gain temp HP on success.', note: 'Bardic Inspiration now has bonus effects based on how it\'s used. Attack roll = free AoE damage. Save = temp HP. Always useful.' },
  { feature: 'Performance of Creation', level: 3, effect: 'Action: create one nonmagical item. Size/value limited by level. Lasts PB hours. 1/LR or 1 L2+ slot.', note: 'Create a ladder, rope, oil, ball bearings, 10ft pole — any mundane item. Size limit: Medium at L3, Large at L6, Huge at L14.' },
  { feature: 'Animating Performance', level: 6, effect: 'Action: animate a Large or smaller nonmagical item as a dancing item (creature stats). PB uses/LR. Bonus action to command.', note: 'Combat pet! Irrepressible Dance: forced movement on hit. HP = 10 + 5×bard level. It\'s a solid frontliner.' },
  { feature: 'Creative Crescendo', level: 14, effect: 'Performance of Creation: create CHA mod items simultaneously. One can be 5× GP limit. Items not limited by size.', note: 'Create multiple items at once. One can be very valuable. Massive utility for creative players.' },
];

export const CREATION_TACTICS = [
  { tactic: 'Create cover/obstacles', detail: 'Performance of Creation: conjure a wall, barricade, or large object for cover. Create difficult terrain objects.', rating: 'A' },
  { tactic: 'Animated item frontliner', detail: 'Animate a table/chair into a dancing item. It has decent HP, deals force damage, and can Irrepressible Dance push enemies.', rating: 'A' },
  { tactic: 'Mote attack roll AoE', detail: 'Give BI to a melee ally. When they use it on attack: BI die damage to all enemies within 5ft of target. Free AoE.', rating: 'A' },
  { tactic: 'Create expensive items', detail: 'L14 Creative Crescendo: create items worth 20× GP limit. Create siege equipment, expensive tools, or quest items temporarily.', rating: 'A' },
  { tactic: 'Performance of Creation + puzzles', detail: 'Need a specific key, tool, or item? Create it. Bridge a gap with a created plank. Solve problems with conjured items.', rating: 'S' },
];

export function performanceOfCreationLimits(bardLevel) {
  if (bardLevel >= 14) return { maxSize: 'Huge', gpLimit: 2000, maxItems: 'CHA mod' };
  if (bardLevel >= 6) return { maxSize: 'Large', gpLimit: 200, maxItems: 1 };
  return { maxSize: 'Medium', gpLimit: 20, maxItems: 1 };
}

export function dancingItemHP(bardLevel) {
  return 10 + 5 * bardLevel;
}
