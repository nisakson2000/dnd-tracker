/**
 * playerActionEconWinGuide.js
 * Player Mode: Action economy mastery — why it matters and how to win it
 * Pure JS — no React dependencies.
 */

export const ACTION_ECONOMY_BASICS = {
  what: 'Each turn: 1 Action, 1 Bonus Action, 1 Reaction, Movement, Free Object Interaction.',
  why: 'The side with more actions per round usually wins.',
  key: 'Every unused action/BA/reaction is wasted potential.',
};

export const ACTION_MULTIPLIERS = [
  { method: 'Summon creatures', impact: '8 wolves = 8 extra attacks/round.', rating: 'S+', source: 'Conjure Animals, Animate Objects, Animate Dead' },
  { method: 'Action Surge', impact: 'Double your action for one turn.', rating: 'S+', source: 'Fighter' },
  { method: 'Spiritual Weapon', impact: 'BA attack every round. No concentration.', rating: 'S', source: 'Cleric' },
  { method: 'Haste', impact: '+1 action, +2 AC, double speed.', rating: 'S', source: 'Spell' },
  { method: 'Flurry of Blows', impact: '2 extra BA attacks.', rating: 'A+', source: 'Monk' },
  { method: 'Polearm Master', impact: 'BA attack + OA on approach.', rating: 'S', source: 'Feat' },
  { method: 'Sentinel', impact: 'OA stops movement + reaction attacks.', rating: 'S', source: 'Feat' },
];

export const ACTION_REDUCERS = [
  { method: 'Kill enemies', impact: 'Dead = 0 actions. Best reduction.', rating: 'S+' },
  { method: 'Incapacitate', impact: 'No actions or reactions.', rating: 'S+', source: 'Hypnotic Pattern, Sleep' },
  { method: 'Stun/Paralyze', impact: 'No actions + advantage + auto-fail saves.', rating: 'S+', source: 'Stunning Strike, Hold Person' },
  { method: 'Banishment', impact: 'Remove creature entirely.', rating: 'S', source: 'Banishment' },
  { method: 'Wall of Force', impact: 'Split encounter in half.', rating: 'S+', source: 'Wall of Force' },
  { method: 'Slow', impact: '-2 AC, half speed, limited actions.', rating: 'A+', source: 'Slow' },
];

export const COMMON_WASTES = [
  { waste: 'Dashing when you could attack', fix: 'Position before combat. Use ranged.' },
  { waste: 'Healing mid-combat (small amounts)', fix: 'Only heal at 0 HP. Healing Word BA.' },
  { waste: 'Unused bonus action', fix: 'Spiritual Weapon, Misty Step, class features.' },
  { waste: 'Unused reaction', fix: 'Shield, Counterspell, OA. Always plan your reaction.' },
  { waste: 'Attacking wrong target', fix: 'Focus fire. Kill one before spreading damage.' },
];

export const ACTION_ECON_TIPS = [
  'More actions = win. Summon, stack BA, use reactions.',
  'Remove enemy actions: kill, incapacitate, banish, stun.',
  'Never waste your bonus action.',
  'Plan your turn during others\' turns.',
  'Focus fire: killing one enemy removes ALL their actions.',
  'Wall of Force: split encounters. 6v4 becomes 3v4.',
  'Spiritual Weapon: free BA damage. No concentration.',
  'Conjure Animals: 8 wolves = economy bomb.',
  'Dead enemies deal 0 damage. Killing IS healing.',
  'Action Surge: use it every fight. Recovers on short rest.',
];
