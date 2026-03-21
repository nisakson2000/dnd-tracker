/**
 * playerMetamagicAdeptFeatGuide.js
 * Player Mode: Metamagic Adept feat — Sorcerer tricks for non-Sorcerers
 * Pure JS — no React dependencies.
 */

export const METAMAGIC_ADEPT_BASICS = {
  feat: 'Metamagic Adept',
  source: "Tasha's Cauldron of Everything",
  prerequisite: 'Spellcasting or Pact Magic feature',
  benefits: [
    'Learn 2 Metamagic options.',
    'Gain 2 sorcery points (only for Metamagic, not Font of Magic).',
    'If you already have Metamagic (Sorcerer), gain 2 additional SP.',
  ],
  note: 'Only 2 SP per long rest. Choose wisely — pick Metamagic that\'s impactful at 1-2 uses per day.',
};

export const BEST_PICKS_NON_SORCERER = [
  {
    metamagic: 'Subtle Spell',
    cost: '1 SP',
    rating: 'S',
    reason: 'Counterspell-proof casting. 2 SP = 2 uncounterable spells per LR. Also great for social casting without detection.',
    bestFor: 'Wizard (counter Counterspell wars), Bard (subtle Suggestion in conversations)',
  },
  {
    metamagic: 'Quickened Spell',
    cost: '2 SP',
    rating: 'A',
    reason: 'Cast a leveled spell as BA + cantrip as action. Only 1 use per LR (2 SP). But that one use can be game-changing.',
    bestFor: 'Any caster wanting a burst turn.',
  },
  {
    metamagic: 'Twinned Spell',
    cost: 'Spell level SP',
    rating: 'A (L1 spells) / C (higher)',
    reason: 'With only 2 SP, you can only Twin L1-L2 spells. Twin Healing Word or Twin Guiding Bolt = good value.',
    bestFor: 'Cleric (Twin Healing Word), any caster with good L1 spells.',
  },
  {
    metamagic: 'Heightened Spell',
    cost: '3 SP',
    rating: 'F (for this feat)',
    reason: 'Costs 3 SP. You only have 2. CANNOT USE THIS with Metamagic Adept alone.',
    bestFor: 'Only if you\'re a Sorcerer getting extra SP.',
  },
  {
    metamagic: 'Empowered Spell',
    cost: '1 SP',
    rating: 'B',
    reason: 'Reroll low damage dice. 2 uses per LR. OK but not impactful enough for a feat.',
    bestFor: 'Blaster Wizards/Clerics who want slightly better Fireball damage.',
  },
  {
    metamagic: 'Careful Spell',
    cost: '1 SP',
    rating: 'B',
    reason: 'Allies auto-succeed on save. Works best with all-or-nothing spells (Hypnotic Pattern). 2 uses per LR.',
    bestFor: 'Wizard casting Hypnotic Pattern without hitting allies.',
  },
];

export const METAMAGIC_ADEPT_FOR_SORCERER = {
  value: 'A',
  reason: '2 extra SP per LR is significant for Sorcerers. Also gets 2 more Metamagic options (Sorcerers only get 2-4 normally).',
  note: 'Sorcerers should strongly consider this feat. More SP + more options = much more flexible.',
};

export const CLASS_VALUE = [
  { class: 'Wizard', rating: 'A', pick: 'Subtle + Quickened or Careful', reason: 'Subtle counters Counterspell. Careful protects allies from AoE.' },
  { class: 'Cleric', rating: 'B+', pick: 'Subtle + Twinned', reason: 'Twin Healing Word saves two allies. Subtle for social spells.' },
  { class: 'Bard', rating: 'A', pick: 'Subtle + Twinned', reason: 'Subtle Suggestion in RP. Twin buff spells.' },
  { class: 'Druid', rating: 'B', pick: 'Subtle + Empowered', reason: 'Subtle for nature stealth casting. Less impactful overall.' },
  { class: 'Warlock', rating: 'B', pick: 'Subtle + Quickened', reason: 'Only 2 slots anyway. Subtle + Quicken for burst turns.' },
  { class: 'Paladin/Ranger', rating: 'C', pick: 'Subtle + Twinned', reason: 'Few spells worth Metamagic. Low priority feat.' },
];
