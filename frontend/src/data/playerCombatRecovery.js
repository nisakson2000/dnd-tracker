/**
 * playerCombatRecovery.js
 * Player Mode: Post-combat recovery checklist and resource management
 * Pure JS — no React dependencies.
 */

export const POST_COMBAT_CHECKLIST = [
  { step: 1, label: 'Stabilize the Dying', description: 'Any allies at 0 HP? Medicine check (DC 10) or Spare the Dying.', priority: 'critical', category: 'healing' },
  { step: 2, label: 'Heal Critical Injuries', description: 'Get everyone above 0 HP. Use Healing Word or potions.', priority: 'critical', category: 'healing' },
  { step: 3, label: 'Check for Pursuit', description: 'Are more enemies coming? Perception check for approaching threats.', priority: 'high', category: 'security' },
  { step: 4, label: 'Secure the Area', description: 'Check for traps, lock doors, set a watch if resting.', priority: 'high', category: 'security' },
  { step: 5, label: 'Loot Bodies', description: 'Search defeated enemies. Investigation check for hidden items.', priority: 'medium', category: 'loot' },
  { step: 6, label: 'Gather Information', description: 'Any clues on the bodies? Letters, maps, insignias?', priority: 'medium', category: 'loot' },
  { step: 7, label: 'Short Rest Decision', description: 'Do you have time? Need hit dice? Class features to recover?', priority: 'medium', category: 'recovery' },
  { step: 8, label: 'Resource Audit', description: 'Check spell slots, class features, consumables used.', priority: 'medium', category: 'recovery' },
  { step: 9, label: 'Update Status', description: 'Remove temporary effects. Check concentration spells. Reset conditions.', priority: 'low', category: 'bookkeeping' },
  { step: 10, label: 'Debrief', description: 'What worked? What didn\'t? Any tactical adjustments for next fight?', priority: 'low', category: 'bookkeeping' },
];

export const RESOURCE_RECOVERY_QUICK_REF = {
  shortRest: [
    'Spend Hit Dice to heal (roll + CON mod per die)',
    'Fighter: Second Wind, Action Surge, Superiority Dice',
    'Warlock: All Pact Magic spell slots',
    'Monk: Ki Points',
    'Bard (5+): Bardic Inspiration',
    'Cleric: Channel Divinity (1 use)',
    'Druid: Wild Shape',
    'Wizard: Arcane Recovery (1/day)',
  ],
  longRest: [
    'All HP restored',
    'Half total Hit Dice recovered (rounded down)',
    'All spell slots recovered',
    'All class features recovered',
    'One level of exhaustion removed',
    'Death save counters reset',
  ],
};

export const TRIAGE_PRIORITY = [
  { condition: 'Dying (0 HP, making death saves)', priority: 1, action: 'Stabilize immediately. Healing Word, Spare the Dying, or DC 10 Medicine.' },
  { condition: 'Unconscious but stable', priority: 2, action: 'Heal to consciousness. Any healing brings them back.' },
  { condition: 'Critical HP (<25%)', priority: 3, action: 'Heal or protect. They\'re one hit from going down.' },
  { condition: 'Low HP (25-50%)', priority: 4, action: 'Heal if resources allow. Short rest will help.' },
  { condition: 'Moderate HP (50-75%)', priority: 5, action: 'Fine for now. Short rest or hit dice.' },
  { condition: 'Healthy (>75%)', priority: 6, action: 'No healing needed.' },
];

export function shouldShortRest(partyStatus) {
  const { avgHPPercent, anyDowned, hitDiceRemaining, totalHitDice, shortRestFeatures } = partyStatus;
  if (avgHPPercent < 50 && hitDiceRemaining > 0) return true;
  if (shortRestFeatures > 0) return true;
  if (anyDowned) return true;
  return false;
}

export function getTriagePriority(hpPercent, isDying, isStable) {
  if (isDying) return TRIAGE_PRIORITY[0];
  if (isStable && hpPercent === 0) return TRIAGE_PRIORITY[1];
  if (hpPercent < 25) return TRIAGE_PRIORITY[2];
  if (hpPercent < 50) return TRIAGE_PRIORITY[3];
  if (hpPercent < 75) return TRIAGE_PRIORITY[4];
  return TRIAGE_PRIORITY[5];
}
