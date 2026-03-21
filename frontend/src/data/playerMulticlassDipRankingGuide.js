/**
 * playerMulticlassDipRankingGuide.js
 * Player Mode: Best multiclass dips — 1-3 level investments ranked
 * Pure JS — no React dependencies.
 */

export const TOP_DIPS = [
  { dip: 'Hexblade 1', rating: 'S+', prereq: 'CHA 13', gains: 'CHA weapons, medium armor + shields, Hex, Shield, Curse', bestFor: 'Paladin, Sorcerer, Bard' },
  { dip: 'Warlock 2', rating: 'S+', prereq: 'CHA 13', gains: '2 invocations (Agonizing+Repelling), 2 SR slots', bestFor: 'Sorcerer (Sorlock), any CHA caster' },
  { dip: 'Fighter 1', rating: 'S', prereq: 'STR/DEX 13', gains: 'CON saves, Fighting Style, Second Wind, all armor', bestFor: 'Any caster wanting armor + CON saves' },
  { dip: 'Fighter 2', rating: 'S+', prereq: 'STR/DEX 13', gains: 'Action Surge (extra action)', bestFor: 'Any class. 2 spells in 1 turn for casters.' },
  { dip: 'Paladin 2', rating: 'S', prereq: 'STR+CHA 13', gains: 'Divine Smite, Fighting Style, Lay on Hands', bestFor: 'Sorcerer (Sorcadin), melee CHA classes' },
  { dip: 'Cleric 1', rating: 'A+', prereq: 'WIS 13', gains: 'Domain features (heavy armor), Healing Word, Guidance', bestFor: 'Druid (heavy armor), any WIS class' },
  { dip: 'Rogue 1', rating: 'A+', prereq: 'DEX 13', gains: '1d6 SA, 2 expertise, 4 skills, thieves\' tools', bestFor: 'Ranger, Fighter, skill-hungry builds' },
  { dip: 'Barbarian 1', rating: 'A', prereq: 'STR 13', gains: 'Rage (resistance+damage), Unarmored Defense', bestFor: 'Moon Druid (rage in Wild Shape), STR melee' },
  { dip: 'Artificer 1', rating: 'A', prereq: 'INT 13', gains: 'CON saves, medium armor+shields, infusions', bestFor: 'Wizard wanting armor + CON saves (INT synergy)' },
];

export const MULTICLASS_WARNINGS = [
  'Don\'t delay Extra Attack (L5). It\'s the biggest martial power spike.',
  'Caster levels lost = higher spell slots delayed. Consider carefully.',
  'Both classes must meet ability prerequisites (13 minimum).',
  'Monoclass is often better. Only multiclass with a specific build goal.',
  'PB scales on total level. Multiclassing doesn\'t slow it.',
];

export const MULTICLASS_TIPS = [
  'Dip AFTER reaching your primary class breakpoint (L5, L6, or L11).',
  'CHA classes synergize best: Paladin/Warlock/Sorcerer/Bard all share CHA.',
  'Action Surge (Fighter 2) is worth it on literally any build.',
  'Hexblade 1 on Paladin: CHA attacks + medium armor + shield + SR slots.',
  'Life Cleric 1 + Druid X: Goodberry heals 4 per berry (40 HP per L1 slot).',
];
