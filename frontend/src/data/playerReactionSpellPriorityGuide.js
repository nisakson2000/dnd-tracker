/**
 * playerReactionSpellPriorityGuide.js
 * Player Mode: Reaction spells ranked — Shield, Absorb Elements, Counterspell, Silvery Barbs
 * Pure JS — no React dependencies.
 */

export const REACTION_RULES = {
  limit: 'One reaction per round. Resets at the start of your turn.',
  trigger: 'Each reaction has a specific trigger condition.',
  timing: 'Reactions interrupt the triggering event (before it resolves for Shield/Counterspell).',
  note: 'Opportunity Attacks also use your reaction. Budget carefully.',
};

export const REACTION_SPELLS_RANKED = [
  {
    spell: 'Shield',
    level: 1,
    rating: 'S+',
    trigger: 'You are hit by an attack or targeted by Magic Missile.',
    effect: '+5 AC until start of your next turn. Blocks Magic Missile entirely.',
    classes: 'Wizard, Sorcerer, Hexblade Warlock',
    tip: 'Wait until you\'re actually hit. Lasts until your next turn = helps vs multiattack.',
  },
  {
    spell: 'Absorb Elements',
    level: 1,
    rating: 'S+',
    trigger: 'You take acid, cold, fire, lightning, or thunder damage.',
    effect: 'Resistance to triggering damage (halved). Next melee hit deals +1d6 of that type.',
    classes: 'Wizard, Sorcerer, Ranger, Artificer, Druid',
    tip: 'Halves dragon breath, Fireball, etc. +1d6 melee bonus is gravy.',
  },
  {
    spell: 'Counterspell',
    level: 3,
    rating: 'S+',
    trigger: 'You see a creature within 60ft casting a spell.',
    effect: 'Auto-counter spells of equal or lower level. Higher = ability check DC 10+spell level.',
    classes: 'Wizard, Sorcerer, Warlock',
    tip: 'Auto-counter at same level. Upcast for guaranteed counter. Abjuration Wizard adds proficiency.',
  },
  {
    spell: 'Silvery Barbs',
    level: 1,
    rating: 'S',
    trigger: 'A creature within 60ft succeeds on an attack, check, or save.',
    effect: 'Force reroll, must use lower result. Give another creature advantage on next roll.',
    classes: 'Wizard, Sorcerer, Bard',
    tip: 'Better than Shield sometimes. Forces reroll on enemy saves too. Controversial — check with DM.',
  },
  {
    spell: 'Hellish Rebuke',
    level: 1,
    rating: 'A',
    trigger: 'You are damaged by a creature within 60ft.',
    effect: '2d10 fire damage (DEX save for half). Scales with upcast.',
    classes: 'Warlock, Tiefling (racial)',
    tip: 'Warlock: limited slots. Shield or Absorb Elements usually better.',
  },
  {
    spell: 'Feather Fall',
    level: 1,
    rating: 'A (situational S+)',
    trigger: 'You or a creature within 60ft falls.',
    effect: 'Falling speed reduced. No fall damage for up to 5 creatures.',
    classes: 'Wizard, Sorcerer, Bard, Artificer',
    tip: 'Always prepare one copy. Saves lives. No material component cost.',
  },
  {
    spell: 'Dispel Magic',
    level: 3,
    rating: 'A',
    trigger: 'Not technically a reaction — but can be readied as one.',
    effect: 'End one spell on a target. Auto for L3 or lower. Check for higher.',
    classes: 'Most casters',
    tip: 'Ready action to Dispel when enemy casts a buff. Costs action + reaction.',
  },
];

export const REACTION_PRIORITY = {
  rule: 'When multiple reactions could trigger, choose based on threat level.',
  priority: [
    '1. Counterspell — stop enemy spells (especially high-level)',
    '2. Shield — survive a hit that would down you',
    '3. Absorb Elements — halve massive elemental damage',
    '4. Silvery Barbs — force reroll on enemy save vs your spell',
    '5. Opportunity Attack — only if damage is significant',
    '6. Hellish Rebuke — retaliatory damage, lowest priority',
  ],
};

export const REACTION_TIPS = [
  'Shield: +5 AC lasts until YOUR next turn. Covers multiattack.',
  'Absorb Elements: halves dragon breath. Always prepare.',
  'Counterspell: auto-counter same level. Upcast for guaranteed.',
  'Silvery Barbs: L1 slot to force reroll. Incredibly efficient.',
  'Only 1 reaction per round. Don\'t waste on OA if you need Shield.',
  'Counterspell range: 60ft. Position to see enemy casters.',
  'Subtle Spell Counterspell: can\'t be counter-counterspelled.',
  'Abjuration Wizard: add proficiency to Counterspell checks.',
  'War Caster: cast spell as OA (Booming Blade, Hold Person).',
  'Feather Fall: always have it prepared. No material cost.',
];
