/**
 * playerTWFOptimizationGuide.js
 * Player Mode: Two-weapon fighting — rules, viability, and alternatives
 * Pure JS — no React dependencies.
 */

export const TWF_RULES = {
  requirement: 'Both weapons must have Light property (or Dual Wielder feat).',
  action: 'Attack with light weapon → BA off-hand attack with other light weapon.',
  damage: 'Off-hand: no ability mod damage (unless TWF Fighting Style).',
  draw: 'Can only draw 1 weapon/turn without Dual Wielder feat.',
};

export const TWF_BY_CLASS = [
  { class: 'Rogue', rating: 'S', note: 'Second attack = second SA chance. Best TWF class.' },
  { class: 'Ranger', rating: 'A', note: 'Hunter\'s Mark benefits from extra attacks.' },
  { class: 'Fighter', rating: 'B+', note: 'Works early but GWM/PAM outscale. 3-4 attacks make TWF less impactful.' },
  { class: 'Barbarian', rating: 'B+', note: 'Rage damage per hit. But GWM+Reckless is better.' },
  { class: 'Paladin', rating: 'B', note: 'Extra smite chance. BA competes with smite spells.' },
];

export const TWF_VS_ALTERNATIVES = [
  { style: 'GWM+Greatsword', damage: 'Higher with advantage. +10 damage per hit.', verdict: 'Better for STR builds.' },
  { style: 'Sword+Shield', damage: 'Lower damage, +2 AC.', verdict: 'Better for tanks.' },
  { style: 'PAM+Glaive', damage: 'BA d4 + OA on enter. More utility.', verdict: 'Better overall (OA value).' },
  { style: 'Ranged (SS)', damage: '-5/+10 at range. Safer.', verdict: 'Better for DEX builds.' },
];

export const TWF_TIPS = [
  'TWF is best for Rogues — second chance for Sneak Attack is the key advantage.',
  'Always take TWF Fighting Style if dual-wielding. Off-hand without mod damage is awful.',
  'Dual Wielder feat: d8 weapons + 1 AC. Worth it for dedicated TWF builds.',
  'More attacks = more on-hit procs (Hunter\'s Mark, Hex, Rage damage).',
  '2024 PHB Nick property frees up BA, making TWF competitive with other styles.',
];
