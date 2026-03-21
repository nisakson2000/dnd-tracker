/**
 * playerStealthRules.js
 * Player Mode: Stealth, hiding, and surprise mechanics
 * Pure JS — no React dependencies.
 */

export const STEALTH_RULES = {
  hiding: 'Action to Hide: DEX (Stealth) check vs observer\'s passive Perception.',
  requirements: 'Must be heavily obscured or behind total cover to attempt to hide.',
  detection: 'Detected if: you make noise, come out of cover, or an enemy uses Search action.',
  combat: 'Hiding in combat: Cunning Action (Rogue) lets you hide as a bonus action.',
  attackFromHidden: 'Attack from hidden = advantage. Hit or miss, your position is revealed.',
  invisibility: 'Invisible ≠ Hidden. Invisibility lets you try to hide anywhere, but you still make noise.',
};

export const PASSIVE_PERCEPTION_MODIFIERS = [
  { modifier: '+5', condition: 'Advantage on Perception (e.g., Keen Hearing and Sight)' },
  { modifier: '-5', condition: 'Disadvantage on Perception (e.g., lightly obscured, noisy environment)' },
  { modifier: '+0', condition: 'Observant feat adds +5 to passive Perception and Investigation' },
];

export const STEALTH_TIPS = [
  'Pass without Trace (+10 to Stealth) makes the whole party nearly undetectable.',
  'Rogues: Cunning Action lets you Hide as a bonus action every turn.',
  'Rangers: Natural Explorer gives advantage on Stealth in favored terrain.',
  'Halflings: Naturally Stealthy lets you hide behind Medium or larger creatures.',
  'Wood Elves: Mask of the Wild lets you hide when lightly obscured by natural phenomena.',
  'Skulker feat: missing a ranged attack doesn\'t reveal your position.',
  'Darkness + Devil\'s Sight: you\'re heavily obscured to enemies, can hide anywhere.',
  'Minor Illusion: create cover to hide behind (if DM allows).',
];

export const SURPRISE_RULES = {
  determination: 'DM compares sneaking group\'s Stealth checks against each enemy\'s passive Perception.',
  surprised: 'Surprised creatures can\'t move or take actions on their first turn. Can\'t take reactions until that turn ends.',
  alertFeat: 'Alert feat: can\'t be surprised while conscious. +5 initiative.',
  assassin: 'Assassin Rogue: advantage on attacks against creatures that haven\'t acted. Auto-crit on surprised creatures.',
  important: 'Surprise is per-creature, not whole-group. Some enemies may be surprised while others aren\'t.',
};

export function isHidden(stealthRoll, passivePerception) {
  return stealthRoll >= passivePerception;
}

export function calculatePassivePerception(wisdomMod, profBonus, isProficient, hasAdvantage, hasDisadvantage) {
  let base = 10 + wisdomMod;
  if (isProficient) base += profBonus;
  if (hasAdvantage) base += 5;
  if (hasDisadvantage) base -= 5;
  return base;
}
