/**
 * playerLongRestRulesGuide.js
 * Player Mode: Long rest, short rest, and rest variant rules
 * Pure JS — no React dependencies.
 */

export const LONG_REST_RULES = {
  duration: '8 hours. At least 6 hours sleeping, up to 2 hours light activity (reading, keeping watch, etc.)',
  benefits: [
    'Regain all HP',
    'Regain all Hit Dice (up to half your total, minimum 1)',
    'Regain all spell slots',
    'Regain all class features that recharge on long rest',
    'Remove 1 level of exhaustion (if any)',
  ],
  interruption: 'If interrupted by at least 1 hour of strenuous activity (combat, walking, casting), must restart.',
  frequency: 'Can only benefit from one long rest per 24-hour period.',
  armor: 'RAW: no rule against sleeping in armor. Xanathar\'s optional rule: sleeping in medium/heavy armor = only 1/4 HD recovered, no exhaustion removal.',
};

export const SHORT_REST_RULES = {
  duration: '1 hour. No strenuous activity.',
  benefits: [
    'Spend Hit Dice to heal (roll HD + CON mod per die)',
    'Regain features that recharge on short rest (Channel Divinity, Second Wind, Action Surge, Warlock slots, etc.)',
  ],
  hitDice: 'Spend any number of available HD. Each die: roll + CON mod = HP regained.',
  frequency: 'No limit on short rests per day (DM discretion).',
  note: 'Standard adventuring day assumes 2 short rests. Short rest classes (Fighter, Warlock, Monk) need these.',
};

export const SHORT_REST_DEPENDENT_CLASSES = [
  { class: 'Fighter', features: ['Action Surge', 'Second Wind', 'Superiority Dice', 'Indomitable'], note: 'Fighters are designed around short rests. Multiple Action Surges per day.' },
  { class: 'Warlock', features: ['Pact Magic slots', 'Hexblade\'s Curse', 'Various invocations'], note: 'Only 2-3 spell slots. Short rest recovery is essential. Push for short rests.' },
  { class: 'Monk', features: ['Ki points'], note: 'Ki recharges on short rest. Without short rests, Monks run dry fast.' },
  { class: 'Bard', features: ['Bardic Inspiration (at L5: short rest recovery)'], note: 'Font of Inspiration at L5 = BI on short rest. Before L5, BI is long rest only.' },
  { class: 'Cleric', features: ['Channel Divinity'], note: '1-2 uses per short rest. Important but not class-defining.' },
  { class: 'Druid', features: ['Wild Shape'], note: '2 uses per short rest. Moon Druid especially needs these.' },
];

export const REST_VARIANTS = {
  grittyRealism: {
    shortRest: '8 hours (overnight)',
    longRest: '7 days (full week of downtime)',
    effect: 'Makes resources much more precious. Casters are heavily nerfed. Short rest classes benefit relatively.',
    note: 'Good for survival/exploration campaigns. Terrible for dungeon crawls.',
  },
  epicHeroism: {
    shortRest: '5 minutes (quick breather)',
    longRest: '1 hour (quick nap)',
    effect: 'Resources flow freely. More heroic fantasy. Casters are very strong.',
    note: 'Good for high-action campaigns. Makes Warlocks weaker relative (everyone recovers fast).',
  },
};

export const HIT_DICE_OPTIMIZATION = [
  { tip: 'Save HD for between combats', detail: 'Don\'t spend all HD on first short rest. Save some for the second. Ration your healing.' },
  { tip: 'High CON = efficient HD', detail: '+3 CON mod means each d8 HD heals 4.5+3 = 7.5 avg. +5 CON = 9.5 avg. CON pays for itself.' },
  { tip: 'Durable feat', detail: 'Minimum HP per HD = 2× CON mod. With +3 CON: minimum 6 per d8. Eliminates bad rolls.' },
  { tip: 'Gift of the Ever-Living Ones', detail: 'Warlock (Chain): max all healing dice when familiar within 100ft. Max HD on short rest.' },
  { tip: 'Song of Rest (Bard)', detail: 'Bard: one party member using HD on short rest heals extra 1d6 (1d8/1d10/1d12 at higher levels).' },
  { tip: 'Chef feat', detail: 'Short rest: PB allies regain 1d8 HP. Plus treats that give temp HP. Solid support feat.' },
  { tip: 'Periapt of Wound Closure', detail: 'Double HP from HD on short rest. With +3 CON: d8 becomes (2×d8)+3. Very efficient.' },
];

export function hitDiceHealing(dieSize, conMod, count = 1, maxRolls = false) {
  const avg = maxRolls ? dieSize : (dieSize / 2 + 0.5);
  return count * (avg + conMod);
}

export function hitDiceRecoveredOnLongRest(totalHitDice) {
  return Math.max(1, Math.floor(totalHitDice / 2));
}

export function exhaustionRemovalOnLongRest(currentExhaustion) {
  return Math.max(0, currentExhaustion - 1);
}
