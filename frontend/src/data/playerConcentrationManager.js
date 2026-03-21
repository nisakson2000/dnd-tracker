/**
 * playerConcentrationManager.js
 * Player Mode: Active concentration spell manager with save tracking
 * Pure JS — no React dependencies.
 */

export const CONCENTRATION_RULES = {
  limit: 'Only ONE concentration spell at a time. Casting a new one ends the old one.',
  saveTrigger: 'When you take damage while concentrating.',
  saveDC: 'DC = 10 or half the damage taken, whichever is HIGHER.',
  save: 'Constitution saving throw.',
  multipleDamage: 'Multiple damage sources in one turn = separate saves for each.',
  unconscious: 'Dropping to 0 HP = concentration automatically broken.',
  voluntary: 'You can end concentration at any time (no action required).',
};

export const CONCENTRATION_PROTECTION = [
  { source: 'War Caster feat', effect: 'Advantage on concentration saves.', rating: 'S', note: 'Also: cast with full hands, spell as OA.' },
  { source: 'Resilient (CON)', effect: 'Add proficiency to CON saves.', rating: 'S', note: 'Better than War Caster at high levels (17+).' },
  { source: 'Both (War Caster + Resilient)', effect: 'Advantage + proficiency. Nearly impossible to fail.', rating: 'S+', note: 'The gold standard for serious concentrators.' },
  { source: 'Bladesong (Wizard)', effect: 'Add INT mod to concentration saves.', rating: 'A', note: 'Stacks with proficiency.' },
  { source: 'Aura of Protection (Paladin)', effect: 'Add CHA mod to ALL saves within 10ft.', rating: 'A', note: 'Helps the whole party maintain concentration.' },
  { source: 'Mind Blank (8th)', effect: 'Immune to psychic damage = no concentration from psychic.', rating: 'Niche', note: 'Only relevant vs psychic damage sources.' },
  { source: 'Ring of Spell Storing', effect: 'Give your concentration spell to an ally to maintain.', rating: 'A', note: 'Effectively 2 concentration spells at once!' },
];

export const TOP_CONCENTRATION_SPELLS = [
  { spell: 'Bless', level: 1, rating: 'S', tip: '+1d4 to ALL attacks and saves for 3 targets.' },
  { spell: 'Hex / Hunter\'s Mark', level: 1, rating: 'A', tip: '+1d6 per hit. Transfers on kill.' },
  { spell: 'Spirit Guardians', level: 3, rating: 'S', tip: '3d8 to everything near you. Cleric\'s best spell.' },
  { spell: 'Haste', level: 3, rating: 'A', tip: 'HUGE buff but losing concentration = target loses next turn (lethargy).' },
  { spell: 'Polymorph', level: 4, rating: 'S', tip: 'Giant Ape = 157 HP buffer. Losing concentration = revert (not terrible).' },
  { spell: 'Wall of Force', level: 5, rating: 'S', tip: 'Indestructible. Losing concentration = wall drops. Protect caster!' },
  { spell: 'Hypnotic Pattern', level: 3, rating: 'S', tip: 'Enemies stay incapacitated until shaken. No repeated saves!' },
];

export function calculateConcentrationDC(damageTaken) {
  return Math.max(10, Math.floor(damageTaken / 2));
}

export function willPassSave(conSaveMod, dc, hasAdvantage) {
  const needed = dc - conSaveMod;
  if (needed <= 1) return { chance: '100%', safe: true };
  const baseChance = Math.max(5, Math.min(95, (21 - needed) * 5));
  const advChance = 100 - ((100 - baseChance) * (100 - baseChance)) / 100;
  const finalChance = hasAdvantage ? Math.round(advChance) : baseChance;
  return { chance: `${finalChance}%`, safe: finalChance >= 75 };
}

export function createConcentrationState(spellName, saveMod) {
  return {
    spell: spellName,
    startRound: null,
    saveMod,
    savesMade: 0,
    savesFailed: 0,
    totalDamageTaken: 0,
    active: true,
  };
}
