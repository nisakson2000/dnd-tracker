/**
 * playerTempHPRulesGuide.js
 * Player Mode: Temporary HP rules and optimization
 * Pure JS — no React dependencies.
 */

export const TEMP_HP_RULES = {
  basics: [
    'Temporary HP is a buffer on top of your actual HP.',
    'Damage hits temp HP first, then real HP.',
    'Temp HP don\'t stack: if you gain new temp HP, choose current or new (can\'t add).',
    'Temp HP can\'t be healed — they\'re a separate pool.',
    'Temp HP last until depleted or until the effect that granted them ends.',
    'Temp HP don\'t count as "healing" — they\'re not affected by max HP.',
  ],
  note: 'Key rule: temp HP don\'t stack. Getting 10 temp HP twice = 10 temp HP, not 20. Choose the higher amount.',
};

export const TEMP_HP_SOURCES = [
  { source: 'Twilight Sanctuary (Cleric)', amount: '1d6 + Cleric level', frequency: 'Every round (all allies in aura)', rating: 'S+', note: 'Best temp HP in the game. Refreshes EVERY ROUND.' },
  { source: 'Inspiring Leader (feat)', amount: 'Level + CHA mod', frequency: 'Every SR (up to 6 creatures)', rating: 'S', note: '10-minute speech. Scales well. Party-wide.' },
  { source: 'Heroism (L1)', amount: 'CHA mod per turn', frequency: 'Each turn start (concentration)', rating: 'A', note: 'Stacking temp HP each turn. + immune to frightened.' },
  { source: 'Armor of Agathys (L1)', amount: '5 per slot level', frequency: '1 hour duration', rating: 'A', note: 'Also deals cold damage to melee attackers. Great for Warlocks.' },
  { source: 'False Life (L1)', amount: '1d4+4', frequency: 'Until depleted (1 hour)', rating: 'B', note: 'Low amount. Fiendish Vigor invocation = at will.' },
  { source: 'Dark One\'s Blessing (Fiend Warlock)', amount: 'CHA mod + Warlock level', frequency: 'On killing blow', rating: 'A', note: 'Scales well. Rewards aggressive play.' },
  { source: 'Aid (L2)', amount: '5 per slot level', frequency: '8 hours', rating: 'S', note: 'NOT temp HP — max HP increase. Stacks with temp HP!' },
  { source: 'Aura of Vitality (L3)', amount: 'N/A (healing, not temp HP)', note: 'Common confusion: this heals, doesn\'t give temp HP.' },
];

export const TEMP_HP_OPTIMIZATION = [
  { tip: 'Take the higher amount', detail: 'If you have 5 temp HP and gain 8, take 8 (not 13). Always choose the larger pool.', rating: 'S' },
  { tip: 'Get temp HP before combat', detail: 'Inspiring Leader speech, False Life, Armor of Agathys — apply before initiative.', rating: 'A' },
  { tip: 'Temp HP + Aid stack', detail: 'Aid increases max/current HP (not temp). So Aid + temp HP = both active simultaneously.', rating: 'A' },
  { tip: 'Twilight Sanctuary refreshes', detail: 'Twilight Cleric: temp HP refreshes every round. Losing temp HP is fine — you get more.', rating: 'S' },
  { tip: 'Armor of Agathys retaliates', detail: 'While AoA temp HP remains: melee attackers take cold damage. Keep them up as long as possible.', rating: 'A' },
];

export const TEMP_HP_VS_HEALING = {
  tempHP: {
    pros: ['Absorbs damage before real HP', 'Can exceed max HP', 'Proactive (applied before damage)'],
    cons: ['Don\'t stack', 'Can\'t be healed back', 'Expire when effect ends'],
  },
  healing: {
    pros: ['Can be applied reactively', 'Multiple heals stack', 'Cures ongoing conditions (sometimes)'],
    cons: ['Can\'t exceed max HP', 'Reactive (applied after damage)', 'Less efficient than preventing damage'],
  },
  note: 'Prevention (temp HP) > cure (healing) in most cases. It\'s better to not take damage than to heal it.',
};
