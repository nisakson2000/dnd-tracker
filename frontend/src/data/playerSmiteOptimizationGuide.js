/**
 * playerSmiteOptimizationGuide.js
 * Player Mode: Divine Smite optimization — when to smite, slot management
 * Pure JS — no React dependencies.
 */

export const SMITE_RULES = {
  trigger: 'On melee HIT. Declared AFTER seeing hit or crit.',
  damage: '2d8 radiant (L1). +1d8 per slot above 1st. Max 5d8.',
  undead: '+1d8 extra vs undead and fiends.',
  notASpell: 'Not a spell. Can\'t be Counterspelled. Works while raging.',
};

export const SMITE_DAMAGE = [
  { slot: 'L1', dice: '2d8 (avg 9)', vsUndead: '3d8 (13.5)' },
  { slot: 'L2', dice: '3d8 (avg 13.5)', vsUndead: '4d8 (18)' },
  { slot: 'L3', dice: '4d8 (avg 18)', vsUndead: '5d8 (22.5)' },
  { slot: 'L4', dice: '5d8 (avg 22.5) MAX', vsUndead: '6d8 (27)' },
];

export const CRIT_SMITE = {
  how: 'Smite on crit = all dice double.',
  l1Crit: '4d8 (avg 18)',
  l4Crit: '10d8 (avg 45)',
  strategy: 'Save highest slot for crits. Declare AFTER seeing the 20.',
};

export const SMITE_SPELLS = [
  { spell: 'Wrathful Smite (L1)', bonus: '1d6 psychic + frightened', note: 'Best smite spell. Frightened is strong.' },
  { spell: 'Thunderous Smite (L1)', bonus: '2d6 thunder + push/prone', note: 'Push + prone. Good control.' },
  { spell: 'Blinding Smite (L3)', bonus: '3d8 radiant + blinded', note: 'Blinded is devastating.' },
  { spell: 'Banishing Smite (L5)', bonus: '5d10 force + banish <50HP', note: 'Force damage + banishment.' },
];

export const SMITE_MANAGEMENT = {
  smite: ['Not a spell — can\'t be Counterspelled', 'Declared after hit — no waste', 'Works while raging', 'No concentration'],
  spells: ['Bless: +1d4 party-wide', 'Shield of Faith: +2 AC', 'Healing Word: save lives'],
  balance: 'Don\'t smite every hit. Save slots for healing and Bless.',
};

export const SMITE_TIPS = [
  'Declare AFTER seeing hit. No wasted slots.',
  'Save highest slot for crits. Double all dice.',
  'Don\'t smite every hit. Balance with spells.',
  'L1 smite: 2d8 (avg 9). Good on regular hits.',
  'Crit + L4: 10d8 (avg 45). The moment.',
  '+1d8 vs undead/fiends. Always extra radiant.',
  'Not a spell. Can\'t be Counterspelled.',
  'Max 5d8 at L4 slot. L5 doesn\'t add more.',
  'Wrathful Smite: best smite spell (frightened).',
  'Keep 1 slot for Healing Word emergency.',
];
