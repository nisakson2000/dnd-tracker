/**
 * playerClassDipGuide.js
 * Player Mode: Best 1-3 level class dips — what you get and when to dip
 * Pure JS — no React dependencies.
 */

export const BEST_ONE_LEVEL_DIPS = [
  { class: 'Hexblade Warlock 1', get: 'Medium armor, shields, CHA weapon, Hex, Hexblade\'s Curse.', rating: 'S+', bestFor: ['Sorcerer', 'Bard', 'Paladin'], note: 'Best 1-level dip in 5e.' },
  { class: 'Cleric 1 (any domain)', get: 'Heavy armor (some), shields, Healing Word, Guidance, domain spells.', rating: 'S+', bestFor: ['Wizard', 'Druid', 'Ranger'], note: 'Life/Forge/Twilight domains especially.' },
  { class: 'Fighter 1', get: 'Heavy armor, shields, all weapons, Fighting Style, Second Wind.', rating: 'S', bestFor: ['Any caster needing armor'], note: 'CON save proficiency if you start Fighter.' },
  { class: 'Artificer 1', get: 'Medium armor, shields, tools, CON save proficiency, cantrips.', rating: 'A+', bestFor: ['Wizard'], note: 'Start Artificer for CON saves, then Wizard.' },
  { class: 'Rogue 1', get: 'Expertise ×2, Sneak Attack 1d6, Thieves\' Tools.', rating: 'A', bestFor: ['Bard', 'Ranger'], note: 'Expertise + skills. Good utility dip.' },
];

export const BEST_TWO_LEVEL_DIPS = [
  { class: 'Fighter 2', get: 'Everything from 1 + Action Surge.', rating: 'S+', bestFor: ['Any class'], note: 'Action Surge = extra Action 1/SR. Best 2-level dip.' },
  { class: 'Warlock 2', get: 'Warlock 1 + 2 Invocations (Agonizing Blast + 1), 2 slots/SR.', rating: 'S+', bestFor: ['Sorcerer'], note: 'EB + Agonizing Blast. SR slot recovery.' },
  { class: 'Paladin 2', get: 'Paladin 1 + Divine Smite + Fighting Style + spellcasting.', rating: 'S', bestFor: ['Warlock', 'Sorcerer'], note: 'Smites on any melee hit. Use short rest slots.' },
  { class: 'Ranger 2 (Tasha\'s)', get: 'Ranger 1 + Fighting Style + Spellcasting.', rating: 'A', bestFor: ['Rogue'], note: 'Archery fighting style + spell utility.' },
];

export const BEST_THREE_LEVEL_DIPS = [
  { class: 'Warlock 3', get: 'Warlock 2 + Pact Boon (Chain = invisible familiar).', rating: 'S', bestFor: ['Sorcerer'], note: 'Chain Pact: invisible Imp. Gift of the Ever-Living Ones.' },
  { class: 'Fighter 3 (Battle Master)', get: 'Fighter 2 + Subclass. BM: superiority dice.', rating: 'S', bestFor: ['Rogue', 'Ranger'], note: 'Maneuvers add versatility.' },
  { class: 'Fighter 3 (Echo Knight)', get: 'Fighter 2 + Echo. Attack from 30ft away.', rating: 'S+', bestFor: ['Rogue', 'Barbarian'], note: 'Echo = sentinel at range. Rogue SA from echo.' },
  { class: 'Rogue 3 (Swashbuckler/Arcane Trickster)', get: 'Rogue 2 + Subclass.', rating: 'A+', bestFor: ['Fighter', 'Ranger'], note: 'Swashbuckler: CHA to initiative + easy SA.' },
  { class: 'Sorcerer 3', get: 'Sorcerer 2 + Metamagic ×2 + Font of Magic.', rating: 'A+', bestFor: ['Warlock'], note: 'Quickened EB. Convert Warlock slots to SP.' },
];

export const DIP_TIMING = {
  earlyDip: { when: 'L1-3', pros: 'Early armor/defensive gains. CON saves if starting class.', cons: 'Delays core features (Extra Attack, L3 spells).' },
  midDip: { when: 'L5-8', pros: 'After getting core features. Less painful delay.', cons: 'Miss ASI at main class level.' },
  lateDip: { when: 'L9+', pros: 'Core features secured. Dip is pure bonus.', cons: 'Delays higher-level spells/features.' },
  rule: 'Never dip before getting your class\'s core feature (Extra Attack, L3 spells, etc.).',
};

export const CLASS_DIP_TIPS = [
  'Hexblade 1: best single-level dip. CHA weapon + armor + shield.',
  'Fighter 2: Action Surge. Best 2-level dip for any class.',
  'Start Fighter or Artificer for CON save proficiency, then switch.',
  'Never dip before L5 unless you know what you\'re doing.',
  'Paladin 2 dip: Divine Smite on any melee hit. Warlock slots fuel it.',
  'Cleric 1: heavy armor + Healing Word + Guidance. Any caster benefits.',
  'Echo Knight 3: attack from 30ft. Rogue can SA from echo position.',
  'Don\'t dip more than 3 levels unless you\'re building a multiclass.',
  'Fighter 1 start for CHA casters: heavy armor + CON saves.',
  'Consider what you DELAY by dipping. ASIs and spells matter.',
];
