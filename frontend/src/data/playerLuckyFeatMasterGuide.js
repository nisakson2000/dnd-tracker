/**
 * playerLuckyFeatMasterGuide.js
 * Player Mode: Lucky feat — the most powerful feat in the game
 * Pure JS — no React dependencies.
 */

export const LUCKY_BASICS = {
  feat: 'Lucky',
  source: "Player's Handbook",
  benefits: [
    '3 luck points per long rest.',
    'Spend 1: roll additional d20 on any attack, check, or save you make. Choose which d20 to use.',
    'Spend 1: when attacked, roll a d20 and choose which d20 is used for the attack.',
    'Choose AFTER seeing all rolls.',
  ],
  note: 'Widely considered the most powerful feat. 3 rerolls per LR with choose-after-seeing.',
};

export const LUCKY_INTERACTIONS = {
  withDisadvantage: {
    rule: 'Lucky + disadvantage = roll a THIRD d20 and choose any of the three.',
    result: 'Effectively super-advantage (3d20 choose highest). Controversial but RAW.',
  },
  onEnemyAttacks: {
    rule: 'Roll your d20 after seeing attacker\'s result. Choose which is used.',
    result: 'Turn enemy crits into misses. Effectively impose disadvantage on one attack.',
  },
};

export const LUCKY_BEST_USES = [
  { use: 'Critical saving throw', detail: 'Reroll failed save vs Banishment, Hold Person, Polymorph.', priority: 'S' },
  { use: 'Turn enemy crit into miss', detail: 'Enemy nat 20? Roll your d20. Use whichever is lower.', priority: 'S' },
  { use: 'Death saving throw', detail: 'Reroll a death save. Life or death.', priority: 'S' },
  { use: 'Land key attack', detail: 'Miss on Sneak Attack/Smite? Reroll.', priority: 'A' },
  { use: 'Critical ability check', detail: 'Failed Stealth on ambush? Lucky.', priority: 'A' },
];

export const LUCKY_MANAGEMENT = {
  points: 3,
  recharge: 'Long rest.',
  tips: [
    'Save 1 point for saving throws — failed saves end characters.',
    'Don\'t spend on low-stakes rolls.',
    'Last encounter of the day: spend freely.',
  ],
};

export const LUCKY_VS_ALTERNATIVES = {
  vsPortent: 'Portent: 2 predetermined d20s (can force on enemies). Lucky: 3 rerolls (choose after seeing). Both S-tier.',
  vsHalflingLuck: 'Halfling Lucky rerolls nat 1s. Lucky feat rerolls anything. Stacking = nearly immune to bad rolls.',
  verdict: 'Lucky is universally the best feat for any class. Only reason to skip: table ban or personal preference.',
};
