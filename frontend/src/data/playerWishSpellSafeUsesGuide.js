/**
 * playerWishSpellSafeUsesGuide.js
 * Player Mode: Wish spell — safe uses, risks, and optimization
 * Pure JS — no React dependencies.
 */

export const WISH_BASICS = {
  level: 9, casting: 'Action', components: 'V only',
  classes: ['Wizard', 'Sorcerer', 'Genie Warlock'],
  key: 'Most powerful spell. Risky for creative uses.',
};

export const SAFE_USES = [
  { use: 'Replicate L8 or lower', risk: 'NONE', note: 'No stress. Any class list. No components.' },
  { use: 'Create 25,000 gp object', risk: 'STRESS', note: 'Causes Wish stress but works.' },
  { use: 'Heal 20 creatures to max HP', risk: 'STRESS', note: 'Mass full heal + end effects.' },
  { use: 'Grant permanent resistance', risk: 'STRESS', note: 'Up to 10 creatures. One damage type.' },
];

export const CREATIVE_WISH_RISKS = [
  '33% chance to never cast Wish again.',
  'STR drops to 3 for 2d4 days.',
  '1d10 necrotic per spell level cast until LR.',
  'DM interprets literally. Monkey\'s paw twists.',
];

export const BEST_REPLICATES = [
  { spell: 'Simulacrum (L7)', why: '12h cast → instant. Clone yourself.', rating: 'S+' },
  { spell: 'Forcecage (L7)', why: 'No save, no HP. Trap anything.', rating: 'S+' },
  { spell: 'Resurrection (L7)', why: 'Revive anyone. No body. No components.', rating: 'S+' },
  { spell: 'Clone (L8)', why: 'Backup body. Auto-resurrect.', rating: 'S+' },
  { spell: 'Antimagic Field (L8)', why: 'Shut down all magic in 10ft.', rating: 'S' },
];

export const WISH_TIPS = [
  'Safest: replicate L8 or lower. No risk at all.',
  'Simulacrum via Wish: best safe use. Instant clone.',
  'Creative wishes: DM interprets literally. Be specific.',
  '33% to lose Wish forever on creative uses.',
  'Wish doesn\'t need components. Free Resurrection.',
  'Clone via Wish: instant death insurance.',
  'Don\'t wish for what a L8 spell can do. Just replicate.',
  'Wish + Simulacrum chain: often table-banned.',
];
