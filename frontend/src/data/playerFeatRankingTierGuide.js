/**
 * playerFeatRankingTierGuide.js
 * Player Mode: All feats ranked by tier
 * Pure JS — no React dependencies.
 */

export const S_TIER_FEATS = [
  { feat: 'Great Weapon Master', type: 'Combat', effect: '-5/+10 heavy weapons. BA on crit/kill.' },
  { feat: 'Sharpshooter', type: 'Combat', effect: '-5/+10 ranged. Ignore cover. No long range disadvantage.' },
  { feat: 'Polearm Master', type: 'Combat', effect: 'BA d4 attack. OA on entering reach.' },
  { feat: 'Sentinel', type: 'Combat', effect: 'OA stops movement. OA on ally attack. OA on Disengage.' },
  { feat: 'Lucky', type: 'Universal', effect: '3 rerolls/LR on any d20.' },
  { feat: 'War Caster', type: 'Caster', effect: 'Advantage concentration. Spell as OA.' },
  { feat: 'Resilient (CON)', type: 'Caster', effect: '+1 CON. Proficiency CON saves.' },
  { feat: 'Crossbow Expert', type: 'Combat', effect: 'BA hand crossbow. No melee disadvantage.' },
];

export const A_TIER_FEATS = [
  { feat: 'Alert', effect: '+5 initiative. Can\'t be surprised.' },
  { feat: 'Fey Touched', effect: '+1. Free Misty Step + spell 1/LR.' },
  { feat: 'Shadow Touched', effect: '+1. Free Invisibility + spell 1/LR.' },
  { feat: 'Skill Expert', effect: '+1. 1 proficiency + 1 expertise.' },
  { feat: 'Elven Accuracy', effect: '+1. Triple advantage (14.3% crit).' },
  { feat: 'Shield Master', effect: 'BA shove. Shield bonus to DEX saves.' },
  { feat: 'Inspiring Leader', effect: 'CHA+level temp HP to 6 allies/SR.' },
  { feat: 'Telekinetic', effect: '+1. Invisible Mage Hand. BA push 5ft.' },
  { feat: 'Tough', effect: '+2 HP per level.' },
];

export const B_TIER_FEATS = [
  { feat: 'Dual Wielder', effect: '+1 AC. Non-light TWF. Draw 2.' },
  { feat: 'Medium Armor Master', effect: '+3 DEX medium armor. No stealth disadvantage.' },
  { feat: 'Mobile', effect: '+10 speed. No OAs from attacked creatures.' },
  { feat: 'Observant', effect: '+5 passive Perception and Investigation.' },
  { feat: 'Ritual Caster', effect: 'Learn ritual spells from any class.' },
  { feat: 'Chef', effect: '+1. Cook temp HP snacks. Party support.' },
  { feat: 'Metamagic Adept', effect: '2 Metamagic options + 2 SP.' },
];

export const FEAT_SELECTION_TIPS = [
  'GWM/SS: mandatory for damage builds. -5/+10 with advantage.',
  'PAM+Sentinel: best lock-down combo. OA on enter reach + speed 0.',
  'Lucky: best universal feat. 3 d20 rerolls per day.',
  'Max primary stat to 20 BEFORE taking most feats.',
  'Half-feats (+1): take at odd scores to round up.',
  'War Caster early, Resilient (CON) late. Crossover at ~L9.',
  'Fey Touched: best half-feat. Free Misty Step for anyone.',
  'CBE+SS: best ranged DPR combo.',
  'Alert: going first wins encounters.',
];
