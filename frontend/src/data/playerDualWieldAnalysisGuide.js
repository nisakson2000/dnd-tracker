/**
 * playerDualWieldAnalysisGuide.js
 * Player Mode: Two-weapon fighting — rules, optimization, when to use
 * Pure JS — no React dependencies.
 */

export const TWF_RULES = {
  requirement: 'Both weapons must have the Light property.',
  action: 'Attack action with main hand → BA: one attack with off-hand.',
  damage: 'Off-hand does NOT add ability modifier unless you have TWF fighting style.',
  note: 'Uses your bonus action. Competes with many class features.',
};

export const TWF_VS_OTHER_STYLES = [
  { style: 'Two-Weapon Fighting', avgDPR: 'Main: 1d8+MOD + Off: 1d6+MOD', rating: 'B+', note: 'Extra attack uses BA.' },
  { style: 'Great Weapon Fighting', avgDPR: '2d6+MOD + GWM -5/+10', rating: 'S+', note: 'Higher ceiling. Free BA.' },
  { style: 'Dueling + Shield', avgDPR: '1d8+MOD+2 (+2 AC)', rating: 'S', note: 'Defense + damage.' },
  { style: 'Archery + Sharpshooter', avgDPR: '1d8+MOD (ranged, +2 hit, -5/+10)', rating: 'S+', note: 'Safe at range.' },
];

export const WHEN_TWF_WORKS = [
  { situation: 'Low levels (L1-4)', why: 'Extra attack before Extra Attack feature.', rating: 'A' },
  { situation: 'Rogue', why: 'Second chance for Sneak Attack if main hand misses.', rating: 'S' },
  { situation: 'On-hit effects (Hex, Hunter\'s Mark)', why: 'More hits = more bonus damage procs.', rating: 'A' },
  { situation: 'No competing BA features', why: 'Free damage if BA is unused.', rating: 'A' },
];

export const WHEN_TWF_LOSES = [
  { situation: 'Barbarian (BA Rage)', why: 'Rage round 1. Reckless + GWM better.' },
  { situation: 'Monk (Flurry)', why: 'Flurry = 2 BA attacks > 1 TWF attack.' },
  { situation: 'Paladin (BA spells)', why: 'Dueling + Shield strictly better.' },
  { situation: 'After Extra Attack (L5+)', why: 'GWM/Sharpshooter outscale significantly.' },
];

export const DUAL_WIELD_TIPS = [
  'TWF is best on Rogue: second chance for Sneak Attack.',
  'Falls off after L5. GWM/Sharpshooter outscale hard.',
  'TWF uses BA. Check if your class needs BA for other features.',
  'Dual Wielder feat: usually not worth the ASI.',
  'Dueling + Shield > TWF for most martial builds.',
  'At L1-4, TWF is solid. After L5, switch builds.',
  'Best TWF class: Rogue. Worst: Barbarian, Monk.',
  'Fighting Style matters: add ability mod to off-hand.',
  'TWF + Hex: 1d6 extra per hit. More hits = more Hex damage.',
  'For TWF flavor, consider Revenant Blade or homebrew.',
];
