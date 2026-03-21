/**
 * playerSneakAttackAdvanced.js
 * Player Mode: Advanced Sneak Attack rules and optimization
 * Pure JS — no React dependencies.
 */

export const SNEAK_ATTACK_RULES = {
  frequency: 'Once per TURN (not once per round). You can SA on your turn AND on a readied attack.',
  weapons: 'Finesse OR ranged weapons only. You can use STR with a finesse weapon and still SA.',
  conditions: [
    'Advantage on the attack roll, OR',
    'An ally of yours is within 5ft of the target AND you don\'t have disadvantage.',
  ],
  note: 'You DON\'T need to use DEX. A STR-based Rogue with a rapier can Sneak Attack with STR.',
  stacking: 'Sneak Attack damage is NOT doubled by crits for the full dice — all SA dice ARE doubled on crits.',
};

export const SNEAK_ATTACK_DAMAGE = [
  { level: 1, dice: '1d6', avg: 3.5 },
  { level: 3, dice: '2d6', avg: 7 },
  { level: 5, dice: '3d6', avg: 10.5 },
  { level: 7, dice: '4d6', avg: 14 },
  { level: 9, dice: '5d6', avg: 17.5 },
  { level: 11, dice: '6d6', avg: 21 },
  { level: 13, dice: '7d6', avg: 24.5 },
  { level: 15, dice: '8d6', avg: 28 },
  { level: 17, dice: '9d6', avg: 31.5 },
  { level: 19, dice: '10d6', avg: 35 },
];

export const SA_GUARANTEE_METHODS = [
  { method: 'Ally within 5ft of target', reliability: 'Very High', detail: 'Most common. Position an ally adjacent. No disadvantage needed.' },
  { method: 'Cunning Action Hide', reliability: 'High', detail: 'Bonus action Hide → attack from stealth = advantage. Works every turn.' },
  { method: 'Swashbuckler: Rakish Audacity', reliability: 'Very High', detail: 'SA if you and target are the only creatures within 5ft. No ally needed.' },
  { method: 'Find Familiar (Owl)', reliability: 'High', detail: 'Owl uses Help action (Flyby = no OA) → advantage on your next attack.' },
  { method: 'Faerie Fire / Greater Invisibility', reliability: 'Very High', detail: 'Advantage from spell effects. Reliable if maintained.' },
  { method: 'Prone target + melee', reliability: 'Situational', detail: 'Advantage on melee attacks vs prone. Shove + attack combo.' },
  { method: 'Flanking (optional rule)', reliability: 'High', detail: 'If using flanking rules, position opposite an ally.' },
];

export const OFF_TURN_SNEAK_ATTACK = {
  method: 'Ready Action on your turn. Set trigger: "When [ally] attacks [target]."',
  result: 'SA on your readied attack (different TURN) + SA on your normal turn = 2× SA per round.',
  cost: 'Uses your reaction. No Uncanny Dodge that round.',
  interaction: 'Commander\'s Strike (Battle Master) can also give you an off-turn attack with SA.',
  sentinel: 'Sentinel OA is also a different turn — can Sneak Attack on the OA.',
};

export function getSneakAttackDice(rogueLevel) {
  return Math.ceil(rogueLevel / 2);
}

export function calculateSneakAttackDamage(rogueLevel, isCrit) {
  const dice = getSneakAttackDice(rogueLevel);
  const totalDice = isCrit ? dice * 2 : dice;
  return {
    dice: `${totalDice}d6`,
    average: totalDice * 3.5,
    minimum: totalDice,
    maximum: totalDice * 6,
    isCrit,
  };
}
