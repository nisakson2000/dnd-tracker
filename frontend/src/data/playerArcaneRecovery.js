/**
 * playerArcaneRecovery.js
 * Player Mode: Wizard Arcane Recovery, Sorcerer Font of Magic, and similar short-rest recovery features
 * Pure JS — no React dependencies.
 */

export const ARCANE_RECOVERY = {
  class: 'Wizard',
  level: 2,
  description: 'Once per day after a short rest, recover expended spell slots.',
  formula: 'Total slot levels recovered = half your Wizard level (rounded up).',
  restriction: 'Cannot recover slots of 6th level or higher.',
  timing: 'Once per day (not per short rest).',
  examples: [
    { wizardLevel: 2, maxRecovery: 1, suggestion: '1 × 1st level slot' },
    { wizardLevel: 4, maxRecovery: 2, suggestion: '1 × 2nd level slot OR 2 × 1st level slots' },
    { wizardLevel: 6, maxRecovery: 3, suggestion: '1 × 3rd level slot OR 1 × 2nd + 1 × 1st' },
    { wizardLevel: 10, maxRecovery: 5, suggestion: '1 × 5th level slot OR 1 × 3rd + 1 × 2nd' },
    { wizardLevel: 20, maxRecovery: 10, suggestion: '2 × 5th level slots OR 1 × 5th + 1 × 4th + 1 × 1st' },
  ],
};

export const FONT_OF_MAGIC = {
  class: 'Sorcerer',
  level: 2,
  description: 'Convert sorcery points to spell slots or vice versa.',
  sorceryPointsPerLevel: 'Equal to your Sorcerer level.',
  pointsToSlots: [
    { slotLevel: 1, pointCost: 2 },
    { slotLevel: 2, pointCost: 3 },
    { slotLevel: 3, pointCost: 5 },
    { slotLevel: 4, pointCost: 6 },
    { slotLevel: 5, pointCost: 7 },
  ],
  slotsToPoints: 'Slot level = sorcery points gained (1st → 1 point, 2nd → 2 points, etc.)',
  restriction: 'Cannot create slots above 5th level.',
  tip: 'Convert low-level slots you won\'t use into sorcery points for Metamagic.',
};

export const NATURAL_RECOVERY = {
  class: 'Druid (Land)',
  level: 2,
  description: 'During a short rest, recover expended spell slots.',
  formula: 'Total slot levels = half your Druid level (rounded up).',
  restriction: 'Cannot recover 6th+ level slots. Once per long rest.',
  note: 'Identical to Arcane Recovery but for Land Druids.',
};

export const HARNESS_DIVINE_POWER = {
  class: 'Cleric / Paladin (Tasha\'s)',
  level: 2,
  description: 'As a bonus action, expend a use of Channel Divinity to regain one spell slot.',
  formula: 'Slot level recovered = proficiency bonus ÷ 2 (rounded up).',
  restriction: 'Number of times per long rest = proficiency bonus.',
  note: 'Great way to use Channel Divinity when you don\'t need the special feature.',
};

export function getArcaneRecoveryMax(wizardLevel) {
  return Math.ceil(wizardLevel / 2);
}

export function getSorceryPoints(sorcererLevel) {
  return sorcererLevel;
}

export function getSlotCostInPoints(slotLevel) {
  const entry = FONT_OF_MAGIC.pointsToSlots.find(p => p.slotLevel === slotLevel);
  return entry ? entry.pointCost : null;
}

export function getHarnessDivineSlotMax(profBonus) {
  return Math.ceil(profBonus / 2);
}
