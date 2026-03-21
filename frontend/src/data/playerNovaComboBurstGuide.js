/**
 * playerNovaComboBurstGuide.js
 * Player Mode: Nova combos — maximum single-turn burst damage
 * Pure JS — no React dependencies.
 */

export const NOVA_CONCEPT = {
  definition: 'Dumping maximum resources in a single turn for devastating burst damage.',
  when: 'Boss fights, last encounter of the day, life-or-death moments.',
  warning: 'Nova empties your resources. Only do this when it will end the fight.',
};

export const BEST_NOVA_COMBOS = [
  {
    name: 'Paladin Smite Nova',
    build: 'Paladin 5+',
    setup: 'Attack action (2 attacks) + BA attack (PAM) → smite on all, especially crits.',
    burst: '3 attacks × (weapon + L3 smite 4d8 each) = 3×(2d6+5+4d8) = ~82 DPR',
    onCrit: 'Smite dice doubled. L3 smite crit = 8d8 = 36 extra damage per crit.',
    rating: 'S',
  },
  {
    name: 'Action Surge Fighter Nova',
    build: 'Fighter 5+ (Battle Master ideal)',
    setup: 'Attack (2 attacks) + Action Surge (2 attacks) + BA attack (if PAM/TWF).',
    burst: '5 attacks × GWM (2d6+15) = ~102 DPR',
    note: 'Add Superiority Dice for +30-40 more damage.',
    rating: 'S',
  },
  {
    name: 'Gloom Stalker Round 1 Nova',
    build: 'Gloom Stalker 5 / Fighter 2',
    setup: '3 attacks (EA+DA) + Action Surge (3 more) + CBE BA attack = 7 attacks.',
    burst: '7 × SS (1d6+15) = ~122 DPR round 1',
    rating: 'S+',
  },
  {
    name: 'Sorcadin Hold Person + Smite',
    build: 'Paladin 6 / Sorcerer X',
    setup: 'Hold Person (paralyzed) → melee attack = auto-crit → smite on each crit.',
    burst: 'Each hit: crit weapon + crit smite = 4d6+10d8 per hit. Two hits = 8d6+20d8.',
    rating: 'S+',
    note: 'Requires Hold Person to land (WIS save). If it does, devastating.',
  },
  {
    name: 'Rogue Assassinate',
    build: 'Assassin Rogue 17+',
    setup: 'Surprise enemy (goes first, they\'re surprised) → auto-crit → Sneak Attack × 2.',
    burst: 'Weapon + 18d6 SA (doubled) = 2d8 + 36d6 = ~135 damage.',
    rating: 'A+ (when surprise works)',
  },
  {
    name: 'Sorlock Quickened Burst',
    build: 'Sorcerer 5+ / Warlock 2',
    setup: 'Hex (BA) → EB (action) round 1. Then: Quickened EB (BA) + EB (action).',
    burst: '4 beams × (1d10+5+1d6) = ~52 DPR sustained every round.',
    rating: 'S',
    note: 'Not a one-turn nova but sustained burst every round.',
  },
  {
    name: 'Wizard Wall of Force + Sickening Radiance',
    build: 'Wizard 9+ or Fighter 2 / Wizard 7+',
    setup: 'Action: Wall of Force (dome) → Action Surge: Sickening Radiance inside.',
    result: 'Enemies trapped in dome. SR deals 4d10 radiant per turn + exhaustion. No escape.',
    rating: 'S+',
    note: 'The "microwave" combo. Auto-kills in 6 rounds (6 exhaustion = death).',
  },
];

export const NOVA_MATH = {
  l5Paladin: { attacks: 2, perHit: '2d6+5+4d8 (smite)', total: '~82 DPR (all resources spent)' },
  l5Fighter: { attacks: '4 (Action Surge)', perHit: '2d6+15 (GWM)', total: '~102 DPR' },
  l7GloomStalker: { attacks: 7, perHit: '1d6+15 (SS)', total: '~122 DPR round 1' },
  note: 'These are single-turn outputs. After nova, DPR drops significantly.',
};

export const NOVA_TIPS = [
  'Only nova when it will end the fight. Don\'t blow everything on a minor threat.',
  'Hold Person / Paralyzed = auto-crit on melee hits. Best nova setup.',
  'Crits + Smite = THE Paladin fantasy. Save slots for crits.',
  'GWM/SS + advantage = effective nova. Seek advantage before nova turns.',
  'Action Surge is the universal nova enabler. 2 Fighter dip is worth it.',
  'After nova: you\'re spent. Make sure the fight is won.',
];
