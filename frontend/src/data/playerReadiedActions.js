/**
 * playerReadiedActions.js
 * Player Mode: Ready action rules and common triggers
 * Pure JS — no React dependencies.
 */

export const READY_ACTION_RULES = {
  action: 'Uses your action to set up a trigger and reaction.',
  trigger: 'You specify a perceivable trigger that will cause you to react.',
  reaction: 'When the trigger occurs, you use your reaction to take the readied action.',
  spellReady: {
    casting: 'You cast the spell on your turn (using the slot immediately).',
    concentration: 'You hold the spell with concentration until the trigger.',
    release: 'If the trigger occurs, you release the spell as your reaction.',
    lost: 'If the trigger never occurs or you lose concentration, the spell slot is wasted.',
  },
  important: [
    'Uses your action AND your reaction.',
    'The trigger must be perceivable (you must be able to see/hear it).',
    'You can choose NOT to react when the trigger occurs.',
    'Readied spells require concentration to hold — may drop existing concentration.',
    'Readied attacks are NOT part of the Attack action — no Extra Attack.',
  ],
};

export const COMMON_TRIGGERS = [
  'When a creature moves within my reach',
  'When a creature comes around the corner',
  'When an enemy casts a spell',
  'When the door opens',
  'When my ally attacks the target',
  'When the creature tries to flee',
  'When the enemy drops below half health',
  'When I see an enemy use a specific ability',
  'When the enemy enters the area of my spell',
  'When I hear the signal from my ally',
];

export const READY_ACTION_TEMPLATE = {
  trigger: '',
  action: '',
  isSpell: false,
  spellName: null,
  spellLevel: null,
  requiresConcentration: false,
  active: true,
};

export function createReadiedAction(trigger, action, isSpell = false, spellName = null, spellLevel = null) {
  return {
    ...READY_ACTION_TEMPLATE,
    trigger,
    action,
    isSpell,
    spellName,
    spellLevel,
    requiresConcentration: isSpell,
  };
}
