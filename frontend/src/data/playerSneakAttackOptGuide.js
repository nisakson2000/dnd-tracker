/**
 * playerSneakAttackOptGuide.js
 * Player Mode: Sneak Attack optimization — get it every round
 * Pure JS — no React dependencies.
 */

export const SNEAK_ATTACK_RULES = {
  damage: '1d6 per 2 Rogue levels (round up). 1d6 at L1, 10d6 at L19.',
  frequency: 'Once per TURN (not once per round). Can trigger on OAs during other turns.',
  requirements: [
    'Must use a finesse or ranged weapon.',
    'Must have advantage on the attack roll, OR',
    'An ally must be within 5ft of the target (and you don\'t have disadvantage).',
  ],
  note: 'Once per TURN means you can Sneak Attack on your turn AND on an OA during someone else\'s turn.',
};

export const GUARANTEE_SNEAK_ATTACK = [
  { method: 'Ally adjacent to target', detail: 'Any ally within 5ft of your target. Most common trigger. Just attack enemies your friends are fighting.', reliability: 'S' },
  { method: 'Find Familiar (Help action)', detail: 'Owl flies in, uses Help, gives you advantage. Owl has Flyby (no OA). Permanent advantage.', reliability: 'S' },
  { method: 'Faerie Fire', detail: 'Advantage on attacks against outlined targets. Party-wide benefit.', reliability: 'A' },
  { method: 'Steady Aim (BA, Tasha\'s)', detail: 'BA to give yourself advantage on next attack. Can\'t move that turn.', reliability: 'A' },
  { method: 'Flanking (optional rule)', detail: 'If your table uses flanking: position opposite an ally for free advantage.', reliability: 'S (if available)' },
  { method: 'Hide (BA, Cunning Action)', detail: 'Hide as BA → attack from hidden = advantage. Requires cover/concealment.', reliability: 'B' },
  { method: 'Two-Weapon Fighting', detail: 'Miss with first attack? Off-hand gives a second chance to land SA.', reliability: 'A' },
  { method: 'Booming Blade', detail: 'Doesn\'t directly help SA but adds damage. If you have advantage, BB + SA is huge.', reliability: 'B' },
  { method: 'Swashbuckler L3', detail: 'Don\'t need advantage or ally if you\'re within 5ft of exactly one enemy. Built-in SA.', reliability: 'S' },
  { method: 'Insightful Fighting (Inquisitive)', detail: 'Bonus action Insight vs Deception. On success: SA for 1 minute without advantage.', reliability: 'A' },
];

export const SNEAK_ATTACK_ON_OA = {
  rule: 'Sneak Attack is once per TURN. Your turn and other creatures\' turns are different turns.',
  result: 'If you Sneak Attack on your turn and then get an OA on an enemy turn: you can Sneak Attack again.',
  triggers: [
    'Sentinel feat: enemy attacks ally → you get reaction attack.',
    'Commander\'s Strike (Battle Master): ally gives you their reaction attack.',
    'War Caster OA: cast a spell as OA (Booming Blade + SA).',
    'Dissonant Whispers: enemy flees → OA → SA again.',
    'Normal OA: enemy moves away from you.',
  ],
  note: 'Getting SA twice per round is one of the strongest Rogue optimization targets.',
};

export const SNEAK_ATTACK_SCALING = [
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

export const SNEAK_ATTACK_CRIT = {
  rule: 'All Sneak Attack dice are doubled on a crit.',
  example: 'L9 Rogue crits: 10d6 SA + 2d8 rapier = 12 dice total. Average ~42 + 9 = 51 damage on one attack.',
  maximizing: [
    'Assassinate (Assassin): auto-crit on surprised creatures. Setup surprise for mega-burst.',
    'Elven Accuracy: 3d20 on advantage = ~14% crit chance (vs 5% normal). More crits = more SA crits.',
    'Half-Orc: Savage Attacks adds 1 weapon die on crit. Less impactful for Rogues (only 1 extra d8).',
  ],
};

export function sneakAttackDamage(rogueLevel, isCrit) {
  const dice = Math.ceil(rogueLevel / 2);
  const totalDice = isCrit ? dice * 2 : dice;
  const avg = totalDice * 3.5;
  return { dice: `${totalDice}d6`, avg: Math.round(avg), note: `L${rogueLevel} SA${isCrit ? ' (CRIT)' : ''}: ${totalDice}d6 (${Math.round(avg)} avg)` };
}
