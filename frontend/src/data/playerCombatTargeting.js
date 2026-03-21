/**
 * playerCombatTargeting.js
 * Player Mode: Target prioritization and focus fire strategy
 * Pure JS — no React dependencies.
 */

export const TARGET_PRIORITY = [
  { priority: 1, target: 'Enemy Healers/Buffers', color: '#f44336', reason: 'They undo your damage and make other enemies stronger. Kill them first.', examples: ['Enemy Cleric', 'Mage casting buffs', 'Creature with healing abilities'] },
  { priority: 2, target: 'Enemy Casters', color: '#ff5722', reason: 'Spells are the most dangerous thing in D&D. Remove spell access.', examples: ['Wizards', 'Sorcerers', 'Liches', 'Beholders'] },
  { priority: 3, target: 'Low HP / Nearly Dead', color: '#ff9800', reason: 'Dead enemies deal 0 damage. Finishing off a wounded enemy is efficient.', examples: ['Anything below 25% HP'] },
  { priority: 4, target: 'High Damage Dealers', color: '#ffc107', reason: 'If they hit hard, they need to be removed before they output more damage.', examples: ['Giants', 'Assassins', 'Berserkers'] },
  { priority: 5, target: 'Minions (with AoE)', color: '#8bc34a', reason: 'Clear minions with Fireball/AoE to reduce enemy action economy.', examples: ['Goblin hordes', 'Skeleton groups', 'Summoned creatures'] },
  { priority: 6, target: 'Tanks/Brutes', color: '#607d8b', reason: 'High HP enemies. Focus fire as a group — don\'t spread damage.', examples: ['Trolls', 'Ogres', 'Constructs'] },
  { priority: 7, target: 'Boss (if alone)', color: '#9c27b0', reason: 'If the boss has no minions, focus all fire on it. Action economy favors you.', examples: ['Solo boss encounters'] },
];

export const FOCUS_FIRE_RULES = [
  'EVERYONE attacks the SAME target unless there\'s a good reason not to.',
  'Splitting damage across multiple enemies means none of them die quickly.',
  'A dead enemy is better than three wounded enemies (they all deal full damage).',
  'Exception: If you can one-shot a different target, do it.',
  'Exception: AoE should hit as many enemies as possible, even if splitting damage.',
  'Communicate targets: "Everyone focus the mage on the left!"',
];

export const WHEN_NOT_TO_FOCUS = [
  { situation: 'Enemy has allies nearby who can heal/buff it', override: 'Kill the healer/buffer first, then refocus.' },
  { situation: 'You have a powerful AoE ready', override: 'AoE the group. Efficiency > focus fire here.' },
  { situation: 'A different enemy is about to do something catastrophic', override: 'Counterspell/stun/kill the immediate threat.' },
  { situation: 'The target has very high AC and you keep missing', override: 'Switch to saves-based damage or a softer target.' },
  { situation: 'Enemy is immune/resistant to your damage type', override: 'Let someone else handle it. Attack what you can hurt.' },
];

export function suggestTarget(enemies) {
  if (!enemies || enemies.length === 0) return null;
  // Sort by priority (healers > casters > low HP > high damage)
  return [...enemies].sort((a, b) => {
    const pa = TARGET_PRIORITY.find(t => t.target.toLowerCase().includes((a.type || '').toLowerCase()));
    const pb = TARGET_PRIORITY.find(t => t.target.toLowerCase().includes((b.type || '').toLowerCase()));
    return (pa?.priority || 99) - (pb?.priority || 99);
  })[0];
}
