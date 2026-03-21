/**
 * playerSorlockBuildGuide.js
 * Player Mode: Sorlock (Sorcerer + Warlock) multiclass build guide
 * Pure JS — no React dependencies.
 */

export const SORLOCK_OVERVIEW = {
  name: 'Sorlock',
  classes: 'Sorcerer X / Warlock 2-3',
  role: 'Ranged DPR machine with sustained blasting',
  playstyle: 'Eldritch Blast + Agonizing Blast + Quickened Spell = 4+ beams per round',
  rating: 'S',
  note: 'The most efficient blaster build in 5e. Consistent, sustainable, devastating.',
};

export const SORLOCK_PROGRESSION = [
  { level: '1 (Sorc 1)', action: 'Start Sorcerer for CON save proficiency. Pick origin.', note: 'CON saves = concentration protection. Critical.' },
  { level: '2 (Sorc 2)', action: 'Font of Magic. Sorcery Points.', note: 'Foundation for metamagic later.' },
  { level: '3 (Sorc 3)', action: 'Metamagic: Quickened Spell + Twinned Spell.', note: 'Core combo online at L3.' },
  { level: '4 (Sorc 3 / Warlock 1)', action: 'Warlock dip. Hexblade recommended for CHA attacks + Shield + medium armor.', note: 'Hexblade\'s Curse + Shield access.' },
  { level: '5 (Sorc 3 / Warlock 2)', action: 'Agonizing Blast + Repelling Blast (or Devil\'s Sight).', note: 'EB now adds CHA to each beam. Core DPR online.' },
  { level: '6+ (Sorc X / Warlock 2)', action: 'All remaining levels in Sorcerer. More SP, higher spells, better origin features.', note: 'Sorcerer spell progression is too important to delay further.' },
  { level: 'Alt: Warlock 3', action: 'Pact of the Chain (Gift of the Ever-Living Ones) or Tome (rituals).', note: 'Optional 3rd Warlock level. Delays Sorc but adds utility.' },
];

export const SORLOCK_CORE_COMBO = {
  round1: 'Hex (BA) → Eldritch Blast (Action): 2 beams × (1d10+CHA+1d6) each',
  round2plus: 'Quickened EB (BA) → EB (Action): 4 beams × (1d10+CHA+1d6) each',
  damageL5: {
    normal: '2 × (5.5+4+3.5) = 26 DPR (Hex + EB)',
    quickened: '4 × (5.5+4+3.5) = 52 DPR (Quickened + regular EB)',
  },
  damageL11: {
    quickened: '6 × (5.5+5+3.5) = 84 DPR with 3 beams per cast',
  },
  note: 'Quickened EB turns your bonus action into a full EB. No other build does this.',
};

export const SORLOCK_SORCERER_ORIGINS = [
  { origin: 'Clockwork Soul', rating: 'S', note: 'Restore Balance cancels advantage/disadvantage. Expanded spells include Aid, Wall of Force. Best utility.' },
  { origin: 'Aberrant Mind', rating: 'S', note: 'Psionic Spells (subtle, SP cost). Hunger of Hadar, Summon Aberration free. Best for subtle casting.' },
  { origin: 'Divine Soul', rating: 'A+', note: 'Cleric spell list access. Healing, Spirit Guardians, Bless. Best for party support.' },
  { origin: 'Shadow Magic', rating: 'A', note: 'Darkness + Devil\'s Sight combo. Hound of Ill Omen forces disadvantage on saves.' },
  { origin: 'Draconic Bloodline', rating: 'B+', note: 'AC 13+DEX (no armor needed). Elemental affinity for specific damage spells.' },
];

export const SORLOCK_TIPS = [
  'Start Sorcerer 1 for CON save proficiency — this is non-negotiable.',
  'Hexblade is the best Warlock patron for Sorlock. Medium armor + Shield spell + CHA attacks.',
  'Warlock spell slots recover on SR — convert them to Sorcery Points (Coffeelock concept, check with DM).',
  'Quickened EB is your bread and butter. Save SP for this.',
  'Don\'t take more than 2-3 Warlock levels. Sorcerer progression is too valuable.',
  'Repelling Blast + Quickened EB = push enemies 40+ feet per round.',
  'Agonizing Blast is mandatory. Without it, EB damage is mediocre.',
];

export const COFFELOCK_WARNING = {
  concept: 'Convert Warlock SR slots to Sorcery Points → never long rest → accumulate infinite SP.',
  ruling: 'Most DMs ban this. Xanathar\'s exhaustion rules for skipping long rests effectively kill it.',
  verdict: 'Don\'t try this without explicit DM approval. It breaks the game.',
};
