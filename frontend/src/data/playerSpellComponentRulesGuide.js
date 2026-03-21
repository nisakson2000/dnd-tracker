/**
 * playerSpellComponentRulesGuide.js
 * Player Mode: Spell components — V, S, M explained and casting implications
 * Pure JS — no React dependencies.
 */

export const COMPONENT_TYPES = [
  { type: 'Verbal (V)', description: 'Speaking incantation. Must speak.', blocked: 'Silence spell, gagged.' },
  { type: 'Somatic (S)', description: 'Hand gestures. Free hand needed.', blocked: 'Both hands full without War Caster.' },
  { type: 'Material (M)', description: 'Physical materials. Focus/pouch replaces non-gold-cost materials.', blocked: 'No focus. Gold-cost materials required separately.' },
];

export const FOCUS_OPTIONS = [
  { focus: 'Arcane Focus', users: 'Sorcerer, Warlock, Wizard' },
  { focus: 'Holy Symbol', users: 'Cleric, Paladin (can be on shield)' },
  { focus: 'Druidic Focus', users: 'Druid' },
  { focus: 'Musical Instrument', users: 'Bard' },
  { focus: 'Component Pouch', users: 'Any caster' },
];

export const COSTLY_COMPONENTS = [
  { spell: 'Revivify', cost: '300 gp diamond (consumed)' },
  { spell: 'Raise Dead', cost: '500 gp diamond (consumed)' },
  { spell: 'Resurrection', cost: '1,000 gp diamond (consumed)' },
  { spell: 'True Resurrection', cost: '25,000 gp diamonds (consumed)' },
  { spell: 'Find Familiar', cost: '10 gp (consumed each cast)' },
  { spell: 'Chromatic Orb', cost: '50 gp diamond (NOT consumed)' },
  { spell: 'Heroes\' Feast', cost: '1,000 gp bowl (consumed)' },
  { spell: 'Clone', cost: '3,000 gp total (consumed)' },
  { spell: 'Simulacrum', cost: '1,500 gp ruby dust (consumed)' },
  { spell: 'Wish', cost: 'None! No components at all.' },
];

export const HAND_MANAGEMENT = [
  { method: 'Component Pouch', rule: 'Same hand for M can do S.' },
  { method: 'War Caster feat', rule: 'S with hands full (weapon + shield).' },
  { method: 'Holy Symbol on Shield', rule: 'Covers M. S still needs free hand or War Caster.' },
  { method: 'Drop weapon (free) → cast → pick up', rule: 'RAW legal. Inelegant but works.' },
  { method: 'Ruby of the War Mage', rule: 'Common item. Weapon becomes focus.' },
];

export const SUBTLE_SPELL = {
  cost: '1 sorcery point',
  effect: 'No V or S components.',
  benefits: [
    'Can\'t be Counterspelled (no visible casting).',
    'Cast while gagged or in Silence.',
    'Undetectable casting. Subtle Suggestion = stealth mind control.',
  ],
  rating: 'S+',
};

export const COMPONENT_TIPS = [
  'Focus/pouch replaces ALL materials without gold cost.',
  'Gold-cost materials MUST be provided separately.',
  '"Consumed" = need new one each time.',
  'Always carry a 300gp diamond for Revivify.',
  'War Caster: cast with full hands. Essential for gish builds.',
  'Subtle Spell removes V and S. Undetectable and uncounterable.',
  'Wish has NO components. Not even Verbal.',
  'Ruby of the War Mage: weapon becomes focus. Eldritch Knight essential.',
];
