/**
 * playerConcentrationBreaker.js
 * Player Mode: Strategies for breaking enemy concentration
 * Pure JS — no React dependencies.
 */

export const CONCENTRATION_BREAK_METHODS = [
  { method: 'Multiple Small Hits', effectiveness: 'S', detail: 'Each hit forces a separate CON save. Three hits of 5 damage = three DC 10 saves. Better than one hit of 15 (one DC 10 save).', bestClasses: ['Fighter (Extra Attack)', 'Monk (Flurry of Blows)', 'Ranger (Extra Attack + Hunter\'s Mark)'] },
  { method: 'Magic Missile', effectiveness: 'A', detail: '3 missiles = 3 separate concentration checks (RAW debated, but common ruling). Upcast for more missiles.', bestClasses: ['Wizard', 'Sorcerer', 'Arcane Trickster'] },
  { method: 'Stunning Strike', effectiveness: 'S', detail: 'Stunned condition = incapacitated = concentration automatically broken. No save for concentration.', bestClasses: ['Monk'] },
  { method: 'Power Word Stun', effectiveness: 'S', detail: 'No save if under 150 HP. Stunned = concentration broken instantly.', bestClasses: ['Any full caster'] },
  { method: 'Dispel Magic', effectiveness: 'A', detail: 'Directly ends the spell. Auto-success if same level, check for higher. Doesn\'t target the caster.', bestClasses: ['Any caster with Dispel Magic'] },
  { method: 'Counterspell', effectiveness: 'A', detail: 'Prevent the concentration spell from being cast in the first place. 60ft range, reaction.', bestClasses: ['Sorcerer', 'Wizard', 'Warlock'] },
  { method: 'Grapple + Shove Prone', effectiveness: 'B', detail: 'Doesn\'t break concentration directly, but grappled + prone = can\'t stand up. Melee advantage for your team.', bestClasses: ['Barbarian', 'Fighter'] },
  { method: 'Eldritch Blast + Repelling Blast', effectiveness: 'A', detail: 'Multiple beams = multiple concentration saves. Pushing breaks line of sight for some spells.', bestClasses: ['Warlock'] },
  { method: 'Silence', effectiveness: 'S', detail: 'Can\'t cast verbal spells in Silence. If they\'re concentrating and need to recast, they can\'t.', bestClasses: ['Bard', 'Cleric', 'Ranger'] },
];

export const CON_SAVE_MATH = {
  formula: 'DC = MAX(10, damage_taken / 2)',
  examples: [
    { damage: 1, dc: 10, note: 'Any damage less than 20 = DC 10' },
    { damage: 10, dc: 10, note: 'Still DC 10' },
    { damage: 19, dc: 10, note: 'Still DC 10' },
    { damage: 20, dc: 10, note: 'Exactly DC 10' },
    { damage: 22, dc: 11, note: 'Now DC starts climbing' },
    { damage: 30, dc: 15, note: 'Getting harder' },
    { damage: 40, dc: 20, note: 'Very difficult to pass' },
    { damage: 50, dc: 25, note: 'Nearly impossible without proficiency' },
  ],
  insight: 'Multiple small hits (each forcing DC 10) are statistically better than one big hit. A caster with +5 CON save has 80% chance of passing DC 10, but three DC 10 checks = only 51% chance of passing ALL three.',
};

export const CONCENTRATION_SAVE_MODS = [
  { source: 'War Caster feat', bonus: 'Advantage on CON saves', rating: 'A' },
  { source: 'Resilient (CON)', bonus: 'Proficiency bonus to CON saves', rating: 'A' },
  { source: 'Mind Blank', bonus: 'Immune to psychic damage (less con saves)', rating: 'B' },
  { source: 'Paladin Aura', bonus: '+CHA to saves within 10ft (30ft at 18)', rating: 'S' },
  { source: 'Bladesinger\'s Song of Defense', bonus: 'INT to concentration saves', rating: 'A' },
];

export function calculateConDC(damage) {
  return Math.max(10, Math.floor(damage / 2));
}

export function chanceToBreak(damage, conSaveMod) {
  const dc = calculateConDC(damage);
  const chanceToPass = Math.min(0.95, Math.max(0.05, (21 - (dc - conSaveMod)) / 20));
  return 1 - chanceToPass;
}

export function multiHitBreakChance(hits, conSaveMod) {
  const passChance = Math.min(0.95, Math.max(0.05, (21 - (10 - conSaveMod)) / 20));
  return 1 - Math.pow(passChance, hits);
}
