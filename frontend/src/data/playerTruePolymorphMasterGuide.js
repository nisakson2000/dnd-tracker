/**
 * playerTruePolymorphMasterGuide.js
 * Player Mode: True Polymorph — permanent transformation
 * Pure JS — no React dependencies.
 */

export const TRUE_POLYMORPH_BASICS = {
  spell: 'True Polymorph',
  level: 9,
  duration: '1 hour (concentration) → PERMANENT after full hour',
  classes: ['Bard', 'Warlock', 'Wizard'],
  modes: ['Creature→Creature', 'Creature→Object', 'Object→Creature'],
};

export const BEST_FORMS = [
  { form: 'Ancient Brass Dragon', cr: 20, rating: 'S+', note: 'Max power. Flight, breath, legendary actions.' },
  { form: 'Adult Gold Dragon', cr: 17, rating: 'S', note: 'Best combat form for most levels.' },
  { form: 'Planetar', cr: 16, rating: 'A+', note: 'Healing, radiant damage, resurrection ability.' },
  { form: 'Iron Golem', cr: 16, rating: 'A+', note: 'Immune to nonmagical attacks. Fire absorption.' },
];

export const KEY_INTERACTIONS = [
  { interaction: 'Permanent after 1 hour', note: 'No concentration needed after. But Dispel Magic still works.' },
  { interaction: 'Dispel Magic', note: 'DC 19 check can end even permanent forms. Main weakness.' },
  { interaction: 'Antimagic Field', note: 'Suppresses transformation temporarily.' },
  { interaction: '0 HP', note: 'Non-permanent: revert. Permanent: DM ruling (may die).' },
];

export const TRUE_POLYMORPH_TIPS = [
  'Turn your Simulacrum into a permanent dragon ally.',
  'Turn a rock into a creature, concentrate 1 hour → permanent creature.',
  'Turn an enemy into an object, lock them away forever.',
  'Beware Dispel Magic — your dragon form is one spell away from ending.',
  'The new form\'s mental stats replace yours. You might forget who you are.',
];
