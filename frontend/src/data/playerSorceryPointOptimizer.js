/**
 * playerSorceryPointOptimizer.js
 * Player Mode: Sorcerer Metamagic options, costs, and optimization
 * Pure JS — no React dependencies.
 */

export const METAMAGIC_BASICS = {
  points: 'Sorcery Points = Sorcerer level. Recover on long rest.',
  conversion: 'BA: 2 SP → 1st slot, 3 SP → 2nd, 5 SP → 3rd. Or sacrifice slots for SP (1 SP per level).',
  limit: 'One Metamagic per spell (Empowered can stack with another).',
};

export const METAMAGIC_OPTIONS = [
  { name: 'Quickened Spell', cost: 2, effect: 'Action → bonus action casting time.', rating: 'S', best: 'Quicken Fireball + cantrip same turn.' },
  { name: 'Twinned Spell', cost: 'Spell level (min 1)', effect: 'Second target for single-target spell.', rating: 'S', best: 'Twin Haste, Twin Polymorph, Twin Heal.' },
  { name: 'Subtle Spell', cost: 1, effect: 'No verbal/somatic components.', rating: 'A', best: 'Subtle Counterspell can\'t be counter-Counterspelled.' },
  { name: 'Heightened Spell', cost: 3, effect: 'Target has disadvantage on first save.', rating: 'A', best: 'Heighten Hold Monster on boss.' },
  { name: 'Empowered Spell', cost: 1, effect: 'Reroll CHA mod damage dice.', rating: 'B', best: 'Stacks with other Metamagic. Cheap.' },
  { name: 'Extended Spell', cost: 1, effect: 'Double duration (max 24h).', rating: 'B', best: 'Extended Mage Armor (16 hours).' },
  { name: 'Careful Spell', cost: 1, effect: 'CHA mod creatures auto-succeed save.', rating: 'C', best: 'Hypnotic Pattern near allies.' },
  { name: 'Distant Spell', cost: 1, effect: 'Double range. Touch → 30ft.', rating: 'C', best: 'Distant Cure Wounds.' },
  { name: 'Transmuted Spell', cost: 1, effect: 'Change damage type.', rating: 'B', best: 'Bypass fire resistance on Fireball.' },
  { name: 'Seeking Spell', cost: 2, effect: 'Reroll missed spell attack.', rating: 'B', best: 'Insurance on Disintegrate.' },
];

export const METAMAGIC_PRIORITY = {
  alwaysTake: ['Quickened Spell', 'Twinned Spell'],
  usuallyTake: ['Subtle Spell', 'Heightened Spell'],
  sometimesTake: ['Empowered Spell', 'Transmuted Spell'],
};

export const SP_BUDGET = [
  { level: 2, points: 2, note: '1 Quicken or 1 Twin cantrip.' },
  { level: 5, points: 5, note: '2 Quickens or Twin Haste + cantrip.' },
  { level: 10, points: 10, note: '3-4 Metamagic uses per long rest.' },
  { level: 20, points: 20, note: 'Convert unused slots for more SP.' },
];

export function metamagicCost(name, spellLevel) {
  const fixed = { 'Quickened Spell': 2, 'Subtle Spell': 1, 'Heightened Spell': 3, 'Empowered Spell': 1, 'Extended Spell': 1, 'Careful Spell': 1, 'Distant Spell': 1, 'Transmuted Spell': 1, 'Seeking Spell': 2 };
  if (name === 'Twinned Spell') return Math.max(1, spellLevel);
  return fixed[name] || 1;
}

export function spFromSlot(level) { return level; }
export function slotFromSP(sp) {
  if (sp >= 7) return 4;
  if (sp >= 5) return 3;
  if (sp >= 3) return 2;
  if (sp >= 2) return 1;
  return 0;
}
