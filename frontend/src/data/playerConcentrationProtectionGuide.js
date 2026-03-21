/**
 * playerConcentrationProtectionGuide.js
 * Player Mode: Concentration — protecting your best spells
 * Pure JS — no React dependencies.
 */

export const CONCENTRATION_BASICS = {
  rule: 'One concentration spell at a time. Damage = CON save (DC 10 or half damage). Fail = lose spell.',
  note: 'Most best spells are concentration: Haste, Spirit Guardians, Web, Polymorph, Wall of Force. Protecting concentration IS the fight.',
};

export const CONCENTRATION_SAVES = [
  { damage: 1, dc: 10 }, { damage: 10, dc: 10 }, { damage: 20, dc: 10 },
  { damage: 22, dc: 11 }, { damage: 30, dc: 15 }, { damage: 50, dc: 25 },
];

export const CONCENTRATION_PROTECTION = [
  { method: 'War Caster', bonus: 'Advantage on saves', note: 'Best early game. +65% → +88% on DC 10.' },
  { method: 'Resilient (CON)', bonus: 'CON save proficiency', note: 'Scales with PB. Better at high levels.' },
  { method: 'Both', bonus: 'Advantage + proficiency', note: '99%+ on DC 10 by L13.' },
  { method: 'High CON', bonus: '+1 to +5', note: 'Start CON 14+ for casters.' },
  { method: 'Aura of Protection', bonus: '+CHA to saves', note: 'Paladin: +5 to concentration for self and allies.' },
  { method: 'Bladesong', bonus: '+INT to con saves', note: 'Bladesinger nearly never loses concentration.' },
  { method: 'Mind Sharpener', bonus: '4 auto-successes/day', note: 'Artificer infusion. Incredible.' },
];

export const CONCENTRATION_TACTICS = [
  { tactic: 'Don\'t get hit', detail: 'Stay behind cover. Use range. Dodge if needed. Best protection.', rating: 'S' },
  { tactic: 'War Caster early, Resilient late', detail: 'WC at L4 for advantage. Resilient at L8-12 for scaling. Both by L12.', rating: 'S' },
  { tactic: 'Small hits are worse', detail: '3× DC 10 > 1× DC 15. Avoid multi-hit sources.', rating: 'A' },
];

export function concentrationSaveDC(damageTaken) {
  return Math.max(10, Math.floor(damageTaken / 2));
}

export function passChance(conMod, profBonus, hasProficiency, hasAdvantage) {
  const dc = 10;
  const bonus = conMod + (hasProficiency ? profBonus : 0);
  const normal = Math.min(1, Math.max(0.05, (21 - (dc - bonus)) / 20));
  return hasAdvantage ? 1 - Math.pow(1 - normal, 2) : normal;
}
