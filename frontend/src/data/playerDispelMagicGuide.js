/**
 * playerDispelMagicGuide.js
 * Player Mode: Dispel Magic and Counterspell rules and DCs
 * Pure JS — no React dependencies.
 */

export const DISPEL_MAGIC_RULES = {
  level: 3,
  range: '120 feet',
  casting: 'Action',
  effect: 'Choose one creature, object, or magical effect. Any spell of 3rd level or lower ends.',
  higherLevel: 'For spells of 4th level or higher, make an ability check (DC 10 + spell level).',
  abilityUsed: 'Spellcasting ability modifier.',
  note: 'Targets one spell effect, not all magic on a creature.',
};

export const COUNTERSPELL_RULES = {
  level: 3,
  range: '60 feet',
  casting: 'Reaction (when you see a creature within 60ft casting a spell)',
  effect: 'Spell of 3rd level or lower fails automatically.',
  higherLevel: 'For higher level spells, ability check DC 10 + spell level.',
  upcast: 'Casting at higher level automatically counters spells of that level or lower.',
  important: [
    'You must SEE the creature casting the spell.',
    'Subtle Spell prevents Counterspell (no visible casting).',
    'Counterspell can be counterspelled!',
    'You must identify the spell (Reaction Arcana check DC 15 + spell level) to know what you\'re countering.',
  ],
};

export const ABILITY_CHECK_DCS = [
  { spellLevel: 4, dc: 14 },
  { spellLevel: 5, dc: 15 },
  { spellLevel: 6, dc: 16 },
  { spellLevel: 7, dc: 17 },
  { spellLevel: 8, dc: 18 },
  { spellLevel: 9, dc: 19 },
];

export const CHECK_BONUSES = [
  { source: 'Abjuration Wizard (10th level)', bonus: 'Add proficiency bonus to dispel/counter checks.' },
  { source: 'Jack of All Trades (Bard)', bonus: 'Add half proficiency to the check.' },
  { source: 'Glibness (8th level)', bonus: 'Minimum roll of 15 on CHA checks (if CHA caster).' },
  { source: 'Enhance Ability', bonus: 'Advantage on ability checks.' },
  { source: 'Guidance', bonus: '+1d4 (if cast before reaction... tricky timing).' },
];

export function getDispelDC(targetSpellLevel) {
  if (targetSpellLevel <= 3) return 0; // auto-success
  return 10 + targetSpellLevel;
}

export function willAutoSucceed(castingSlotLevel, targetSpellLevel) {
  return castingSlotLevel >= targetSpellLevel;
}

export function getSuccessChance(modifier, dc) {
  if (dc <= 0) return 100;
  const needed = dc - modifier;
  if (needed <= 1) return 100;
  if (needed > 20) return 0;
  return (21 - needed) * 5;
}
