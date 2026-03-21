/**
 * playerFocusFireTacticsGuide.js
 * Player Mode: Focus fire and target priority in combat
 * Pure JS — no React dependencies.
 */

export const FOCUS_FIRE_PHILOSOPHY = {
  concept: 'Kill one enemy fast rather than spreading damage across many.',
  why: 'A dead enemy deals 0 DPR. An enemy at 1 HP deals the same DPR as full HP. Remove threats completely.',
  goldRule: 'Reduce enemy action economy as fast as possible. Every enemy removed = one fewer attack per round.',
};

export const TARGET_PRIORITY = [
  { priority: 1, target: 'Enemy spellcasters', why: 'AoE, control, healing, buffs. One Fireball can TPK. Remove casters first.', rating: 'S', note: 'Usually low HP, low AC. Squishy targets that deal massive damage.' },
  { priority: 2, target: 'Healers/support', why: 'Enemy healing undoes your damage. Kill the healer before grinding down the tank.', rating: 'S', note: 'If the enemy has a healer, they\'re target #1 or #2.' },
  { priority: 3, target: 'Ranged attackers', why: 'Hard to reach, consistent damage, often have multiattack.', rating: 'A+', note: 'Archers, crossbowmen, ranged monsters.' },
  { priority: 4, target: 'Summoner/minion master', why: 'Kill the source, not the summons. Summoner dies = summons disappear.', rating: 'A+', note: 'Don\'t waste time on minions if you can reach the summoner.' },
  { priority: 5, target: 'Lowest HP enemy', why: 'If an enemy is nearly dead, finish it off. One fewer action in the economy.', rating: 'A', note: 'Opportunity kills. Don\'t let wounded enemies survive.' },
  { priority: 6, target: 'High-damage melee', why: 'Dangerous but you can kite them, control them, or tank them more easily than casters.', rating: 'B+', note: 'Use control spells instead of raw damage if possible.' },
  { priority: 7, target: 'Tanks/brutes', why: 'High HP, often low intelligence. Control or ignore. Kill last.', rating: 'B', note: 'Unless they\'re the only threat. Don\'t waste burst on HP sponges.' },
];

export const FOCUS_FIRE_TACTICS = [
  { tactic: 'Call targets', detail: 'Verbally coordinate: "Focus the mage!" Entire party attacks the same target.', rating: 'S', note: 'Real-world coordination. Table talk is legal in most games.' },
  { tactic: 'Alpha strike', detail: 'Dump maximum damage on priority target in round 1 before they act.', rating: 'S', note: 'Casters who die before their turn never cast Fireball.' },
  { tactic: 'Set up advantage', detail: 'Faerie Fire, Guiding Bolt, Knock Prone — then everyone attacks with advantage.', rating: 'A+', note: 'One player sets up, everyone else benefits.' },
  { tactic: 'Grapple + focus', detail: 'Grapple priority target → party unloads. They can\'t move, easy to surround.', rating: 'A', note: 'Works against casters and ranged threats.' },
  { tactic: 'Control everything else', detail: 'Hypnotic Pattern the group → focus the one that saved → then pick off incapacitated enemies.', rating: 'S', note: 'AoE control + single-target focus = efficient combat.' },
];

export const WHEN_NOT_TO_FOCUS = [
  'Swarm encounters: 20 goblins. AoE (Fireball, Spirit Guardians) is better than single-target.',
  'When the biggest threat is already controlled (Banished, Stunned, Hypnotized).',
  'When an opportunity kill is available (enemy at 2 HP near an ally).',
  'When the tank needs immediate help (heal/assist > dealing damage).',
  'When you literally can\'t reach the priority target (ranged, flying, behind cover).',
];

export const ACTION_ECONOMY_MATH = {
  example: '4 enemies, each deals 10 DPR = 40 DPR to party.',
  scenario1: {
    name: 'Spread damage',
    result: 'All 4 enemies at 50% HP after round 1. Still 40 DPR to party.',
    total: '40 DPR incoming',
  },
  scenario2: {
    name: 'Focus fire',
    result: '2 enemies dead after round 1. 2 remaining = 20 DPR to party.',
    total: '20 DPR incoming',
  },
  verdict: 'Focus fire reduced incoming damage by 50%. Spread damage reduced it by 0%.',
};

export const MARTIAL_FOCUS_TIPS = [
  'Fighters: dump all attacks on one target. Action Surge for the kill.',
  'Rogues: Sneak Attack is single-target by nature. Always on the priority target.',
  'Barbarians: Reckless Attack + GWM on the focus target. Maximum burst.',
  'Paladins: Save Divine Smite for the priority target. Crit-fish on them.',
  'Monks: Stunning Strike the priority target, then party focuses.',
  'Rangers: Hunter\'s Mark the priority target. All attacks get bonus damage.',
];
