/**
 * playerBonusActionPriorityGuide.js
 * Player Mode: Bonus action economy — what competes, priority by class
 * Pure JS — no React dependencies.
 */

export const BONUS_ACTION_RULES = {
  limit: 'ONE bonus action per turn. No stacking.',
  timing: 'You choose when during your turn to use it.',
  noDefault: 'You don\'t have a BA unless something grants one.',
  twoWeapon: 'TWF attack is a BA. Competes with everything else.',
  spellRule: 'If you cast a BA spell, you can only cast a cantrip with your action (not another leveled spell).',
};

export const BA_BY_CLASS = [
  {
    class: 'Barbarian',
    bonusActions: [
      { name: 'Rage', priority: 'S+ (turn 1)', note: 'Always Rage turn 1. No competition.' },
    ],
    competition: 'Low. Rage T1, then BA is usually free.',
  },
  {
    class: 'Bard',
    bonusActions: [
      { name: 'Bardic Inspiration', priority: 'S', note: 'Give before ally\'s turn. Core feature.' },
      { name: 'Healing Word', priority: 'S+ (emergency)', note: 'BA ranged heal. Best emergency revive.' },
    ],
    competition: 'Medium. Inspiration vs Healing Word.',
  },
  {
    class: 'Cleric',
    bonusActions: [
      { name: 'Healing Word', priority: 'S+ (emergency)', note: '1 HP revive from range.' },
      { name: 'Spiritual Weapon', priority: 'S', note: 'BA attack every turn. No concentration.' },
    ],
    competition: 'High. Spiritual Weapon vs Healing Word every turn.',
  },
  {
    class: 'Fighter',
    bonusActions: [
      { name: 'Second Wind', priority: 'A', note: '1d10+level HP. Free heal.' },
      { name: 'PAM BA attack', priority: 'S', note: 'd4+STR. Extra attack every turn.' },
      { name: 'TWF attack', priority: 'A', note: 'Competes with PAM.' },
    ],
    competition: 'High for PAM/TWF builds. Low otherwise.',
  },
  {
    class: 'Monk',
    bonusActions: [
      { name: 'Flurry of Blows', priority: 'S', note: '2 unarmed strikes. 1 Ki.' },
      { name: 'Patient Defense', priority: 'A+', note: 'Dodge as BA. 1 Ki.' },
      { name: 'Step of the Wind', priority: 'A', note: 'Dash or Disengage as BA. 1 Ki.' },
      { name: 'Martial Arts BA', priority: 'S (free)', note: '1 unarmed strike. No Ki cost.' },
    ],
    competition: 'Very high. Every turn is a BA decision.',
  },
  {
    class: 'Rogue',
    bonusActions: [
      { name: 'Cunning Action', priority: 'S+', note: 'Dash, Disengage, or Hide as BA. Core.' },
      { name: 'Steady Aim (Tasha\'s)', priority: 'S', note: 'Advantage on next attack. Can\'t move.' },
    ],
    competition: 'Medium. Cunning Action is usually best.',
  },
  {
    class: 'Sorcerer',
    bonusActions: [
      { name: 'Quickened Spell', priority: 'S+', note: 'Cast spell as BA. Premium Metamagic.' },
    ],
    competition: 'Low. Quickened when needed, otherwise free.',
  },
  {
    class: 'Warlock',
    bonusActions: [
      { name: 'Hex', priority: 'A', note: 'BA to cast/transfer. +1d6 per hit.' },
      { name: 'Hexblade\'s Curse', priority: 'S+', note: 'BA to activate. +PB damage, crit 19-20.' },
    ],
    competition: 'Medium. Hex + Curse both want T1 BA.',
  },
];

export const BA_ECONOMY_TIPS = [
  'You get ONE bonus action. Plan which BA you\'ll use BEFORE your turn.',
  'Healing Word > Spiritual Weapon on the turn an ally drops to 0.',
  'BA spell rule: if you cast Healing Word (BA), you can only cantrip with action.',
  'Monks: Flurry when you need damage, Patient Defense when focused.',
  'Rogues: Cunning Action Hide > TWF attack in most cases (guarantees SA next turn).',
  'Turn 1 BA is often the most impactful: Rage, Hex, Hunter\'s Mark, Spiritual Weapon.',
  'PAM BA attack: always use it. Free d4+STR every turn.',
  'TWF competes with too many things. Often not worth the BA cost.',
  'Quickened Spell: save for clutch moments. Don\'t waste SP.',
  'If nothing needs your BA: you can\'t "bank" it. Use it or lose it.',
];
