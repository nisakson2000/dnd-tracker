/**
 * playerLayOnHandsGuide.js
 * Player Mode: Paladin Lay on Hands rules, optimization, and disease/poison removal
 * Pure JS — no React dependencies.
 */

export const LAY_ON_HANDS_RULES = {
  pool: 'Paladin level × 5 HP',
  action: 'Action. Touch range.',
  minimum: 'Can spend as little as 1 HP from the pool.',
  disease: '5 HP from pool to cure one disease or neutralize one poison (doesn\'t heal, just cures).',
  undead: 'No effect on undead or constructs.',
  restore: 'Pool restores on long rest.',
  self: 'Can use on yourself.',
};

export const LOH_POOL_BY_LEVEL = [
  { level: 2, pool: 10 },
  { level: 5, pool: 25 },
  { level: 8, pool: 40 },
  { level: 10, pool: 50 },
  { level: 13, pool: 65 },
  { level: 15, pool: 75 },
  { level: 18, pool: 90 },
  { level: 20, pool: 100 },
];

export const LOH_OPTIMIZATION = [
  { tip: 'Use 1 HP to pick up downed allies', detail: 'A downed ally at 1 HP is infinitely better than at 0 HP. Spend 1 HP, not 10. They can act on their turn.', priority: 1 },
  { tip: 'Don\'t waste pool on full heals', detail: 'Lay on Hands is best for emergencies, not topping off. Use Hit Dice during short rests for general healing.', priority: 2 },
  { tip: 'Disease/poison removal is 5 HP each', detail: 'If an ally is poisoned, 5 HP from pool cures it. No Lesser Restoration needed. Save spell slots.', priority: 3 },
  { tip: 'Save some for emergency revival', detail: 'Always keep at least 1-5 HP in pool for picking up a downed ally. Touch range means you need to be close.', priority: 4 },
  { tip: 'It\'s an ACTION', detail: 'Using LoH costs your action. In combat, weigh healing vs attacking. Often attacking (killing the enemy) is better prevention.', priority: 5 },
  { tip: 'Combine with Aura of Protection', detail: 'Your allies within 10ft already have +CHA to saves. LoH is for when they still fail despite the aura.', priority: 6 },
];

export const LOH_VS_SPELL_HEALING = [
  { comparison: 'LoH 1 HP vs Healing Word 1d4+3', verdict: 'LoH: 1 HP pick-up is the most efficient use. But Healing Word is a bonus action + 60ft range.', winner: 'Healing Word (action economy + range)' },
  { comparison: 'LoH 10 HP vs Cure Wounds 1d8+3', verdict: 'LoH: guaranteed 10 HP. Cure Wounds: average 7.5. LoH is more reliable but costs action.', winner: 'LoH (guaranteed amount)' },
  { comparison: 'LoH cure poison vs Protection from Poison', verdict: 'LoH: costs 5 HP from pool, no spell slot. Protection: costs 2nd level slot + gives resistance.', winner: 'LoH (saves spell slot)' },
  { comparison: 'LoH cure disease vs Lesser Restoration', verdict: 'LoH: costs 5 HP from pool. Lesser Restoration: costs 2nd level slot. LoH saves the slot.', winner: 'LoH (saves spell slot)' },
];

export function getPool(paladinLevel) {
  return paladinLevel * 5;
}

export function suggestHealing(currentPool, allyCurrentHP, allyMaxHP, allyIsDown) {
  if (allyIsDown) return { heal: 1, reason: '1 HP to get them conscious. Most efficient use.' };
  const deficit = allyMaxHP - allyCurrentHP;
  if (deficit <= 0) return { heal: 0, reason: 'Ally is at full HP.' };
  const suggested = Math.min(currentPool, Math.min(deficit, Math.ceil(allyMaxHP * 0.3)));
  return { heal: suggested, reason: `Heal ${suggested} HP. Save the rest of the pool for emergencies.` };
}

export function canCureCondition(currentPool, condition) {
  if (['Poisoned', 'Diseased'].includes(condition)) {
    return currentPool >= 5 ? { canCure: true, cost: 5 } : { canCure: false, cost: 5, reason: 'Not enough HP in pool (need 5).' };
  }
  return { canCure: false, reason: 'Lay on Hands only cures diseases and poisons.' };
}
