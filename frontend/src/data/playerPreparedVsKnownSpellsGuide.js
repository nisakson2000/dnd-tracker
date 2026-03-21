/**
 * playerPreparedVsKnownSpellsGuide.js
 * Player Mode: Prepared vs known casters — spell flexibility and management
 * Pure JS — no React dependencies.
 */

export const CASTING_SYSTEMS = {
  prepared: {
    classes: ['Cleric', 'Druid', 'Paladin', 'Wizard', 'Artificer'],
    rule: 'Know your entire class list. Choose which to prepare each long rest.',
    count: 'Usually class level + casting ability modifier.',
    advantage: 'Maximum flexibility. Adapt to tomorrow\'s challenges today.',
    disadvantage: 'Must choose before you know what you\'ll face.',
    tip: 'Always prepare a mix: damage, control, utility, healing.',
  },
  known: {
    classes: ['Sorcerer', 'Bard', 'Ranger', 'Warlock', 'Eldritch Knight', 'Arcane Trickster'],
    rule: 'Learn a fixed number of spells. Can swap 1 per level-up.',
    count: 'Varies: Sorcerer 15, Bard 22, Ranger 11, Warlock 15 (all at L20).',
    advantage: 'No daily management. Always ready.',
    disadvantage: 'Very limited spell selection. Every choice is permanent (mostly).',
    tip: 'Choose versatile spells that work in many situations.',
  },
};

export const SPELL_COUNT_BY_CLASS = [
  { class: 'Wizard', type: 'Prepared', preparedCount: 'Level + INT mod', spellbook: 'Unlimited (if you copy them)', note: 'Best spellcaster. Knows many, prepares some. Copy every scroll.' },
  { class: 'Cleric', type: 'Prepared', preparedCount: 'Level + WIS mod', note: 'Knows ENTIRE cleric list. Prepare what you need. Domain spells always prepared.' },
  { class: 'Druid', type: 'Prepared', preparedCount: 'Level + WIS mod', note: 'Entire druid list. Circle spells always prepared.' },
  { class: 'Paladin', type: 'Prepared', preparedCount: 'Half level + CHA mod', note: 'Half-caster. Fewer slots. Oath spells always prepared.' },
  { class: 'Artificer', type: 'Prepared', preparedCount: 'Half level + INT mod', note: 'Half-caster. Entire artificer list. Subclass spells always prepared.' },
  { class: 'Sorcerer', type: 'Known', knownCount: '15 at L20', note: 'Fewest spells known of any full caster. Every pick matters.' },
  { class: 'Bard', type: 'Known', knownCount: '22 at L20 (with Magical Secrets)', note: 'More known than Sorc. Magical Secrets adds ANY class spells.' },
  { class: 'Ranger', type: 'Known', knownCount: '11 at L20', note: 'Fewest spells of any spellcaster class. Choose wisely.' },
  { class: 'Warlock', type: 'Known', knownCount: '15 at L20', note: 'Few known but few slots (recover on SR). Mystic Arcanum for high-level.' },
  { class: 'Eldritch Knight', type: 'Known', knownCount: '13 at L20', note: 'Mostly abjuration/evocation. Shield + Absorb Elements are musts.' },
  { class: 'Arcane Trickster', type: 'Known', knownCount: '13 at L20', note: 'Mostly enchantment/illusion. Find Familiar is essential.' },
];

export const TASHA_KNOWN_CASTER_IMPROVEMENTS = {
  note: 'Tasha\'s gave extra spells to some known casters through subclass features.',
  beneficiaries: [
    { class: 'Clockwork Soul Sorcerer', extraSpells: '+10 (swappable)', note: 'Nearly doubles spells known. Best sorcerer fix.' },
    { class: 'Aberrant Mind Sorcerer', extraSpells: '+10 (swappable)', note: 'Same as Clockwork. Cast psionically with SP (no components).' },
    { class: 'All Rangers (Tasha\'s optional)', extraSpells: 'Varies by subclass', note: 'Primal Awareness + subclass spells. Major improvement.' },
    { class: 'Fey Wanderer Ranger', extraSpells: '+5', note: 'Always prepared. Nice boost.' },
    { class: 'Swarmkeeper Ranger', extraSpells: '+5', note: 'Always prepared. Great picks.' },
  ],
  stillSuffers: ['PHB Sorcerer subclasses (Draconic, Wild Magic)', 'PHB Ranger', 'PHB Warlock'],
};

export const SPELL_SELECTION_TIPS = [
  'Prepared casters: always include at least 1 healing, 1 control, 1 utility, 1 combat spell.',
  'Known casters: pick spells that work in multiple situations. Web > Tasha\'s Caustic Brew.',
  'Sorcerers: you only get 15 spells. Pick versatile winners: Shield, Counterspell, Fireball, Web, Polymorph.',
  'Rangers: 11 spells total. Must-haves: Goodberry, Pass Without Trace, Absorb Elements.',
  'Wizards: copy EVERY scroll you find. Your spellbook is your greatest asset.',
  'Clerics: change your entire loadout daily. Prepare for what you expect to face.',
  'Swap 1 spell per level-up (known casters). Replace underperforming spells as you grow.',
  'Domain/Oath/Circle spells are ALWAYS prepared and don\'t count against your limit. Free spells.',
];
