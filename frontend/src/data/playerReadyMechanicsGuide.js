/**
 * playerReadyMechanicsGuide.js
 * Player Mode: Ready action — rules, uses, costs
 * Pure JS — no React dependencies.
 */

export const READY_RULES = {
  cost: 'Action to set up + Reaction to execute.',
  trigger: 'Define perceivable trigger.',
  spells: 'Slot spent immediately. Concentration required. Lost if not triggered.',
  extraAttack: 'Only ONE attack on reaction (no Extra Attack).',
  bonusAction: 'Cannot ready a Bonus Action.',
};

export const BEST_USES = [
  { use: 'Ready Counterspell (out of range)', rating: 'S' },
  { use: 'Ready attack for emerging enemies', rating: 'A+' },
  { use: 'Ready Healing Word for ally dropping', rating: 'A+' },
  { use: 'Ready movement through opening', rating: 'A' },
];

export const MISTAKES = [
  'Readied spells cost slot even if never triggered.',
  'Non-concentration spells still need concentration when readied.',
  'Extra Attack doesn\'t work on readied attacks.',
  'Can\'t ready Bonus Actions.',
  'Acting now beats readying in most situations.',
];

export const READY_TIPS = [
  'Only ready when timing genuinely matters.',
  'Readied spells are expensive. Avoid if possible.',
  'You can choose NOT to use readied action on trigger.',
  'War Caster: OAs can be spells (different from Ready but related).',
];
