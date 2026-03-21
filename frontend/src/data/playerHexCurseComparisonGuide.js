/**
 * playerHexCurseComparisonGuide.js
 * Player Mode: Hex vs Hexblade's Curse vs Hunter's Mark — when to use each
 * Pure JS — no React dependencies.
 */

export const DAMAGE_RIDERS_COMPARED = [
  {
    spell: 'Hex',
    level: 1,
    damage: '+1d6 necrotic per hit',
    duration: 'Concentration, 1 hour (8hr at L3, 24hr at L5)',
    action: 'BA to cast, BA to transfer on kill',
    scaling: '1d6 at all levels',
    pros: ['Works on every attack', 'Long duration at higher slots', 'Disadvantage on one ability check'],
    cons: ['Concentration', 'BA to cast and transfer', 'Doesn\'t scale damage', 'Blocks other concentration'],
    rating: 'A (low levels), B+ (high levels)',
    note: 'Great at L1-4. Falls off as concentration becomes more valuable.',
  },
  {
    spell: 'Hexblade\'s Curse',
    level: 'L1 feature',
    damage: '+PB per hit',
    duration: '1 minute',
    action: 'BA to activate',
    scaling: '+PB per hit (2-6)',
    pros: ['NOT concentration', 'Crits on 19-20', 'Heal on target death', 'Stacks with Hex'],
    cons: ['1/SR', 'Only one target', 'Doesn\'t transfer on kill'],
    rating: 'S+',
    note: 'Best damage rider. No concentration. Crit on 19-20. Stacks with Hex.',
  },
  {
    spell: 'Hunter\'s Mark',
    level: 1,
    damage: '+1d6 per hit',
    duration: 'Concentration, 1 hour (8hr at L3, 24hr at L5)',
    action: 'BA to cast, BA to transfer',
    scaling: '1d6 at all levels',
    pros: ['Advantage on Perception/Survival to track', 'Transfer on kill', 'Long duration'],
    cons: ['Concentration', 'BA to cast/transfer', 'Same issues as Hex'],
    rating: 'A (Rangers)',
    note: 'Ranger staple. Favored Foe (Tasha\'s) replaces it without concentration.',
  },
  {
    spell: 'Favored Foe (Tasha\'s)',
    level: 'L1 feature',
    damage: '+1d4 (1d6 L6, 1d8 L14) once per turn',
    duration: 'Concentration, 1 minute',
    action: 'No action (when you hit)',
    scaling: '1d4 → 1d6 → 1d8',
    pros: ['No BA cost', 'Scales', 'Activates on hit'],
    cons: ['Concentration', 'Once per turn', 'PB uses/LR'],
    rating: 'A (replaces Hunter\'s Mark)',
    note: 'Better than Hunter\'s Mark for Rangers. No action cost.',
  },
  {
    spell: 'Spirit Shroud (Tasha\'s)',
    level: 3,
    damage: '+1d8 per hit (2d8 at L5, 3d8 at L7)',
    duration: 'Concentration, 1 minute',
    action: 'BA',
    scaling: '+1d8 per 2 slot levels',
    pros: ['Higher damage than Hex', 'Scales with slot level', 'Reduces healing'],
    cons: ['10ft range only', 'Concentration', 'Higher level'],
    rating: 'S (melee)',
    note: 'Best damage rider for melee builds. Replaces Hex at L5+.',
  },
];

export const DAMAGE_RIDER_TIPS = [
  'Hex: great at L1-4. After that, concentration is too valuable.',
  'Hexblade\'s Curse: no concentration. Always use it. Stacks with Hex.',
  'Hunter\'s Mark: replaced by Favored Foe (Tasha\'s). Use that instead.',
  'Spirit Shroud: best melee damage rider at L5+. +1d8 per hit scales.',
  'At higher levels: use concentration for Hypnotic Pattern, not Hex.',
  'Hexblade\'s Curse + Elven Accuracy: crit on 19-20 with triple advantage.',
  'Hex disadvantage on ability checks: pick STR to nerf grapple escape.',
  'Don\'t double-concentrate. Hex + Spirit Guardians is impossible.',
  'Favored Foe: no BA cost. Better economy than Hunter\'s Mark.',
  'At L5+: Hex adds 2d6/round (2 beams). Spirit Shroud adds 2d8+. Shroud wins.',
];
