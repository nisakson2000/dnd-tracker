/**
 * playerActionEconomy101.js
 * Player Mode: Understanding the action economy — why it matters and how to win it
 * Pure JS — no React dependencies.
 */

export const ACTION_ECONOMY_BASICS = {
  concept: 'Action economy = how many actions your side gets vs the enemy side. The side with more actions usually wins.',
  perTurn: {
    action: '1 Action — your main thing (attack, cast, Dash, Dodge, etc.)',
    bonusAction: '1 Bonus Action — only if you have a feature that uses one',
    reaction: '1 Reaction — triggered by something else happening (OA, Shield, Counterspell)',
    movement: 'Movement — up to your speed, freely split around actions',
    freeInteraction: '1 Object Interaction — draw weapon, open door, pick up item',
  },
  why: 'A party of 4 gets 4 actions per round. If you summon a creature, that\'s 5 vs the enemy\'s actions. More actions = more damage, more control, more options.',
};

export const WINNING_ACTION_ECONOMY = [
  {
    method: 'Summon creatures',
    detail: 'Conjure Animals, summoning spells, Find Familiar. Each summon adds actions to your side.',
    example: 'Conjure Animals (8 wolves) = 12 actions for your side instead of 4.',
    impact: 'S',
  },
  {
    method: 'Remove enemies from combat',
    detail: 'Banishment, Hold Person, Hypnotic Pattern. A disabled enemy = 0 actions for their side.',
    example: 'Hypnotic Pattern on 3 enemies = your 4 actions vs their 2 actions.',
    impact: 'S',
  },
  {
    method: 'Kill enemies quickly (focus fire)',
    detail: 'Dead enemies contribute 0 actions. Kill one fast rather than damaging three.',
    example: 'Killing 1 of 4 enemies = 4v3 action economy. Spreading damage = still 4v4.',
    impact: 'A',
  },
  {
    method: 'Use bonus actions',
    detail: 'Bonus actions are "free" extra actions. Spiritual Weapon, Healing Word, offhand attacks.',
    example: 'Cleric: Spirit Guardians (action) + Spiritual Weapon (bonus action) = 2 damage sources per turn.',
    impact: 'A',
  },
  {
    method: 'Use reactions',
    detail: 'Reactions happen on OTHER creatures\' turns. You\'re getting actions outside your turn.',
    example: 'Sentinel OA = an extra attack. Shield = negating an enemy attack. Both are "free" actions.',
    impact: 'A',
  },
  {
    method: 'Haste',
    detail: 'Extra action for one ally. That ally gets an additional attack/Dash/Dodge/etc.',
    example: 'Haste on a Fighter with 3 attacks = 4 attacks per turn instead of 3.',
    impact: 'A',
  },
  {
    method: 'Action Surge',
    detail: 'Fighter gets a second full action. With Extra Attack, that\'s 4-8 attacks in one turn.',
    example: 'Level 11 Fighter: 3 attacks + Action Surge 3 attacks = 6 attacks in one turn.',
    impact: 'S',
  },
  {
    method: 'Crowd control spells',
    detail: 'Wall of Force, Forcecage — split the enemy group. Fight half while half can\'t participate.',
    example: 'Wall of Force splitting 6 enemies: fight 3 at a time = 4v3 twice instead of 4v6.',
    impact: 'S',
  },
];

export const ACTION_ECONOMY_TRAPS = [
  { trap: 'Wasting your action on low-impact things', detail: 'Using your action to drink a healing potion for 2d4+2 HP when you could attack for 20+ damage.', fix: 'Attack or cast instead. Healing potions are for emergencies.' },
  { trap: 'Not using bonus actions', detail: 'Many players forget they have bonus action options. That\'s a wasted action every turn.', fix: 'Check your class features. Misty Step, Healing Word, offhand attacks, Spiritual Weapon.' },
  { trap: 'Not using reactions', detail: 'If your reaction goes unused, that\'s a wasted opportunity attack or defensive spell.', fix: 'Take OAs when available. Hold your reaction for Shield/Counterspell if you have them.' },
  { trap: 'Over-healing', detail: 'Spending 2 actions healing 15 HP total when one attack could have killed the enemy.', fix: 'Heal only at 0 HP. Kill enemies to prevent future damage.' },
  { trap: 'Moving unnecessarily', detail: 'Moving 30ft to a slightly better position when you could attack from where you are.', fix: 'Only move if it provides a significant tactical advantage.' },
  { trap: 'Analysis paralysis', detail: 'Spending 3 minutes deciding what to do wastes real-time action economy at the table.', fix: 'Have a default action. When in doubt, attack the nearest enemy.' },
];

export const BONUS_ACTION_ECONOMY = {
  description: 'Bonus actions are limited. You get ONE per turn. Plan which bonus action features to use.',
  conflicts: [
    { options: ['Healing Word', 'Spiritual Weapon attack'], resolution: 'Spiritual Weapon if nobody is at 0 HP. Healing Word if someone is down.' },
    { options: ['Misty Step', 'Offhand attack'], resolution: 'Misty Step if you need to escape or reposition dramatically. Offhand for DPR.' },
    { options: ['Cunning Action', 'Offhand attack'], resolution: 'Hide or Disengage usually beats the d6 offhand damage for Rogues.' },
    { options: ['Rage', 'Bonus action attack'], resolution: 'Rage on turn 1 (it lasts the whole fight). Bonus attack after that.' },
    { options: ['Hex', 'Eldritch Blast'], resolution: 'Cast Hex on turn 1 (bonus action), then Eldritch Blast every subsequent turn.' },
  ],
};

export function actionEconomyRatio(partySize, partySummons, enemyCount, enemiesDisabled) {
  const partyActions = partySize + partySummons;
  const enemyActions = enemyCount - enemiesDisabled;
  const ratio = partyActions / Math.max(1, enemyActions);
  return {
    partyActions,
    enemyActions,
    ratio: Math.round(ratio * 100) / 100,
    advantage: ratio > 1.5 ? 'Strong' : ratio > 1 ? 'Slight' : ratio === 1 ? 'Even' : 'Disadvantaged',
  };
}
