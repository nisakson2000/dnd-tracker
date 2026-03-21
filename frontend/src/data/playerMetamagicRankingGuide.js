/**
 * playerMetamagicRankingGuide.js
 * Player Mode: Sorcerer Metamagic — all options ranked and optimized
 * Pure JS — no React dependencies.
 */

export const METAMAGIC_RANKED = [
  { name: 'Subtle Spell', cost: '1 SP', rating: 'S+', effect: 'No V or S. Can\'t be Counterspelled. Undetectable casting.' },
  { name: 'Twinned Spell', cost: 'spell level SP', rating: 'S', effect: 'Second target. Twin Haste, Polymorph, Banishment.' },
  { name: 'Quickened Spell', cost: '2 SP', rating: 'S', effect: 'Action spell → BA. Hold Person BA → Attack action. Sorlock EB doubling.' },
  { name: 'Heightened Spell', cost: '3 SP', rating: 'A+', effect: 'Disadvantage on first save. Near-guarantees save-or-suck.' },
  { name: 'Empowered Spell', cost: '1 SP', rating: 'A', effect: 'Reroll CHA mod damage dice. Stacks with other metamagics.' },
  { name: 'Transmuted Spell', cost: '1 SP', rating: 'B+', effect: 'Change damage type. Bypass resistance.' },
  { name: 'Careful Spell', cost: '1 SP', rating: 'B+', effect: 'Allies auto-succeed saves. Still take half damage though.' },
  { name: 'Extended Spell', cost: '1 SP', rating: 'B+', effect: 'Double duration. Best for pre-cast buffs.' },
  { name: 'Seeking Spell', cost: '2 SP', rating: 'B', effect: 'Reroll missed attack. Insurance for Disintegrate.' },
  { name: 'Distant Spell', cost: '1 SP', rating: 'B', effect: 'Double range. Touch → 30ft. Niche.' },
];

export const METAMAGIC_PRIORITY = [
  { level: 3, picks: 'Subtle + Twinned', reason: 'Best general picks.' },
  { level: 10, pick: 'Quickened', reason: 'Sorlock EB doubling or Hold Person BA.' },
  { level: 17, pick: 'Heightened or Empowered', reason: 'Heightened for control, Empowered for damage.' },
];

export const METAMAGIC_COMBOS = [
  { combo: 'Subtle + Counterspell', effect: 'Uncounterable counter. Enemy can\'t see you cast.', rating: 'S+' },
  { combo: 'Quickened Hold Person + Attack', effect: 'BA Hold → Action attacks with auto-crits.', rating: 'S+' },
  { combo: 'Twinned Haste', effect: 'Two allies get Haste. Concentration on both.', rating: 'S+' },
  { combo: 'Heightened + save-or-suck', effect: 'Disadvantage on save. Boss more likely to fail.', rating: 'S' },
  { combo: 'Empowered Fireball', effect: 'Reroll up to 5 low dice. +5-10 avg damage.', rating: 'A+' },
  { combo: 'Subtle Suggestion', effect: 'Undetectable mind control. No one sees you cast.', rating: 'S+' },
];

export const METAMAGIC_TIPS = [
  'Subtle Spell first. Most versatile metamagic.',
  'Twinned Haste: the dream. Two buffed allies for 1 spell.',
  'Quickened: leveled spell (BA) + cantrip (action). NOT two leveled spells.',
  'Empowered stacks with other metamagics. Only one that does.',
  'Careful Spell ≠ Sculpt Spells. Allies still take half.',
  'Sorcery Points are precious. Don\'t waste them.',
  'Clockwork/Aberrant Mind: free spells = more SP for metamagic.',
];
