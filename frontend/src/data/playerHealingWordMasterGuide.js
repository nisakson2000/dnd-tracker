/**
 * playerHealingWordMasterGuide.js
 * Player Mode: Healing Word — the best healing spell in 5e
 * Pure JS — no React dependencies.
 */

export const HEALING_WORD_BASICS = {
  spell: 'Healing Word',
  level: 1,
  school: 'Evocation',
  castTime: '1 bonus action',
  range: '60 feet',
  duration: 'Instantaneous',
  healing: '1d4 + spellcasting mod',
  classes: ['Bard', 'Cleric', 'Druid', 'Alchemist Artificer'],
  note: 'THE most important healing spell. Bonus action, 60ft range, picks up downed allies.',
};

export const WHY_HEALING_WORD_IS_BEST = [
  { reason: 'Bonus action', detail: 'You still get your full action. Attack, cast a cantrip, Dodge, Dash — Healing Word doesn\'t cost you your turn.', rating: 'S' },
  { reason: '60 foot range', detail: 'Don\'t need to be in melee. Don\'t need to run to the downed ally. 60 feet covers most battlefields.', rating: 'S' },
  { reason: 'Picks up at 0 HP', detail: 'Going from 0 to 1 HP is the most important heal in 5e. A conscious ally can Dodge, run, heal themselves.', rating: 'S' },
  { reason: 'Prevents death saves', detail: 'Ally at 0 HP taking hits = death save failures. Healing Word gets them up before that happens.', rating: 'S' },
  { reason: 'Efficient slot usage', detail: 'L1 slot to restore an entire player\'s action economy. Best value in the game.', rating: 'S' },
];

export const HEALING_WORD_VS_CURE_WOUNDS = {
  healingWord: {
    action: 'Bonus action',
    range: '60 feet',
    healing: '1d4 + mod',
    avgL1: '4-7 HP',
    verdict: 'Better in almost every situation',
  },
  cureWounds: {
    action: 'Action',
    range: 'Touch',
    healing: '1d8 + mod',
    avgL1: '6-9 HP',
    verdict: 'Only better out of combat or when you have nothing else to do',
  },
  note: 'The extra 2 HP from Cure Wounds is NOT worth losing your action. Healing Word wins.',
};

export const HEALING_WORD_STRATEGY = [
  { tip: 'Don\'t heal proactively', detail: 'In 5e, healing can\'t keep up with damage. Don\'t heal someone at 20/40 HP. Wait until they drop to 0.', rating: 'S' },
  { tip: 'Yo-yo healing', detail: 'Ally drops to 0 → Healing Word (1 HP) → they take their turn → drop again → Healing Word again. Repeat.', rating: 'S' },
  { tip: 'Save slots for Healing Word', detail: 'Keep at least 2-3 L1 slots reserved for Healing Word. Never burn all your slots on damage spells.', rating: 'S' },
  { tip: 'Pair with action spells', detail: 'Healing Word (BA) + Cantrip (action). Or Healing Word (BA) + Attack (action). Never waste your action.', rating: 'A' },
  { tip: 'Upcast sparingly', detail: 'L2 Healing Word = 2d4 + mod (~7 HP). Marginal gain. Keep upcasting for better spells.', rating: 'A' },
];

export const MASS_HEALING_WORD = {
  spell: 'Mass Healing Word',
  level: 3,
  castTime: '1 bonus action',
  range: '60 feet',
  targets: 'Up to 6 creatures',
  healing: '1d4 + spellcasting mod each',
  note: 'Same logic as Healing Word but picks up the whole party. Incredible for multi-KO situations.',
  when: [
    'Multiple allies at 0 HP simultaneously.',
    'AoE knocked the party out (Fireball, dragon breath).',
    'You need everyone conscious NOW.',
  ],
};

export const HEALING_WORD_MISTAKES = [
  'Healing an ally at full HP — complete waste.',
  'Using Cure Wounds in combat instead of Healing Word.',
  'Burning high-level slots on Healing Word upcast — minimal gain.',
  'Not reserving slots for Healing Word — the most common caster mistake.',
  'Healing someone at 20 HP — they\'re fine. Save the slot.',
  'Running into melee to use Cure Wounds when Healing Word works at 60 feet.',
];

export function healingWordAvg(slotLevel, spellMod) {
  const dice = slotLevel;
  const avg = Math.floor(dice * 2.5 + spellMod);
  return { healing: avg, note: `L${slotLevel} Healing Word: ~${avg} HP (${dice}d4+${spellMod})` };
}
