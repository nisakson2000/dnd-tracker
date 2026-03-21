/**
 * playerSneakAttackGuide.js
 * Player Mode: Sneak Attack rules, when it applies, and optimization
 * Pure JS — no React dependencies.
 */

export const SNEAK_ATTACK_RULES = {
  frequency: 'Once per turn (not once per round — can trigger on opportunity attacks too).',
  weaponRequirement: 'Must use a finesse or ranged weapon.',
  conditions: [
    'You have advantage on the attack roll, OR',
    'An ally is within 5ft of the target and you don\'t have disadvantage.',
  ],
  note: 'You don\'t need to use DEX — you can use STR with a finesse weapon and still Sneak Attack.',
  damage: 'Extra dice based on Rogue level.',
};

export const SNEAK_ATTACK_DICE = [
  { level: 1, dice: '1d6' },
  { level: 3, dice: '2d6' },
  { level: 5, dice: '3d6' },
  { level: 7, dice: '4d6' },
  { level: 9, dice: '5d6' },
  { level: 11, dice: '6d6' },
  { level: 13, dice: '7d6' },
  { level: 15, dice: '8d6' },
  { level: 17, dice: '9d6' },
  { level: 19, dice: '10d6' },
];

export const SNEAK_ATTACK_TIPS = [
  'Ready an attack for another creature\'s turn to get a second Sneak Attack in a round.',
  'Booming Blade + Sneak Attack works — it\'s a melee attack with a finesse weapon.',
  'Flanking (optional rule) grants advantage, enabling Sneak Attack.',
  'Familiar using Help action grants advantage on your next attack.',
  'Swashbuckler: don\'t need advantage or ally if you\'re 1-on-1 with the target.',
  'Assassinate (Assassin 3rd level): auto-crit on surprised targets with Sneak Attack = massive damage.',
  'Two-weapon fighting gives a second chance to land Sneak Attack if you miss the first.',
];

export const SNEAK_ATTACK_SOURCES_OF_ADVANTAGE = [
  'Hide action (Cunning Action) — attack from hidden',
  'Familiar Help action',
  'Faerie Fire, Guiding Bolt (target glows)',
  'Flanking (optional rule)',
  'Prone target (melee only, within 5ft)',
  'Restrained, Paralyzed, Stunned, or Unconscious target',
  'Greater Invisibility on you',
  'Darkness + Devil\'s Sight',
  'Shadow Blade (finesse weapon + advantage in dim light/darkness)',
];

export function getSneakAttackDice(rogueLevel) {
  for (let i = SNEAK_ATTACK_DICE.length - 1; i >= 0; i--) {
    if (rogueLevel >= SNEAK_ATTACK_DICE[i].level) return SNEAK_ATTACK_DICE[i].dice;
  }
  return '1d6';
}

export function canSneakAttack(hasAdvantage, allyAdjacentToTarget, hasDisadvantage) {
  if (hasDisadvantage && hasAdvantage) return allyAdjacentToTarget; // they cancel
  if (hasDisadvantage) return false;
  if (hasAdvantage) return true;
  return allyAdjacentToTarget;
}

export function getSneakAttackAvgDamage(rogueLevel) {
  const diceStr = getSneakAttackDice(rogueLevel);
  const match = diceStr.match(/(\d+)d6/);
  if (!match) return 0;
  return parseInt(match[1]) * 3.5;
}
