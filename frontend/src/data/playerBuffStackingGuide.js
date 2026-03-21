/**
 * playerBuffStackingGuide.js
 * Player Mode: Buff spell stacking — what stacks, what doesn't, and optimal combos
 * Pure JS — no React dependencies.
 */

export const BUFF_STACKING_RULES = {
  sameSpell: 'Same spell doesn\'t stack with itself. Only most potent applies.',
  differentSpells: 'DIFFERENT spells DO stack. Bless + Haste = legal.',
  concentration: 'Only ONE concentration spell active. This limits stacking.',
  magicItems: 'Same-named items don\'t stack. Different items DO stack.',
  classFeatures: 'Generally stack unless stated otherwise.',
};

export const TOP_BUFF_SPELLS = [
  { spell: 'Bless', level: 1, concentration: true, effect: '+1d4 attacks + saves (3 targets)', rating: 'S+', note: 'Best L1 buff. +2.5 avg to hit and save.' },
  { spell: 'Haste', level: 3, concentration: true, effect: '+2 AC, double speed, extra action (1 target)', rating: 'S+', note: 'Massive buff. WARNING: losing concentration = target loses a turn.' },
  { spell: 'Shield of Faith', level: 1, concentration: true, effect: '+2 AC (1 target)', rating: 'A+', note: 'Simple. BA cast. Good on tanks.' },
  { spell: 'Aid', level: 2, concentration: false, effect: '+5 max HP to 3 targets (scales +5/slot)', rating: 'S', note: 'Not concentration. Stacks with everything. Upcast for more HP.' },
  { spell: 'Heroism', level: 1, concentration: true, effect: 'Temp HP = CHA mod each turn + immune frightened', rating: 'A+', note: 'Paladin/Bard. Temp HP refreshes each turn.' },
  { spell: 'Holy Weapon', level: 5, concentration: true, effect: '+2d8 radiant per hit', rating: 'S', note: 'Martial buffer. 2d8 per hit is massive.' },
  { spell: 'Greater Invisibility', level: 4, concentration: true, effect: 'Invisible. Advantage on attacks, disadvantage to be hit.', rating: 'S+', note: 'Best single-target buff. Invisible while attacking.' },
];

export const BUFF_COMBOS = [
  {
    combo: 'Bless + Haste (different casters)',
    effect: '+1d4 hit + extra action + 2 AC + double speed',
    note: 'Two different concentration spells. Two casters needed.',
    rating: 'S+',
  },
  {
    combo: 'Aid + Bless',
    effect: '+5 HP (not concentration) + 1d4 hit/saves',
    note: 'Aid is not concentration. One caster can do both.',
    rating: 'S',
  },
  {
    combo: 'Haste + Holy Weapon (different casters)',
    effect: 'Extra action + 2d8 per hit',
    note: 'Extra attacks + massive bonus damage per hit.',
    rating: 'S+',
  },
  {
    combo: 'Paladin Aura + Bless',
    effect: '+CHA all saves (passive) + 1d4 saves (Bless)',
    note: 'Aura is not a spell. Stacks with everything.',
    rating: 'S+',
  },
  {
    combo: 'Bardic Inspiration + Bless',
    effect: '+1d6-1d12 + 1d4 on key roll',
    note: 'Different sources. Stack on important checks/saves.',
    rating: 'S',
  },
];

export const BUFF_PRIORITY_ORDER = [
  { priority: 1, spell: 'Bless', reason: 'Multi-target. +hit AND saves. L1 slot.' },
  { priority: 2, spell: 'Haste', reason: 'Biggest single-target buff. But risky (lose a turn on break).' },
  { priority: 3, spell: 'Aid', reason: 'No concentration. +HP stacks with concentration buffs.' },
  { priority: 4, spell: 'Greater Invisibility', reason: 'Advantage + can\'t be targeted. Best on Rogue.' },
  { priority: 5, spell: 'Holy Weapon', reason: '+2d8 per hit. Best on multi-attack martials.' },
];

export const BUFF_TIPS = [
  'Bless: best buff/slot ratio. +1d4 to 3 allies\' attacks + saves.',
  'Haste: WARNING. Losing concentration = target loses NEXT turn.',
  'Aid: NOT concentration. Stack it with Bless or Haste.',
  'Same spell doesn\'t stack. Two Bless = only one counts.',
  'Different spells stack. Bless + Shield of Faith = +1d4 hit + 2 AC.',
  'Paladin Aura: not a spell. Stacks with ALL spell buffs.',
  'Buff the martial. Haste on Fighter = 3+ extra attacks per turn.',
  'Greater Invisibility on Rogue = guaranteed Sneak Attack + hard to hit.',
  'Concentration is the bottleneck. Spread buff duty across casters.',
  'Holy Weapon on Monk: +2d8 per hit × 4 attacks = +8d8 damage/turn.',
];
