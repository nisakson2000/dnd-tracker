/**
 * playerCounterspellGuide.js
 * Player Mode: Counterspell usage, timing, and strategy
 * Pure JS — no React dependencies.
 */

export const COUNTERSPELL_RULES = {
  level: '3rd level spell',
  castingTime: 'Reaction (when you see a creature within 60ft casting a spell)',
  range: '60 feet',
  components: 'S (somatic only — no verbal or material)',
  autoCounter: 'If the spell is 3rd level or lower (or equal to the slot used), it automatically fails.',
  abilityCheck: 'If the spell is higher level than the slot used, make an ability check: DC = 10 + spell level. Use your spellcasting ability.',
  note: 'You can Counterspell a Counterspell! (Reaction war)',
};

export const COUNTERSPELL_TABLE = [
  { slotUsed: 3, autoCounters: '1st-3rd', checkDC4th: 14, checkDC5th: 15, checkDC6th: 16, checkDC7th: 17, checkDC8th: 18, checkDC9th: 19 },
  { slotUsed: 4, autoCounters: '1st-4th', checkDC5th: 15, checkDC6th: 16, checkDC7th: 17, checkDC8th: 18, checkDC9th: 19 },
  { slotUsed: 5, autoCounters: '1st-5th', checkDC6th: 16, checkDC7th: 17, checkDC8th: 18, checkDC9th: 19 },
  { slotUsed: 6, autoCounters: '1st-6th', checkDC7th: 17, checkDC8th: 18, checkDC9th: 19 },
  { slotUsed: 7, autoCounters: '1st-7th', checkDC8th: 18, checkDC9th: 19 },
  { slotUsed: 8, autoCounters: '1st-8th', checkDC9th: 19 },
  { slotUsed: 9, autoCounters: 'ALL (auto-success)', },
];

export const COUNTERSPELL_STRATEGY = [
  'Save Counterspell for enemy concentration spells (Banishment, Hold Person, Wall of Force).',
  'Don\'t Counterspell cantrips or low-level spells unless they\'d be devastating.',
  'You must SEE the creature casting — you can\'t Counterspell from behind full cover.',
  'Subtle Spell (Sorcerer) makes your spells immune to Counterspell (no verbal/somatic).',
  'If you used your reaction this round (Shield, OA), you CAN\'T Counterspell.',
  'Abjuration Wizards add proficiency to Counterspell ability checks.',
  'Glibness (8th level) sets your CHA checks to minimum 15 — great for Counterspell.',
  'You don\'t know what spell is being cast unless you use Reaction to identify it (Xanathar\'s) — but that uses your reaction!',
];

export const WHEN_TO_COUNTERSPELL = [
  { priority: 'Critical', spells: ['Power Word Kill', 'Disintegrate', 'Meteor Swarm', 'Gate'] },
  { priority: 'High', spells: ['Banishment', 'Hold Person', 'Wall of Force', 'Forcecage', 'Teleport'] },
  { priority: 'Medium', spells: ['Fireball', 'Lightning Bolt', 'Animate Dead', 'Summon spells'] },
  { priority: 'Low', spells: ['Cantrips', 'Low-level buffs', 'Utility spells'] },
];

export function getCounterspellDC(targetSpellLevel, slotUsed) {
  if (slotUsed >= targetSpellLevel) return { auto: true, dc: null };
  return { auto: false, dc: 10 + targetSpellLevel };
}

export function shouldCounterspell(spellLevel, remainingSlots, isConcentration) {
  if (spellLevel >= 7) return 'Yes — high-level spells are always worth countering.';
  if (isConcentration && spellLevel >= 3) return 'Probably — concentration spells have lasting impact.';
  if (remainingSlots <= 1) return 'Consider carefully — you only have one slot left.';
  return 'Situational — evaluate the threat.';
}
