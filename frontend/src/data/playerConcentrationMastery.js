/**
 * playerConcentrationMastery.js
 * Player Mode: Concentration rules, protection, and managing concentration spells
 * Pure JS — no React dependencies.
 */

export const CONCENTRATION_RULES = {
  limit: 'Only ONE concentration spell at a time. Casting a new one ends the old one.',
  saveOnDamage: 'When you take damage while concentrating, make a CON save. DC = 10 or half the damage taken, whichever is higher.',
  otherBreakers: ['Incapacitated', 'Killed', 'DM ruling (e.g., wave knocks you off a cliff)'],
  duration: 'Concentration spells last up to their stated duration. You can end concentration voluntarily (no action).',
};

export const CONCENTRATION_PROTECTION = [
  { method: 'War Caster feat', bonus: 'Advantage on concentration saves', rating: 'S', note: 'Doubles your chance to maintain. Best single pickup for casters.' },
  { method: 'Resilient (CON)', bonus: '+proficiency to CON saves', rating: 'S', note: 'Scales with level. At high levels (+6), almost never fails DC 10.' },
  { method: 'Paladin Aura (10ft)', bonus: '+CHA to all saves', rating: 'S', note: 'If you\'re near a Paladin, your concentration saves jump massively.' },
  { method: 'Bless', bonus: '+1d4 to saves', rating: 'A', note: 'Stacks with everything. But Bless itself needs concentration.' },
  { method: 'Ring/Cloak of Protection', bonus: '+1 to all saves', rating: 'A', note: 'Small but consistent. Stacks with other methods.' },
  { method: 'Absorb Elements', bonus: 'Halves triggering damage = lower DC', rating: 'A', note: 'Lower damage = lower concentration DC. 10 damage → DC 5 (auto-pass).' },
  { method: 'Shield spell', bonus: 'Avoid the hit entirely', rating: 'A', note: 'No hit = no concentration save needed. Prevention > recovery.' },
  { method: 'High CON score', bonus: '+1 to +5 on saves', rating: 'A', note: 'Don\'t dump CON as a caster. 14 CON minimum.' },
  { method: 'Position safely', bonus: 'Don\'t get hit at all', rating: 'S', note: 'Stay behind the front line. Use cover. Best concentration protection = not taking damage.' },
];

export const BEST_CONCENTRATION_SPELLS = [
  { level: 1, spell: 'Bless', class: 'Cleric/Paladin', reason: '+1d4 to attacks AND saves for 3 allies. Best L1 concentration.' },
  { level: 1, spell: 'Hex/Hunter\'s Mark', class: 'Warlock/Ranger', reason: '+1d6 per hit. Scales with Extra Attack.' },
  { level: 2, spell: 'Hold Person', class: 'Multiple', reason: 'Paralyzed = auto-crit from melee. Fight-ending.' },
  { level: 2, spell: 'Spike Growth', class: 'Druid/Ranger', reason: '2d4 per 5ft moved. Combine with forced movement.' },
  { level: 3, spell: 'Spirit Guardians', class: 'Cleric', reason: '3d8/turn to all enemies near you. Best sustained damage.' },
  { level: 3, spell: 'Haste', class: 'Wizard/Sorcerer', reason: '+2 AC, double speed, extra action. Losing it = lost turn.' },
  { level: 3, spell: 'Hypnotic Pattern', class: 'Multiple', reason: 'Incapacitate multiple enemies. Fight-winning.' },
  { level: 4, spell: 'Polymorph', class: 'Multiple', reason: 'Giant Ape = 157 temp HP + multiattack. Or disable enemies.' },
  { level: 5, spell: 'Wall of Force', class: 'Wizard', reason: 'Indestructible wall. Split encounters. Untouchable.' },
  { level: 5, spell: 'Animate Objects', class: 'Wizard/Bard', reason: '10 tiny objects = 10d4+40 damage/round. Absurd DPR.' },
];

export const CONCENTRATION_MISTAKES = [
  'Forgetting you\'re already concentrating and casting another concentration spell.',
  'Not tracking which damage instances require saves (each source is a separate save).',
  'Dumping CON as a caster — 10 CON means +0 on your most important saves.',
  'Casting Haste on an ally then losing concentration — the ally loses their entire next turn.',
  'Not using positioning to avoid damage in the first place.',
  'Choosing a concentration spell when a non-concentration option would suffice.',
];

export function concentrationDC(damageTaken) {
  return Math.max(10, Math.floor(damageTaken / 2));
}

export function concentrationSaveChance(conMod, proficient, profBonus, otherBonuses, damageTaken) {
  const dc = concentrationDC(damageTaken);
  let bonus = conMod + (proficient ? profBonus : 0) + otherBonuses;
  const needed = dc - bonus;
  return Math.min(95, Math.max(5, (21 - needed) * 5));
}

export function warCasterChance(conMod, proficient, profBonus, otherBonuses, damageTaken) {
  const singleRoll = concentrationSaveChance(conMod, proficient, profBonus, otherBonuses, damageTaken) / 100;
  const withAdvantage = 1 - (1 - singleRoll) * (1 - singleRoll);
  return Math.round(withAdvantage * 100);
}
