/**
 * playerCombatActionsComparisonGuide.js
 * Player Mode: When to Disengage, Dodge, Dash, Help, or Hide
 * Pure JS — no React dependencies.
 */

export const COMBAT_ACTIONS = [
  {
    action: 'Dodge',
    effect: 'Attacks against you have disadvantage. Advantage on DEX saves.',
    bestWhen: ['Surrounded, can\'t escape', 'Tanking with Spirit Guardians', 'Protecting concentration'],
    rating: 'A',
  },
  {
    action: 'Disengage',
    effect: 'Movement doesn\'t provoke OA this turn.',
    bestWhen: ['Caster stuck in melee', 'Repositioning safely', 'Escaping danger'],
    rating: 'A',
  },
  {
    action: 'Dash',
    effect: 'Double your movement this turn.',
    bestWhen: ['Closing distance', 'Full retreat', 'Reaching a critical location'],
    rating: 'B+',
  },
  {
    action: 'Help',
    effect: 'Give ally advantage on next attack or check.',
    bestWhen: ['Ally needs advantage (Rogue SA, GWM)', 'You can\'t deal meaningful damage'],
    rating: 'B',
  },
  {
    action: 'Hide',
    effect: 'Stealth check → unseen → advantage on attacks from hiding.',
    bestWhen: ['Rogue Cunning Action', 'Have cover/concealment', 'Setting up surprise'],
    rating: 'A (Rogues)',
  },
];

export const SG_DODGE_COMBO = {
  combo: 'Spirit Guardians + Dodge',
  tactic: 'Cast SG → Dodge every turn → enemies take 3d8 entering/starting in aura.',
  why: 'SG needs no action. Dodge protects concentration. 13.5 DPR per enemy with no attack action needed.',
  rating: 'S',
};

export const DODGE_VS_DISENGAGE = {
  dodge: 'Stay and tank. Reduce incoming damage. Want to be in melee.',
  disengage: 'Leave melee safely. Don\'t want to be here.',
  neither: 'If you can kill the enemy, just attack. Dead enemies can\'t hit you.',
};
