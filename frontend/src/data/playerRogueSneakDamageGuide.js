/**
 * playerRogueSneakDamageGuide.js
 * Player Mode: Sneak Attack rules, optimization, and reliable triggers
 * Pure JS — no React dependencies.
 */

export const SA_RULES = {
  damage: '1d6 per 2 Rogue levels (1d6 L1, 3d6 L5, 5d6 L9, 10d6 L19).',
  frequency: 'Once per TURN (not round). Can SA on turn AND reaction.',
  weapon: 'Finesse or ranged weapon required.',
  triggers: ['Advantage on the attack', 'Ally within 5ft of target (no disadvantage)'],
  note: 'Ally adjacent = SA. You DON\'T need to hide.',
};

export const SA_TRIGGERS = [
  { trigger: 'Ally Adjacent', note: 'Most common. Tank next to enemy.' },
  { trigger: 'Cunning Action Hide', note: 'Bonus action hide. Attack from hidden.' },
  { trigger: 'Faerie Fire/Greater Invis', note: 'Spells that grant advantage.' },
  { trigger: 'Familiar Help', note: 'Owl flyby Help = free advantage.' },
  { trigger: 'Prone/Restrained/Stunned', note: 'Conditions grant advantage.' },
  { trigger: 'Swashbuckler', note: '1v1 within 5ft. No ally needed.' },
];

export const SA_COMBOS = [
  { combo: 'Reaction SA', how: '2 SAs per round via Commander\'s Strike or Sentinel.' },
  { combo: 'Hold Person Crit', how: 'Paralyzed auto-crit. All SA dice double.' },
  { combo: 'Booming Blade + SA', how: 'BB + SA damage. Disengage. Punish movement.' },
  { combo: 'Elven Accuracy', how: '3d20 with advantage. 14.3% crit chance.' },
  { combo: 'TWF Insurance', how: 'Miss first? Off-hand = second attempt.' },
];

export const SA_TIPS = [
  'Ally within 5ft = SA. Don\'t need to hide.',
  'Once per TURN. Reactions = extra SA opportunity.',
  'Rapier: best Rogue melee. Finesse d8.',
  'Owl familiar Help: free advantage every round.',
  'Swashbuckler: easiest trigger. No setup.',
  'Don\'t miss SA. It\'s ALL your damage.',
  'TWF: insurance if first attack misses.',
  'Hold Person + SA crit: coordinate with caster.',
  'Booming Blade + Disengage: hit and run.',
  'Reliable Talent (L11): can\'t roll below 10 on skills.',
];
