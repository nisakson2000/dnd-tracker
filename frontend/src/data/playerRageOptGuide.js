/**
 * playerRageOptGuide.js
 * Player Mode: Barbarian Rage optimization
 * Pure JS — no React dependencies.
 */

export const RAGE_RULES = {
  activation: 'Bonus action on your turn.',
  duration: '1 minute (10 rounds).',
  endConditions: [
    'You haven\'t attacked or taken damage since your last turn.',
    'You fall unconscious.',
    'You choose to end it (no action required).',
  ],
  uses: [
    { level: '1-2', rages: 2 },
    { level: '3-5', rages: 3 },
    { level: '6-11', rages: 4 },
    { level: '12-16', rages: 5 },
    { level: '17-19', rages: 6 },
    { level: 20, rages: 'Unlimited' },
  ],
};

export const RAGE_BENEFITS = [
  { benefit: 'Resistance to bludgeoning, piercing, slashing', note: 'Physical damage halved. At L6 Totem Bear: ALL damage except psychic.' },
  { benefit: 'Rage damage bonus', levels: [{ range: '1-8', bonus: '+2' }, { range: '9-15', bonus: '+3' }, { range: '16+', bonus: '+4' }] },
  { benefit: 'Advantage on STR checks and STR saves', note: 'Grapple/shove with advantage. STR saves with advantage. Very powerful.' },
];

export const RAGE_RESTRICTIONS = [
  'Can\'t cast spells or concentrate on spells while raging.',
  'Must use STR-based attacks to get rage damage (not DEX).',
  'Must attack a creature or take damage each round or rage ends.',
  'Heavy armor doesn\'t prevent rage, but Unarmored Defense requires no armor.',
];

export const RAGE_OPTIMIZATION = [
  { tip: 'Don\'t rage in easy fights', detail: 'Limited rages per day. Save for challenging encounters. Trash mobs don\'t need rage.', rating: 'S' },
  { tip: 'Reckless Attack every round', detail: 'Advantage on attacks (at cost of enemies having advantage). Resistance halves the extra damage you take.', rating: 'S' },
  { tip: 'Take damage to maintain rage', detail: 'If you haven\'t attacked, you need to take damage. Ask allies to slap you if no enemies in range.', rating: 'A' },
  { tip: 'Grapple while raging', detail: 'Advantage on STR checks. Grapple = contested STR check. Rage makes you an elite grappler.', rating: 'A' },
  { tip: 'Great Weapon Master + Reckless', detail: 'Reckless = advantage. Advantage offsets GWM -5 penalty. +10 damage per hit with good hit chance.', rating: 'S' },
  { tip: 'Don\'t rage if you need to cast', detail: 'If you need Healing Word or another spell, don\'t rage that round. Rage prevents all spellcasting.', rating: 'A' },
];

export const RAGE_EFFECTIVE_HP = {
  note: 'Resistance to physical damage effectively doubles your HP against physical attacks.',
  examples: [
    { hp: 50, effectiveHP: 100, note: 'L5 Barbarian: 50 HP → effectively 100 HP vs physical.' },
    { hp: 100, effectiveHP: 200, note: 'L10 Barbarian: 100 HP → effectively 200 HP vs physical.' },
    { hp: 150, effectiveHP: 300, note: 'L15 Barbarian: 150 HP → effectively 300 HP vs physical.' },
  ],
  bearTotem: 'Totem Bear L6: resistance to ALL damage except psychic. Effective HP doubles against everything.',
};

export function rageDPRBonus(numAttacks, rageBonus) {
  return { extraDPR: numAttacks * rageBonus, note: `Rage: +${rageBonus} × ${numAttacks} attacks = +${numAttacks * rageBonus} DPR` };
}

export function rageEffectiveHP(currentHP, isPhysicalDamage, isBearTotem) {
  const resisted = isPhysicalDamage || isBearTotem;
  const effective = resisted ? currentHP * 2 : currentHP;
  return { effective, note: `${currentHP} HP${resisted ? ' (resistance: effectively ' + effective + ' HP)' : ' (no resistance)'}` };
}
