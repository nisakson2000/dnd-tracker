/**
 * playerSpellSlotBudgetGuide.js
 * Player Mode: Spell slot budgeting — when to spend and when to save
 * Pure JS — no React dependencies.
 */

export const SPELL_SLOTS_BY_LEVEL = {
  note: 'Full casters only. Half-casters get roughly half.',
  fullCaster: [
    { level: 1, slots: '2', highest: 1, note: '2 L1 slots. Every slot matters.' },
    { level: 3, slots: '4/2', highest: 2, note: 'L2 spells. 6 total slots.' },
    { level: 5, slots: '4/3/2', highest: 3, note: 'L3 spells (Fireball). 9 total.' },
    { level: 9, slots: '4/3/3/3/1', highest: 5, note: 'L5 spells. 14 total.' },
    { level: 13, slots: '4/3/3/3/2/1/1', highest: 7, note: 'L7 spells. 17 total.' },
    { level: 17, slots: '4/3/3/3/2/1/1/1/1', highest: 9, note: 'Wish. 20 total.' },
  ],
};

export const SLOT_BUDGET_GUIDE = {
  adventuringDay: 'PHB assumes 6-8 encounters. Most tables do 2-4.',
  budgeting: [
    { encounters: '1-2', strategy: 'Go nova. Spend everything.', caution: 'None.' },
    { encounters: '3-4', strategy: 'Spend freely. Keep 1-2 L1 for Shield.', caution: 'Save top slot for final fight.' },
    { encounters: '5-6', strategy: 'Conservative. Cantrips for easy fights.', caution: 'You will run out.' },
    { encounters: '6-8', strategy: 'Cantrips + short rest recovery. Slots only when needed.', caution: 'Every slot is precious.' },
  ],
};

export const SLOT_SPENDING_PRIORITY = [
  { spell: 'Healing Word (L1)', when: 'Ally at 0 HP', priority: 'Always' },
  { spell: 'Shield (L1)', when: 'Hit by attack', priority: 'High' },
  { spell: 'Counterspell (L3)', when: 'Enemy casts fight-ending spell', priority: 'Very High' },
  { spell: 'Concentration spell', when: 'Start of combat', priority: 'High' },
  { spell: 'Absorb Elements (L1)', when: 'Hit by elemental damage', priority: 'High' },
  { spell: 'Revivify (L3)', when: 'Ally dead within 1 min', priority: 'Maximum' },
];

export const SLOT_RECOVERY = [
  { method: 'Arcane Recovery (Wizard)', slots: 'Half level in slot levels', frequency: '1/LR' },
  { method: 'Natural Recovery (Land Druid)', slots: 'Half level in slot levels', frequency: '1/LR' },
  { method: 'Pact Magic (Warlock)', slots: 'All slots', frequency: 'Short Rest' },
  { method: 'Font of Magic (Sorcerer)', slots: 'SP → slots', frequency: 'Flexible' },
  { method: 'Harness Divine Power', slots: '1 slot ≤ half PB', frequency: 'PB/LR' },
  { method: 'Pearl of Power', slots: '1 slot up to L3', frequency: '1/LR' },
];

export const SPELL_SLOT_TIPS = [
  'Ask your DM how many encounters today. Budget accordingly.',
  'L1 slots for Shield/Absorb Elements/Healing Word. Never regret these.',
  'Don\'t blow highest slot in fight 1 unless it\'s the boss.',
  'Cantrips are free. Use them for easy encounters.',
  'Rituals don\'t cost slots. Use ritual versions whenever possible.',
  'Short rests recover Warlock slots. Push for short rests.',
  'Pearl of Power: extra L3 slot per day. Best uncommon caster item.',
  'If you end the day with slots, you were too conservative.',
  'Concentration spells: 1 slot for 10+ rounds of effect. Most efficient.',
];
