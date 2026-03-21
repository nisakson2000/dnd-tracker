/**
 * playerCombatEndChecklist.js
 * Player Mode: Post-combat checklist and cleanup
 * Pure JS — no React dependencies.
 */

export const COMBAT_END_CHECKLIST = [
  { step: 1, label: 'Stabilize Downed Allies', description: 'Medicine DC 10, Spare the Dying, or Healer\'s Kit. Then heal them.', priority: 'critical' },
  { step: 2, label: 'End Concentration Spells', description: 'Drop concentration on no-longer-needed spells. Note ongoing buffs/effects.', priority: 'high' },
  { step: 3, label: 'Recover Ammunition', description: 'Recover half of spent ammunition/thrown weapons by searching the area.', priority: 'medium' },
  { step: 4, label: 'Loot Bodies', description: 'Search fallen enemies for coins, items, weapons, and clues.', priority: 'medium' },
  { step: 5, label: 'Check HP & Resources', description: 'Note current HP, remaining spell slots, ki points, rages, etc.', priority: 'high' },
  { step: 6, label: 'Short Rest Decision', description: 'Does the party need a short rest? Weigh risk vs benefit.', priority: 'high' },
  { step: 7, label: 'Identify Magic Items', description: 'Use Identify spell (ritual, no slot) or Arcana check on found items.', priority: 'low' },
  { step: 8, label: 'Note XP/Milestones', description: 'Record XP gained or note milestone progress.', priority: 'low' },
  { step: 9, label: 'Environmental Check', description: 'Any lingering hazards? Fires, gas, structural damage?', priority: 'medium' },
  { step: 10, label: 'Secure the Area', description: 'Post a watch. Check for reinforcements. Block entrances if resting.', priority: 'medium' },
];

export const SHORT_REST_DECISION = {
  reasons_to_rest: [
    'Multiple party members below half HP.',
    'Warlock has no spell slots.',
    'Fighter used Action Surge.',
    'Monk is low on ki points.',
    'Short rest features (Channel Divinity, Second Wind) are spent.',
  ],
  reasons_not_to_rest: [
    'Time pressure (captives, ritual in progress, pursuit).',
    'Enemies may send reinforcements.',
    'Party is mostly full HP with resources.',
    'Only 1 hit die remaining and low level.',
    'Area is unsafe for a full hour of rest.',
  ],
};

export function getCombatEndChecklist() {
  return COMBAT_END_CHECKLIST;
}

export function shouldShortRest(partyStatus) {
  const { avgHPPercent, warlockSlots, fighterActionSurge, monkKi, totalResources } = partyStatus;
  let score = 0;
  if (avgHPPercent < 50) score += 2;
  if (avgHPPercent < 25) score += 2;
  if (warlockSlots === 0) score += 2;
  if (fighterActionSurge === 0) score += 1;
  if (monkKi === 0) score += 1;
  if (totalResources < 0.3) score += 1;
  return { shouldRest: score >= 3, urgency: score, reasons: score >= 3 ? 'Party resources are low' : 'Party is doing okay' };
}
