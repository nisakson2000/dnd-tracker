/**
 * playerSpiritGuardiansGuide.js
 * Player Mode: Spirit Guardians spell optimization and tactical usage
 * Pure JS — no React dependencies.
 */

export const SPIRIT_GUARDIANS_RULES = {
  level: 3,
  castingTime: 'Action',
  range: 'Self (15ft radius)',
  duration: '10 minutes (concentration)',
  damage: '3d8 radiant/necrotic per failed WIS save',
  halfOnSave: true,
  trigger: 'When a creature enters the area for the first time on a turn or starts its turn there.',
  area: 'Moves with you. 15ft radius sphere centered on you.',
  allies: 'You designate which creatures are unaffected. Allies are safe.',
  difficult: 'Affected area is difficult terrain for enemies.',
  upcasting: '+1d8 damage per slot level above 3rd.',
};

export const SG_OPTIMIZATION = [
  { tip: 'Walk into enemies', detail: 'Spirit Guardians triggers when creatures enter the area OR start their turn there. Moving so YOUR aura envelops enemies counts as them "entering."', rating: 'S' },
  { tip: 'Stay in melee', detail: 'The aura is 15ft radius. You WANT enemies near you. This is a frontline spell.', rating: 'S' },
  { tip: 'Pair with Spiritual Weapon', detail: 'Spirit Guardians (action, concentration) + Spiritual Weapon (bonus action, no concentration). Both deal damage every turn.', rating: 'S' },
  { tip: 'Dodge action', detail: 'Once SG + Spiritual Weapon are up, your best action is often Dodge. Disadvantage on attacks vs you = protect concentration.', rating: 'A' },
  { tip: 'Difficult terrain effect', detail: 'Enemies in the area move at half speed. They can\'t easily escape. Combine with Sentinel to lock them down.', rating: 'A' },
  { tip: 'Upcast aggressively', detail: '4th level = 4d8 (avg 18). 5th level = 5d8 (avg 22.5). On 3+ enemies, this outdamages Fireball.', rating: 'A' },
  { tip: 'Protect concentration', detail: 'War Caster or Resilient (CON). If SG drops, you lose your action AND your slot. Devastating.', rating: 'S' },
];

export const SG_DAMAGE_MATH = {
  perTarget: [
    { level: 3, dice: '3d8', avg: 13.5, halfSave: 6.75 },
    { level: 4, dice: '4d8', avg: 18, halfSave: 9 },
    { level: 5, dice: '5d8', avg: 22.5, halfSave: 11.25 },
    { level: 6, dice: '6d8', avg: 27, halfSave: 13.5 },
    { level: 7, dice: '7d8', avg: 31.5, halfSave: 15.75 },
  ],
  comparison: {
    vsFireball: 'Fireball: 8d6 (28 avg) once. SG at 3rd: 3d8 (13.5) per enemy per TURN. After 2 turns vs 2+ enemies, SG has outdamaged Fireball.',
    duration: '10 minutes = 100 rounds. Even if it lasts only 3-4 rounds, it\'s better than most damage spells.',
    total: 'SG vs 3 enemies over 3 rounds: 3 × 3 × 13.5 = 121.5 avg damage from one 3rd-level slot.',
  },
};

export const SG_COMBOS = [
  { combo: 'SG + Spiritual Weapon', damage: '3d8 aura + 1d8+WIS weapon per turn', cost: '3rd + 2nd slot', note: 'The classic Cleric combo. Both persist. Maximum sustained damage.' },
  { combo: 'SG + Dodge', damage: 'SG only', defense: 'Disadvantage on all attacks vs you', note: 'Once damage is set up, go full defense. Protect concentration at all costs.' },
  { combo: 'SG + Shield of Faith', damage: 'SG', defense: '+2 AC', note: 'Wait — both are concentration. Can\'t do both. Choose SG every time.' },
  { combo: 'SG + Sentinel', damage: 'SG + OA', defense: 'Enemies can\'t escape your aura', note: 'Sentinel stops movement. Enemy stays in your SG aura. Extra OA damage.' },
  { combo: 'SG + Warding Bond', damage: 'SG', defense: 'Ally gets +1 AC and resistance', note: 'Warding Bond is NOT concentration. SG + Warding Bond is legal.' },
  { combo: 'SG + Grapple (STR Cleric)', damage: 'SG + you drag enemy through aura', defense: 'None', note: 'Grapple enemy, drag them around your aura. They re-enter each time.' },
];

export const SG_POSITIONING = {
  optimal: 'Wade into the enemy group. The more enemies in your 15ft radius, the better.',
  frontline: 'SG is a MELEE spell. You are the frontline. Don\'t cast this and hide in the back.',
  retreating: 'If you need to retreat, enemies take damage as they follow you through the aura.',
  chokepoint: 'Stand in a doorway. Enemies must enter your aura to reach your party. Perfect.',
};

export function sgDamage(slotLevel, enemyCount, rounds) {
  const dice = slotLevel;
  const avgPerHit = dice * 4.5;
  const totalPerRound = avgPerHit * enemyCount;
  return { perTarget: avgPerHit, perRound: totalPerRound, total: totalPerRound * rounds };
}

export function sgVsFireball(enemies, rounds) {
  const sgTotal = sgDamage(3, enemies, rounds).total;
  const fireballTotal = 28 * enemies; // 8d6 avg = 28
  return {
    sg: sgTotal,
    fireball: fireballTotal,
    sgWins: sgTotal > fireballTotal,
    breakEvenRounds: Math.ceil(fireballTotal / (13.5 * enemies)),
  };
}
