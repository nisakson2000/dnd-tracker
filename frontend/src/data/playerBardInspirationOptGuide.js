/**
 * playerBardInspirationOptGuide.js
 * Player Mode: Bardic Inspiration optimization — when to give, who gets it
 * Pure JS — no React dependencies.
 */

export const BI_RULES = {
  die: 'd6 (L1), d8 (L5), d10 (L10), d12 (L15).',
  uses: 'CHA mod per rest. Font of Inspiration (L5): short rest recovery.',
  action: 'Bonus action. 60ft range.',
  timing: 'Add after roll, before knowing result.',
  duration: '10 minutes.',
};

export const BEST_TARGETS = [
  { target: 'Crucial Saving Throw', priority: 'S+', why: 'Failed save = catastrophic.' },
  { target: 'GWM/SS Attack', priority: 'S', why: 'Offset -5 penalty. Turn miss into +10 hit.' },
  { target: 'Rogue Attack', priority: 'S', why: 'Missing SA = losing all damage.' },
  { target: 'Counterspell Check', priority: 'A+', why: 'Land the counter on high-level spells.' },
  { target: 'Key Ability Check', priority: 'A', why: 'Critical persuasion, trap disarm, grapple.' },
];

export const COLLEGE_FEATURES = [
  { college: 'Lore', feature: 'Cutting Words', rating: 'S', effect: 'Subtract BI from enemy attack/check/damage.' },
  { college: 'Eloquence', feature: 'Unsettling Words', rating: 'S', effect: 'Subtract BI from enemy next save.' },
  { college: 'Glamour', feature: 'Mantle of Inspiration', rating: 'A+', effect: 'Party temp HP + free movement.' },
  { college: 'Valor', feature: 'Combat Inspiration', rating: 'A', effect: 'Add to damage OR AC (reaction).' },
  { college: 'Swords', feature: 'Blade Flourish', rating: 'A', effect: 'Self-use for attack effects.' },
  { college: 'Creation', feature: 'Mote of Potential', rating: 'A', effect: 'Enhanced BI with bonus effects.' },
];

export const BI_TIPS = [
  'Bonus action, 60ft range. Give at combat start.',
  'Use after rolling, before knowing result.',
  'Before L5: save for crucial moments.',
  'After L5: short rest recovery. Use freely.',
  'Give to Rogue for Sneak Attack insurance.',
  'Give to GWM/SS users to offset -5.',
  'Cutting Words: subtract from enemy attacks.',
  'Eloquence: lower enemy saves. Combo setup.',
  'Glamour: party temp HP + repositioning.',
  'BI lasts 10 minutes. Don\'t wait too long.',
];
