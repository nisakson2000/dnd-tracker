/**
 * playerCombatMistakesList.js
 * Player Mode: Common combat mistakes and how to avoid them
 * Pure JS — no React dependencies.
 */

export const COMMON_MISTAKES = [
  { mistake: 'Splitting damage across multiple enemies', fix: 'Focus fire! Dead enemies deal zero damage. One dead enemy is better than three wounded ones.', severity: 'Critical' },
  { mistake: 'Not using your bonus action', fix: 'Every turn, check: do I have a bonus action? Healing Word, Spiritual Weapon, Hex, Cunning Action.', severity: 'High' },
  { mistake: 'Forgetting your reaction', fix: 'Plan your reaction at the START of each round. OA, Shield, Counterspell, Absorb Elements.', severity: 'High' },
  { mistake: 'Over-healing instead of killing', fix: 'In D&D, damage prevention > healing. Kill the source of damage first.', severity: 'High' },
  { mistake: 'Not taking cover', fix: 'Half cover (+2 AC) is free. Step behind a tree, crouch behind a wall.', severity: 'Medium' },
  { mistake: 'Wasting Action Surge/high-level slots early', fix: 'Scout the fight first. Save your best stuff for when you know the real threat.', severity: 'Medium' },
  { mistake: 'Not communicating targets', fix: 'Call out who you\'re attacking. "I\'m focusing the mage." Coordinate with party.', severity: 'Medium' },
  { mistake: 'Standing next to the squishy caster', fix: 'Spread out! AoE will hit both of you. Give casters space.', severity: 'Medium' },
  { mistake: 'Casting True Strike', fix: 'Just attack instead. True Strike wastes an action for advantage on ONE attack next turn.', severity: 'High' },
  { mistake: 'Not moving during combat', fix: 'Movement is free! Reposition for advantage, cover, or better targeting.', severity: 'Medium' },
  { mistake: 'Healing at full HP "just in case"', fix: 'Don\'t pre-heal. Wait until someone actually takes damage. Healing Word exists for emergencies.', severity: 'Low' },
  { mistake: 'Forgetting concentration', fix: 'Mark your concentration spell clearly. Every time you take damage, roll CON save DC max(10, damage/2).', severity: 'High' },
  { mistake: 'Not using the Help action', fix: 'If you have nothing better, Help gives an ally advantage. Familiars can do this too.', severity: 'Low' },
  { mistake: 'Chasing enemies instead of holding position', fix: 'Let them come to you. Readied actions and Sentinel punish enemies who approach.', severity: 'Medium' },
  { mistake: 'Using all spell slots before short rest', fix: 'Short rest recovers some features. Plan spell usage across the adventuring day.', severity: 'Medium' },
];

export const NEWBIE_TIPS = [
  'Roll attack AND damage dice at the same time to speed up play.',
  'Know what your character does BEFORE your turn starts.',
  'Write down your attack bonus, save DC, and AC somewhere visible.',
  'Ask "Can I do [X]?" — the answer is often yes in D&D.',
  'It\'s okay to make mistakes. Everyone does. That\'s how you learn.',
  'Read your class features between sessions. Know what you can do.',
  'The DM isn\'t your enemy. They want you to have fun too.',
];

export function getMistakesBySeversity(severity) {
  return COMMON_MISTAKES.filter(m => m.severity === severity);
}

export function getRandomMistakeTip() {
  return COMMON_MISTAKES[Math.floor(Math.random() * COMMON_MISTAKES.length)];
}
