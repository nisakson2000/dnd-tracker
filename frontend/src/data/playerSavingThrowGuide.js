/**
 * playerSavingThrowGuide.js
 * Player Mode: Saving throw optimization and defense strategies
 * Pure JS — no React dependencies.
 */

export const SAVING_THROWS = [
  { save: 'STR', frequency: 'Uncommon', dangerLevel: 'Low', commonEffects: ['Shoved prone', 'Pushed/pulled', 'Restrained (some)'], counters: ['Advantage from Enlarge', 'Barbarian Rage (advantage on STR checks)', 'Athletics proficiency helps related checks'], note: 'Least targeted save. Safe to have low STR unless you\'re a grappler.' },
  { save: 'DEX', frequency: 'Very Common', dangerLevel: 'High', commonEffects: ['Fireball (8d6)', 'Lightning Bolt', 'Dragon breath', 'Traps'], counters: ['Evasion (Rogue/Monk): 0 damage on success', 'Shield Master: add shield AC to DEX saves', 'Absorb Elements: halve + gain element'], note: 'The #1 damage save. Most AoE uses DEX. Evasion is incredible.' },
  { save: 'CON', frequency: 'Common', dangerLevel: 'Medium', commonEffects: ['Concentration checks', 'Poison', 'Exhaustion', 'Polymorph (maintain form)'], counters: ['War Caster (advantage on concentration)', 'Resilient CON (proficiency)', 'Paladin Aura of Protection'], note: 'Critical for casters (concentration). Important for everyone (HP and poison).' },
  { save: 'INT', frequency: 'Rare', dangerLevel: 'Medium', commonEffects: ['Mind Flayer Mind Blast', 'Phantasmal Force', 'Psychic damage'], counters: ['Very few bonuses available', 'Gnome Cunning (advantage vs magic INT saves)'], note: 'Rarest save. BUT when it matters, it REALLY matters (Mind Flayers = instant stun).' },
  { save: 'WIS', frequency: 'Very Common', dangerLevel: 'Very High', commonEffects: ['Charm', 'Fear', 'Hold Person', 'Dominate', 'Banishment'], counters: ['Elves: advantage vs charm (Fey Ancestry)', 'Stillness of Mind (Monk)', 'Devotion Paladin: immunity to charm', 'Heroes\' Feast: immune to fear + poison'], note: 'THE most dangerous save to fail. Failing WIS = you fight your own party. Prioritize WIS saves.' },
  { save: 'CHA', frequency: 'Uncommon', dangerLevel: 'High', commonEffects: ['Banishment', 'Zone of Truth', 'Calm Emotions', 'Planar Binding'], counters: ['Paladin Aura (+CHA to all saves nearby)', 'High CHA classes naturally good at this'], note: 'Banishment is the big one. Failing CHA save vs Banishment = removed from combat for 1 minute.' },
];

export const SAVE_PROFICIENCY = {
  strong: {
    STR: ['Fighter', 'Barbarian', 'Ranger', 'Monk'],
    DEX: ['Rogue', 'Ranger', 'Monk', 'Bard'],
    CON: ['Fighter', 'Barbarian', 'Sorcerer', 'Artificer'],
    INT: ['Wizard', 'Artificer', 'Rogue', 'Druid'],
    WIS: ['Cleric', 'Druid', 'Paladin', 'Warlock', 'Wizard', 'Ranger', 'Monk'],
    CHA: ['Bard', 'Sorcerer', 'Warlock', 'Paladin'],
  },
  note: 'Each class gets one "strong" save (DEX/CON/WIS) and one "weak" save (STR/INT/CHA).',
};

export const SAVE_BOOSTERS = [
  { source: 'Paladin Aura of Protection', bonus: '+CHA mod to ALL saves (10ft/30ft)', rating: 'S', note: 'Applies to EVERYONE in range. The strongest save booster in the game.' },
  { source: 'Bless', bonus: '+1d4 to saves and attacks', rating: 'A', note: 'Concentration. Affects 3 creatures. Huge for its level.' },
  { source: 'Ring/Cloak of Protection', bonus: '+1 to ALL saves + AC', rating: 'A', note: 'Always-on. No concentration. Requires attunement.' },
  { source: 'Resilient (feat)', bonus: 'Proficiency in one save', rating: 'A', note: 'Best for CON (casters) or WIS (martials). Scales with level.' },
  { source: 'Heroes\' Feast', bonus: 'Immune to fear + poison. +2d10 max HP. Advantage on WIS saves', rating: 'S', note: '6th level. Lasts 24 hours. Affects up to 13 creatures. Pre-boss fight essential.' },
  { source: 'Lucky feat', bonus: 'Reroll any d20 (3/day)', rating: 'A', note: 'Works on saves. Save your lucky points for the scary saves.' },
  { source: 'Gnome Cunning', bonus: 'Advantage on INT/WIS/CHA saves vs magic', rating: 'S', note: 'Racial. Advantage on the three most dangerous magical saves.' },
  { source: 'Magic Resistance (Yuan-Ti)', bonus: 'Advantage on ALL saves vs spells/magic', rating: 'S', note: 'Racial. Widely considered overpowered.' },
];

export function getSaveInfo(save) {
  return SAVING_THROWS.find(s =>
    s.save.toLowerCase() === (save || '').toLowerCase()
  ) || null;
}

export function getClassesWithProficiency(save) {
  return SAVE_PROFICIENCY.strong[save.toUpperCase()] || [];
}

export function getMostDangerousSaves() {
  return SAVING_THROWS.filter(s => s.dangerLevel === 'Very High' || s.dangerLevel === 'High');
}
