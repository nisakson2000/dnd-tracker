/**
 * playerCombatPrioritizationGuide.js
 * Player Mode: Target prioritization — who to attack first and why
 * Pure JS — no React dependencies.
 */

export const TARGET_PRIORITY = [
  { priority: 1, target: 'Enemy Healer/Buffer', reason: 'They undo your damage and strengthen others. Kill first.', note: 'Enemy Cleric casting Healing Word = your DPR wasted.' },
  { priority: 2, target: 'Enemy Controller', reason: 'Hypnotic Pattern, Hold Person = party wipe. Remove them.', note: 'One control spell removes multiple PCs from the fight.' },
  { priority: 3, target: 'Concentrating Caster', reason: 'Break their concentration = end their strongest effect.', note: 'Magic Missile: guaranteed damage → guaranteed concentration check.' },
  { priority: 4, target: 'Highest DPR enemy', reason: 'The enemy dealing most damage. Eliminate the threat.', note: 'Dead enemies deal no damage. Best healing is killing.' },
  { priority: 5, target: 'Low HP enemies', reason: 'Remove action economy. Dead enemies = fewer attacks.', note: 'Reducing enemy count > reducing enemy HP.' },
  { priority: 6, target: 'Tanks/Brutes', reason: 'Save for last. They\'re hard to kill and less dangerous than casters.', note: 'Control them instead of trying to DPS through high HP.' },
];

export const FOCUS_FIRE = {
  concept: 'Entire party attacks one target until dead. Then next.',
  why: 'A dead enemy deals 0 damage. A wounded enemy deals full damage.',
  math: '4 PCs doing 10 damage each: kill 1 enemy (40 HP) per round. Spreading damage: 0 enemies killed.',
  exception: 'AoE spells can damage multiple targets efficiently.',
};

export const CONCENTRATION_BREAKING = {
  best: [
    { method: 'Magic Missile', note: '3 darts = 3 concentration saves. Each hits guaranteed.' },
    { method: 'Scorching Ray', note: '3 rays = 3 saves if all hit.' },
    { method: 'Multi-attack', note: 'More hits = more saves. Even small damage forces DC 10.' },
    { method: 'Eldritch Blast (4 beams)', note: '4 beams at L17 = 4 concentration saves.' },
  ],
  rule: 'CON save: DC 10 or half damage taken (whichever is higher).',
  note: 'Multiple small hits > one big hit for breaking concentration.',
};

export const WHEN_TO_CONTROL_VS_KILL = [
  { situation: 'Few strong enemies', tactic: 'Control (Banishment, Polymorph). Remove one → fight the rest.', rating: 'S+' },
  { situation: 'Many weak enemies', tactic: 'AoE damage (Fireball). Kill multiple at once.', rating: 'S+' },
  { situation: 'One boss + minions', tactic: 'AoE minions + single-target boss. OR wall spell to split.', rating: 'S' },
  { situation: 'Enemy caster', tactic: 'Counterspell their big spells. Focus fire to kill.', rating: 'S+' },
  { situation: 'Overwhelming odds', tactic: 'Control to disable groups (Hypnotic Pattern). Then kill one by one.', rating: 'S+' },
];

export const PRIORITY_TIPS = [
  'Focus fire: whole party on one target. Dead enemies = 0 DPR.',
  'Kill the healer first. They undo all your damage.',
  'Break concentration: Magic Missile = 3 guaranteed saves.',
  'Multiple small hits > one big hit for concentration breaks.',
  'Control > damage when outnumbered. Hypnotic Pattern first.',
  'AoE for groups. Single-target for bosses.',
  'Enemy casters die fast (low HP/AC). Rush them.',
  'Don\'t waste attacks on tanks. Control or bypass them.',
  'Banishment on biggest threat. Fight the rest 4v(X-1).',
  'Dead enemies deal no damage. Best healing = killing.',
];
