/**
 * playerFlankingGuide.js
 * Player Mode: Flanking rules (optional), positioning for advantage, and tactical positioning
 * Pure JS — no React dependencies.
 */

export const FLANKING_RULES = {
  official: 'Flanking is an OPTIONAL rule (DMG p.251). Ask your DM if it\'s in use.',
  requirement: 'Two allies on opposite sides of a creature (directly across through the creature\'s space).',
  benefit: 'Advantage on melee attack rolls against the flanked creature.',
  gridRule: 'Draw a line between the centers of the two flanking creatures. If it passes through opposite sides or corners of the target\'s space, they\'re flanking.',
  limitations: [
    'Only works for melee attacks, not ranged or spells',
    'Both flanking creatures must be able to see the target',
    'Both must be able to take actions (not incapacitated)',
    'Doesn\'t work if target has all-around vision (e.g., Beholder)',
  ],
};

export const FLANKING_POSITIONS = {
  square: {
    description: 'On a square grid, flanking positions are directly opposite',
    positions: [
      'North + South',
      'East + West',
      'NE + SW (diagonal)',
      'NW + SE (diagonal)',
    ],
  },
  hex: {
    description: 'On a hex grid, flanking positions are directly across (3 hexes apart around the target)',
    positions: ['Any two hexes that are directly opposite through the target\'s space'],
  },
  large: {
    description: 'Large+ creatures: line must pass through opposite sides/corners of the FULL space',
    note: 'Easier to flank large creatures because they occupy more space.',
  },
};

export const FLANKING_TACTICS = [
  { tactic: 'Melee pair positioning', detail: 'Fighter and Rogue on opposite sides. Rogue gets advantage for Sneak Attack AND flanking.', impact: 'S' },
  { tactic: 'Summon flanking buddy', detail: 'Spiritual Weapon, familiars (if they can attack), summoned creatures all count for flanking.', impact: 'A' },
  { tactic: 'Mount as flanking partner', detail: 'Your mount counts as a separate creature for flanking purposes.', impact: 'A' },
  { tactic: 'Avoid being flanked yourself', detail: 'Keep your back to a wall. Position so enemies can\'t get behind you.', impact: 'A' },
  { tactic: 'Flanking + Shove Prone', detail: 'Flank for advantage, then shove prone. Now ALL melee attacks have advantage (from prone).', impact: 'S' },
  { tactic: 'Break enemy flanking', detail: 'If enemies are flanking an ally, move to force them to reposition or take OAs.', impact: 'B' },
];

export const WITHOUT_FLANKING = {
  description: 'If your table doesn\'t use flanking, here\'s how to get advantage in melee:',
  methods: [
    { method: 'Shove Prone', detail: 'Athletics check vs Athletics/Acrobatics. If prone, melee attacks have advantage.', action: 'Action (or Extra Attack substitute)' },
    { method: 'Reckless Attack', detail: 'Barbarian feature. Advantage on STR melee attacks, but attacks against you also have advantage.', action: 'Declared on first attack' },
    { method: 'Faerie Fire', detail: 'DEX save or grant advantage on all attacks against affected creatures.', action: '1st level spell (concentration)' },
    { method: 'Guiding Bolt', detail: 'Next attack against the target has advantage.', action: '1st level spell' },
    { method: 'Pack Tactics', detail: 'Beast Master companions, some summons. Advantage if ally within 5ft.', action: 'Passive' },
    { method: 'Invisibility', detail: 'Unseen attacker = advantage. Breaks on attack but first hit has advantage.', action: 'Spell or feature' },
    { method: 'Hiding', detail: 'Cunning Action Hide (Rogue). Attack from hidden = advantage.', action: 'Bonus action (Rogue)' },
  ],
};

export const FLANKING_CONTROVERSY = {
  proFlanking: [
    'Encourages tactical positioning and teamwork',
    'Makes melee more competitive with ranged attackers',
    'Simple rule that\'s easy to understand',
    'Rewards smart play over dice luck',
  ],
  antiFlanking: [
    'Makes advantage too easy to get, devaluing class features that grant it',
    'Reckless Attack, Faerie Fire, and similar become less special',
    'Can lead to "conga lines" of flanking',
    'Monsters with Pack Tactics become extremely dangerous',
  ],
  compromise: 'Some tables use flanking as +2 to hit instead of advantage. Best of both worlds.',
};

export function isFlankingPosition(attacker, ally, target, gridType) {
  // Simplified check — in practice this would use actual grid coordinates
  if (gridType === 'hex') {
    return { flanking: false, note: 'Hex flanking requires 3-hex separation check. Ask your DM.' };
  }
  return { flanking: false, note: 'Flanking requires opposite-side positioning. Check with DM.' };
}

export function getAdvantageMethod(className, hasAllyAdjacent) {
  const methods = [];
  if (hasAllyAdjacent) methods.push('Flanking (if optional rule is in use)');

  const classMethods = {
    Barbarian: ['Reckless Attack (at will, but grants advantage against you)'],
    Rogue: ['Cunning Action Hide (bonus action)', 'Steady Aim (bonus action, can\'t move)'],
    Fighter: ['Shove Prone (use one Extra Attack)', 'Trip Attack (Battle Master)'],
    Ranger: ['Ensnaring Strike (restrained = advantage)', 'Zephyr Strike (advantage on one attack)'],
  };

  methods.push(...(classMethods[className] || ['Shove Prone', 'Coordinate with party for Faerie Fire/buffs']));
  return methods;
}
