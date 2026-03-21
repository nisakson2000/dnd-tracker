/**
 * playerFireballOptimizationGuide.js
 * Player Mode: Fireball optimization — maximizing the iconic blast
 * Pure JS — no React dependencies.
 */

export const FIREBALL_BASICS = {
  spell: 'Fireball',
  level: 3,
  school: 'Evocation',
  castingTime: '1 action',
  range: '150ft',
  area: '20ft radius sphere',
  components: 'V, S, M (bat guano and sulfur)',
  duration: 'Instantaneous',
  damage: '8d6 fire',
  save: 'DEX saving throw (half on success)',
  classes: ['Sorcerer', 'Wizard', 'Light Cleric (domain)', 'Fiend Warlock (expanded)'],
  note: 'Intentionally overtuned per designers. 8d6 at L3 is 28 avg — higher than any other L3 damage spell. 20ft radius hits HUGE areas.',
};

export const FIREBALL_DAMAGE_SCALING = [
  { level: 3, dice: '8d6', avg: 28, note: 'Base. Already overpowered for a L3 slot.' },
  { level: 4, dice: '9d6', avg: 31.5, note: 'Solid upcast. Still good damage.' },
  { level: 5, dice: '10d6', avg: 35, note: 'Decent but L5 slots have better options (Synaptic Static, Wall of Force).' },
  { level: 6, dice: '11d6', avg: 38.5, note: 'Falling behind. L6 has better spells.' },
  { level: 7, dice: '12d6', avg: 42, note: 'Not worth a L7 slot.' },
];

export const FIREBALL_OPTIMIZATION = [
  { method: 'Evocation Wizard: Sculpt Spells', detail: 'Allies in Fireball area automatically save and take 0 damage. Cast Fireball ON your melee allies safely.', rating: 'S' },
  { method: 'Sorcerer: Empowered Spell', detail: '1 SP: reroll CHA mod damage dice. Keep bad rolls, reroll low ones. Avg 28 → ~33 damage.', rating: 'A' },
  { method: 'Elemental Adept: Fire', detail: 'Treat 1s as 2s on fire damage dice. Ignore fire resistance. Avg 28 → 31.5.', rating: 'A' },
  { method: 'Draconic Sorcerer (Red/Gold)', detail: 'Add CHA to fire spell damage at L6. Fireball: 8d6+5 = 33 avg to ONE target (RAW: one creature).', rating: 'A' },
  { method: 'Light Cleric: Potent Spellcasting', detail: 'L8: add WIS to cleric cantrip damage. Not Fireball, but Light Cleric gets Fireball as a domain spell.', rating: 'B' },
  { method: 'Twinned Spell? NO', detail: 'Fireball targets an area, not single creature. Cannot be Twinned. Don\'t try.', rating: 'N/A' },
];

export const FIREBALL_POSITIONING = [
  { tip: 'Count the radius', detail: '20ft radius = 40ft diameter. That\'s 8 squares across. MASSIVE area. Position to hit maximum enemies.' },
  { tip: '150ft range', detail: 'You can cast from 150ft away. Stay far back. Let melee allies clear out before blasting.' },
  { tip: 'Sphere, not circle', detail: 'Fireball is a sphere. It goes around corners, fills rooms, and extends vertically. Use this.' },
  { tip: 'It ignites objects', detail: 'Fireball ignites flammable objects not being worn/carried. Environmental damage potential.' },
  { tip: 'Spreads around corners', detail: 'RAW: "spreads around corners." Can\'t hide behind a pillar. The fire finds you.' },
];

export const WHEN_TO_STOP_USING_FIREBALL = [
  { level: '1-6', verdict: 'Fireball is king. Use it liberally.', note: '8d6 at L3 is unmatched.' },
  { level: '7-8', verdict: 'Still good for groups. Start considering alternatives for single targets.', note: 'Fire resistance becomes more common.' },
  { level: '9-10', verdict: 'Better spells available. Use Fireball for weak groups.', note: 'Synaptic Static, Wall of Force outclass it.' },
  { level: '11+', verdict: 'Reserve for mobs. Boss fights need better tools.', note: 'Many high-CR enemies resist or are immune to fire.' },
];

export function fireballDamage(slotLevel, elementalAdept = false) {
  const dice = 5 + slotLevel;
  const avgPerDie = elementalAdept ? 3.83 : 3.5; // 1s become 2s
  return { dice: `${dice}d6`, avg: Math.round(dice * avgPerDie * 10) / 10 };
}

export function fireballEnemiesInRadius(enemies, radiusFt = 20) {
  // Rough estimate: 20ft radius covers ~1,256 sq ft
  return { area: Math.PI * radiusFt * radiusFt, note: `${radiusFt}ft radius can hit ${enemies} enemies. Total avg damage: ${enemies * 28} (${enemies} × 28).` };
}

export function empoweredFireball(chaMod) {
  // Reroll chaMod lowest dice out of 8d6
  // Rough estimate: rerolling lowest dice raises avg from 3.5 to ~4.25 per rerolled die
  const normalDice = 8 - chaMod;
  const rerolledDice = chaMod;
  return Math.round((normalDice * 3.5 + rerolledDice * 4.25) * 10) / 10;
}
