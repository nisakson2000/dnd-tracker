/**
 * playerRevivalOptionsGuide.js
 * Player Mode: Death and resurrection — all revival options ranked
 * Pure JS — no React dependencies.
 */

export const REVIVAL_SPELLS = [
  { spell: 'Revivify', level: 3, cost: '300gp diamond', window: '1 minute', rating: 'S+', note: 'Best rez. 1 action. 1 min window. Always carry a diamond.' },
  { spell: 'Raise Dead', level: 5, cost: '500gp diamond', window: '10 days', rating: 'S', note: 'Longer window. -4 penalty for 4 days.' },
  { spell: 'Resurrection', level: 7, cost: '1,000gp diamond', window: '100 years', rating: 'S', note: 'Restores missing parts. No penalties.' },
  { spell: 'True Resurrection', level: 9, cost: '25,000gp', window: '200 years', rating: 'S+', note: 'Creates new body if needed.' },
  { spell: 'Reincarnate', level: 5, cost: '1,000gp oils', window: '10 days', rating: 'A+', note: 'Random new race. No diamond.' },
  { spell: 'Clone', level: 8, cost: '1,000gp+', window: 'After death', rating: 'S+', note: 'Backup body. Soul transfers on death.' },
];

export const REVIVAL_TIPS = [
  'Revivify: 1-minute window. Always prepare. Always carry a 300gp diamond.',
  'Gentle Repose extends Revivify window to 10 days. Cast immediately on death.',
  'Zealot Barbarian: free resurrections (no component cost).',
  'Clone: grow a backup before you need it. Best insurance.',
  'Soul must be free and willing. Can\'t rez someone who doesn\'t want to return.',
  'Always carry a 300gp diamond. It\'s the resurrection tax.',
];
