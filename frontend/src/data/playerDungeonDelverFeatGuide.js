/**
 * playerDungeonDelverFeatGuide.js
 * Player Mode: Dungeon Delver feat — trap and secret door specialist
 * Pure JS — no React dependencies.
 */

export const DUNGEON_DELVER_BASICS = {
  feat: 'Dungeon Delver',
  source: "Player's Handbook",
  benefits: [
    'Advantage on Perception and Investigation checks to detect secret doors.',
    'Advantage on saving throws to avoid or resist traps.',
    'Resistance to trap damage.',
    'Traveling at a fast pace doesn\'t impose -5 penalty to passive Perception.',
  ],
  rating: 'C',
  note: 'Very campaign-dependent. In trap-heavy dungeon crawls: B+. In wilderness/social campaigns: F. Ask your DM before taking.',
};

export const DUNGEON_DELVER_VALUE = {
  trapHeavy: { rating: 'B+', note: 'Tomb of Annihilation, Dungeon of the Mad Mage, classic dungeon crawls. Advantage + resistance = lifesaver.' },
  mixed: { rating: 'C', note: 'Some dungeons, some overworld. Occasional value but not worth a feat slot.' },
  socialWilderness: { rating: 'F', note: 'No traps, no secret doors. Complete waste. Never take in these campaigns.' },
  note: 'Always ask your DM: "How many dungeons and traps will we encounter?" before considering this feat.',
};

export const DUNGEON_DELVER_COMBOS = [
  { combo: 'Rogue (Expertise Perception/Investigation)', effect: 'Expertise + advantage = absurd search checks. +17 with advantage at L9.', rating: 'A (in dungeon campaigns)' },
  { combo: 'Observant feat', effect: 'Passive Perception 25+ with advantage on active checks. Nothing stays hidden.', rating: 'A' },
  { combo: 'Divination Wizard', effect: 'Portent + advantage on trap saves. Maximum trap avoidance.', rating: 'B' },
];

export const BETTER_ALTERNATIVES = [
  { feat: 'Alert', reason: 'Can\'t be surprised (broader protection). +5 initiative.' },
  { feat: 'Observant', reason: '+5 passive Perception catches traps passively. Also reads lips.' },
  { feat: 'Lucky', reason: 'Reroll any d20. Works on trap saves AND everything else.' },
  { feat: 'Skill Expert', reason: 'Perception Expertise. Always-on detection improvement.' },
];
