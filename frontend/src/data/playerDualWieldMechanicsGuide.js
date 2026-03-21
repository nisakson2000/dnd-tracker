/**
 * playerDualWieldMechanicsGuide.js
 * Player Mode: Two-Weapon Fighting — rules, optimization, and viability
 * Pure JS — no React dependencies.
 */

export const TWF_RULES = {
  basic: 'Attack with light melee weapon → BA attack with different light weapon in other hand.',
  modifier: 'BA attack doesn\'t add ability mod to damage (unless TWF Fighting Style).',
  lightWeapons: 'Both must be Light: shortsword, scimitar, handaxe, dagger.',
  dualWielder: 'Dual Wielder feat: non-Light weapons, +1 AC, draw/sheathe 2.',
};

export const TWF_VS_OTHER_STYLES = [
  { style: 'TWF + Style + Dual Wielder', dpr: '3 × (1d8+4) = 25.5', note: 'Best TWF build.' },
  { style: 'GWM Greatsword', dpr: '2 × (2d6+14) = 41', note: 'GWM massively outperforms TWF.' },
  { style: 'PAM Polearm', dpr: '2 × (1d10+4) + (1d4+4) = 25.5', note: 'Same DPR as TWF but with reach + Sentinel combo.' },
  { style: 'Sword & Board', dpr: '2 × (1d8+4) = 17', note: 'Lower damage but +2 AC from shield.' },
];

export const BEST_TWF_CLASSES = [
  { class: 'Rogue', rating: 'S', why: 'Extra attack = extra SA chance. Rogue BA is flexible.' },
  { class: 'Ranger', rating: 'A', why: 'Hunter\'s Mark BA turn 1, TWF turns 2+.' },
  { class: 'Fighter', rating: 'B+', why: 'Viable but GWM/PAM is strictly better.' },
];

export const TWF_TIPS = [
  'TWF is best on Rogues. Extra attack = extra Sneak Attack chance.',
  'GWM/PAM/SS outperform TWF mathematically.',
  'TWF uses BA every turn. Conflicts with many features.',
  'Dual Wielder feat: +1 AC + rapiers. Needed to compete.',
  'TWF Fighting Style: mandatory. Adds mod to BA attack damage.',
  'For pure damage, GWM greatsword beats TWF by ~15 DPR.',
  'TWF looks cool. Flavor > optimization is valid.',
];
