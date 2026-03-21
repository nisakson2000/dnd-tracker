/**
 * playerLongRestChecklist.js
 * Player Mode Improvements 191-200 (extended): Detailed rest checklists
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// SHORT REST CHECKLIST
// ---------------------------------------------------------------------------

export const SHORT_REST_CHECKLIST = [
  { id: 'sr_hit_dice', label: 'Spend Hit Dice for healing', description: 'Roll hit dice + CON mod to regain HP. Choose how many to spend.', optional: true },
  { id: 'sr_second_wind', label: 'Second Wind (Fighter)', description: 'Recharges on short rest. 1d10 + fighter level HP.', classOnly: 'Fighter' },
  { id: 'sr_action_surge', label: 'Action Surge (Fighter)', description: 'Recharges on short rest.', classOnly: 'Fighter' },
  { id: 'sr_ki', label: 'Ki Points (Monk)', description: 'All expended ki points are regained.', classOnly: 'Monk' },
  { id: 'sr_bardic', label: 'Bardic Inspiration (Bard 5+)', description: 'Recharges on short rest at level 5+.', classOnly: 'Bard' },
  { id: 'sr_channel', label: 'Channel Divinity (Cleric/Paladin)', description: 'Recharges on short rest.', classOnly: 'Cleric' },
  { id: 'sr_wild_shape', label: 'Wild Shape (Druid)', description: 'Recharges on short rest.', classOnly: 'Druid' },
  { id: 'sr_warlock_slots', label: 'Pact Magic Slots (Warlock)', description: 'All Warlock spell slots recharge on short rest.', classOnly: 'Warlock' },
  { id: 'sr_superiority', label: 'Superiority Dice (Battle Master)', description: 'All superiority dice recharge on short rest.', classOnly: 'Fighter' },
  { id: 'sr_arcane_recovery', label: 'Arcane Recovery (Wizard)', description: 'Once per day, during a short rest, recover spell slot levels up to half wizard level (rounded up).', classOnly: 'Wizard' },
];

// ---------------------------------------------------------------------------
// LONG REST CHECKLIST
// ---------------------------------------------------------------------------

export const LONG_REST_CHECKLIST = [
  { id: 'lr_hp', label: 'Regain all hit points', description: 'Current HP is restored to maximum.', auto: true },
  { id: 'lr_spell_slots', label: 'Regain all spell slots', description: 'All expended spell slots are restored.', auto: true },
  { id: 'lr_hit_dice', label: 'Regain hit dice (half total, min 1)', description: 'Recover half your total hit dice (rounded down, minimum 1).', auto: true },
  { id: 'lr_exhaustion', label: 'Remove 1 exhaustion level', description: 'If you have sufficient food and water, remove 1 level of exhaustion.', auto: true },
  { id: 'lr_class_features', label: 'Reset all long-rest features', description: 'Rage, Lay on Hands, Sorcery Points, Wild Shape, etc.', auto: true },
  { id: 'lr_temp_hp', label: 'Lose remaining temp HP', description: 'Temporary hit points are lost after a long rest (unless feature says otherwise).', auto: true },
  { id: 'lr_death_saves', label: 'Reset death saves', description: 'All death save successes and failures are reset.', auto: true },
  { id: 'lr_prepare_spells', label: 'Prepare spells for tomorrow', description: 'Clerics, Druids, Paladins, and Wizards can change prepared spells.', optional: true },
  { id: 'lr_attunement', label: 'Attune/unattune magic items', description: 'You can change attunement during a long rest.', optional: true },
  { id: 'lr_watch', label: 'Set watch order', description: 'Decide who takes each watch shift. Combat during a watch may interrupt the rest.', optional: true },
];

// ---------------------------------------------------------------------------
// REST HELPER
// ---------------------------------------------------------------------------

/**
 * Get applicable checklist items for a class.
 */
export function getRestChecklist(restType, className) {
  const list = restType === 'long' ? LONG_REST_CHECKLIST : SHORT_REST_CHECKLIST;
  return list.filter(item => {
    if (!item.classOnly) return true;
    return (className || '').toLowerCase().includes(item.classOnly.toLowerCase());
  });
}

/**
 * Calculate hit dice recovery on long rest.
 */
export function calculateHitDiceRecovery(totalHitDice, currentHitDice) {
  const recovery = Math.max(1, Math.floor(totalHitDice / 2));
  const newTotal = Math.min(totalHitDice, currentHitDice + recovery);
  return { recovery, newTotal, maxHitDice: totalHitDice };
}
