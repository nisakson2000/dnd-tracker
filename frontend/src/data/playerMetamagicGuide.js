/**
 * playerMetamagicGuide.js
 * Player Mode: Sorcerer Metamagic options, costs, and sorcery point tracking
 * Pure JS — no React dependencies.
 */

export const SORCERY_POINT_RULES = {
  max: 'Equal to Sorcerer level.',
  recharge: 'Long Rest.',
  flexibleCasting: {
    slotsToPoints: [
      { slotLevel: 1, points: 2 },
      { slotLevel: 2, points: 3 },
      { slotLevel: 3, points: 5 },
      { slotLevel: 4, points: 6 },
      { slotLevel: 5, points: 7 },
    ],
    pointsToSlots: [
      { slotLevel: 1, cost: 2 },
      { slotLevel: 2, cost: 3 },
      { slotLevel: 3, cost: 5 },
      { slotLevel: 4, cost: 6 },
      { slotLevel: 5, cost: 7 },
    ],
    note: 'Can\'t create slots above 5th level. Created slots vanish on long rest.',
  },
};

export const METAMAGIC_OPTIONS = [
  { name: 'Careful Spell', cost: 1, description: 'Choose CHA mod creatures. They auto-succeed on the spell\'s saving throw.', level: 3, bestWith: 'Fireball, Hypnotic Pattern — hit enemies but protect allies.' },
  { name: 'Distant Spell', cost: 1, description: 'Double range (or touch → 30ft).', level: 3, bestWith: 'Cure Wounds at 30ft, Shocking Grasp at range.' },
  { name: 'Empowered Spell', cost: 1, description: 'Reroll up to CHA mod damage dice. Must use new results. Can combine with other metamagic.', level: 3, bestWith: 'Fireball — reroll low damage dice.' },
  { name: 'Extended Spell', cost: 1, description: 'Double duration (max 24 hours).', level: 3, bestWith: 'Aid, Mage Armor, Invisibility.' },
  { name: 'Heightened Spell', cost: 3, description: 'One target has disadvantage on first save against the spell.', level: 3, bestWith: 'Hold Person, Banishment — against high-save targets.' },
  { name: 'Quickened Spell', cost: 2, description: 'Change casting time from 1 action to 1 bonus action.', level: 3, bestWith: 'Fireball + cantrip in same turn. Attack action + Hold Person.' },
  { name: 'Seeking Spell', cost: 2, description: 'Reroll missed spell attack (must use new roll).', level: 3, bestWith: 'Chromatic Orb, Scorching Ray — don\'t waste slots on misses.' },
  { name: 'Subtle Spell', cost: 1, description: 'No verbal or somatic components.', level: 3, bestWith: 'Counterspell (can\'t be countered back), social spells (undetectable casting).' },
  { name: 'Transmuted Spell', cost: 1, description: 'Change damage type to acid, cold, fire, lightning, poison, or thunder.', level: 3, bestWith: 'Fireball as lightning damage to bypass fire resistance.' },
  { name: 'Twinned Spell', cost: 'Spell level (1 min)', description: 'Target a second creature with a single-target spell.', level: 3, bestWith: 'Haste, Polymorph, Greater Invisibility — double the buff!' },
];

export function getSorceryPoints(sorcererLevel) {
  return sorcererLevel;
}

export function getTwinCost(spellLevel) {
  return Math.max(1, spellLevel);
}

export function canTwin(spell) {
  // Rough check — can't twin multi-target spells or self-only spells
  if (!spell) return false;
  if (spell.targets && spell.targets > 1) return false;
  if (spell.range === 'Self') return false;
  return true;
}

export function getSlotFromPoints(points) {
  const entry = SORCERY_POINT_RULES.flexibleCasting.pointsToSlots
    .filter(e => e.cost <= points)
    .sort((a, b) => b.slotLevel - a.slotLevel);
  return entry[0] || null;
}

export function getPointsFromSlot(slotLevel) {
  const entry = SORCERY_POINT_RULES.flexibleCasting.slotsToPoints
    .find(e => e.slotLevel === slotLevel);
  return entry ? entry.points : 0;
}
