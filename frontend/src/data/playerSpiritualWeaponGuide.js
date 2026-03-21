/**
 * playerSpiritualWeaponGuide.js
 * Player Mode: Spiritual Weapon optimization — the Cleric's best non-concentration spell
 * Pure JS — no React dependencies.
 */

export const SPIRITUAL_WEAPON_BASICS = {
  spell: 'Spiritual Weapon',
  level: 2,
  school: 'Evocation',
  castTime: '1 bonus action',
  range: '60ft',
  duration: '1 minute (no concentration)',
  classes: ['Cleric'],
  note: 'BA to cast, BA to attack each turn. No concentration. Stacks with Spirit Guardians perfectly. The second-best Cleric spell after Spirit Guardians.',
};

export const SPIRITUAL_WEAPON_MECHANICS = {
  attack: 'Melee spell attack (WIS mod + PB).',
  damage: '1d8 + WIS mod force damage.',
  scaling: 'Upcast: +1d8 per two slot levels above 2nd (L4: 2d8, L6: 3d8, etc.).',
  movement: 'BA: move weapon 20ft + make attack.',
  duration: '1 minute. No concentration.',
  note: 'Cast turn 1 → BA attack every subsequent turn. No concentration means it stacks with everything.',
};

export const SPIRITUAL_WEAPON_DAMAGE_TABLE = [
  { slot: 2, dice: '1d8', avgPerHit: 4.5, withWIS5: 9.5, note: 'Base. 9.5 per BA. Good for L3-4.' },
  { slot: 4, dice: '2d8', avgPerHit: 9, withWIS5: 14, note: 'Good upcast. L7-8.' },
  { slot: 6, dice: '3d8', avgPerHit: 13.5, withWIS5: 18.5, note: 'Strong upcast. L11-12.' },
  { slot: 8, dice: '4d8', avgPerHit: 18, withWIS5: 23, note: 'High upcast. L15-16.' },
];

export const SPIRITUAL_WEAPON_COMBOS = [
  { combo: 'Spirit Guardians + Spiritual Weapon', detail: 'THE Cleric combo. SG (concentration AoE) + SW (no concentration BA damage). Both running simultaneously. Cast SG turn 1, SW turn 2.', rating: 'S' },
  { combo: 'SW + Dodge action', detail: 'Cast SW → Dodge each turn. BA: SW attack. Action: Dodge. Hard to hit, still dealing damage.', rating: 'A' },
  { combo: 'SW + cantrip', detail: 'Action: Toll the Dead/Sacred Flame. BA: SW attack. Two damage sources per turn with no spell slots (after initial cast).', rating: 'A' },
  { combo: 'SW + healing', detail: 'Action: Healing Word (BA) conflicts with SW. Use Cure Wounds (action) instead when healing + SW.', rating: 'B' },
];

export const SPIRITUAL_WEAPON_TACTICS = [
  { tactic: 'Cast early', detail: 'Cast turn 1 or 2. Duration is 1 minute (10 rounds). Every turn without SW up is wasted damage.', rating: 'S' },
  { tactic: 'Don\'t upcast too much', detail: 'L2 slot for SW, L3+ for Spirit Guardians. SW at L2 is efficient. Save high slots for SG/Revivify.', rating: 'A' },
  { tactic: 'Position for 20ft move', detail: 'SW moves 20ft/turn. Position it centrally so it can reach any enemy. Don\'t chase distant targets.', rating: 'A' },
  { tactic: 'Target low AC', detail: 'SW makes a spell attack (d20 + WIS + PB). Target enemies with lowest AC for consistent damage.', rating: 'A' },
  { tactic: 'No concentration tax', detail: 'SW doesn\'t require concentration. It\'s pure bonus action damage. No risk of losing it.', rating: 'S' },
];

export const SPIRITUAL_WEAPON_EFFICIENCY = {
  overTenRounds: {
    L2: { totalDamage: '10 × (1d8+5) = 95 avg', slotCost: 'L2', dpsTurn: 9.5 },
    L4: { totalDamage: '10 × (2d8+5) = 140 avg', slotCost: 'L4', dpsTurn: 14 },
  },
  note: 'At L2: 95 total damage from one L2 slot over 10 rounds. Best damage-per-slot-level in the game.',
};

export function spiritualWeaponDPR(slotLevel, wisMod, hitChance = 0.65) {
  const damageDice = Math.floor(slotLevel / 2);
  const avgDamage = damageDice * 4.5 + wisMod;
  return { perHit: avgDamage, expectedPerTurn: Math.round(avgDamage * hitChance * 10) / 10 };
}

export function swVsHealingWordConflict() {
  return {
    problem: 'Both Spiritual Weapon and Healing Word are bonus actions. Can\'t use both on same turn.',
    solution: 'Cast SW early. When healing needed: use Cure Wounds (action) + SW (BA). Or drop SW for Healing Word in emergencies.',
    note: 'This is the main SW limitation. Plan your bonus actions carefully.',
  };
}
