/**
 * playerDivineSOrcererGuide.js
 * Player Mode: Divine Soul Sorcerer optimization
 * Pure JS — no React dependencies.
 */

export const DIVINE_SOUL_BASICS = {
  class: 'Sorcerer (Divine Soul)',
  keyFeature: 'Access to the ENTIRE Cleric spell list in addition to Sorcerer spells.',
  level1: {
    divineMagic: 'Learn Cleric spells. They count as Sorcerer spells for you.',
    favoredByTheGods: 'Failed save or missed attack? Add 2d4 once per short rest.',
    affinitySpell: 'Free spell based on affinity: Good (Cure Wounds), Evil (Inflict Wounds), Law (Bless), Chaos (Bane), Neutrality (Protection from Evil and Good).',
  },
  level6: { empoweredHealing: 'Reroll healing dice (1 SP). Applies to ANY healing spell you or adjacent ally casts.' },
  level14: { otherworldlyWings: 'Fly speed 30ft. Spectral wings. No concentration.' },
  level18: { unearthlyRecovery: 'When below half HP, bonus action regain HP = half your max.' },
};

export const DIVINE_SOUL_SPELLS = {
  mustHave: [
    { spell: 'Bless', level: 1, source: 'Cleric', note: '+1d4 to attacks and saves for 3 targets. Best 1st level buff in the game.' },
    { spell: 'Spiritual Weapon', level: 2, source: 'Cleric', note: 'Bonus action 1d8+CHA force. No concentration. Free damage every turn.' },
    { spell: 'Spirit Guardians', level: 3, source: 'Cleric', note: '3d8/turn to nearby enemies. Half speed. Sorcerer can Twinned Haste + this.' },
    { spell: 'Guiding Bolt', level: 1, source: 'Cleric', note: '4d6 radiant + advantage on next attack. Great opening.' },
    { spell: 'Healing Word', level: 1, source: 'Cleric', note: 'Bonus action ranged heal. Pick up downed allies.' },
  ],
  sorcererPicks: [
    { spell: 'Shield', level: 1, note: '+5 AC reaction. Essential defense.' },
    { spell: 'Counterspell', level: 3, note: 'Subtle Counterspell can\'t be counterspelled back.' },
    { spell: 'Fireball', level: 3, note: 'Still a Sorcerer. Still need AoE damage.' },
    { spell: 'Polymorph', level: 4, note: 'Twinned Polymorph = two Giant Apes.' },
    { spell: 'Greater Restoration', level: 5, source: 'Cleric', note: 'Cure anything: blinded, charmed, cursed, exhaustion, petrified.' },
  ],
};

export const METAMAGIC_PRIORITY = [
  { metamagic: 'Twinned Spell', cost: 'Spell level SP', note: 'Twin Haste, Twin Polymorph, Twin Greater Invisibility. Broken.', rating: 'S' },
  { metamagic: 'Subtle Spell', cost: '1 SP', note: 'Subtle Counterspell = uncounterable. Subtle Suggestion in social.', rating: 'S' },
  { metamagic: 'Quickened Spell', cost: '2 SP', note: 'Cast Spirit Guardians + Spiritual Weapon turn 1. Or Quicken cantrip + spell.', rating: 'A' },
  { metamagic: 'Empowered Spell', cost: '1 SP', note: 'Reroll low Fireball dice. Cheap damage boost.', rating: 'B' },
  { metamagic: 'Extended Spell', cost: '1 SP', note: 'Extended Aid = 16 hours of max HP boost.', rating: 'B' },
];

export const DIVINE_SOUL_COMBOS = [
  { combo: 'Spirit Guardians + Spiritual Weapon', detail: '3d8 AoE per turn + 1d8+CHA bonus action. Only SG needs concentration.', rating: 'S' },
  { combo: 'Twinned Haste', detail: 'Haste two allies for 3 SP. Double the spell\'s value.', rating: 'S' },
  { combo: 'Subtle Counterspell', detail: 'No verbal/somatic = can\'t be identified as a spell = can\'t be counterspelled.', rating: 'S' },
  { combo: 'Twinned Greater Invisibility', detail: 'Two allies permanently invisible (concentration). Advantage on all attacks.', rating: 'S' },
  { combo: 'Extended Aid', detail: 'Aid lasts 16 hours. +5/+10/+15 max HP for 3 allies. Cast before long rest.', rating: 'A' },
];

export function divineSoulHealingWord(spellLevel, chaMod) {
  return spellLevel * 3.5 + chaMod; // 1d4+CHA per level
}

export function spiritGuardiansDPR(spellLevel, targetCount) {
  const baseDice = spellLevel; // 3d8 at 3rd, 4d8 at 4th, etc.
  return baseDice * 4.5 * targetCount * 0.5; // Assume 50% fail saves
}
