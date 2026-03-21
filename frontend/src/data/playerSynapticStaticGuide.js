/**
 * playerSynapticStaticGuide.js
 * Player Mode: Synaptic Static — the better Fireball
 * Pure JS — no React dependencies.
 */

export const SYNAPTIC_STATIC_BASICS = {
  spell: 'Synaptic Static',
  level: 5,
  school: 'Enchantment',
  castingTime: '1 action',
  range: '120ft',
  area: '20ft radius sphere',
  components: 'V, S',
  duration: 'Instantaneous (debuff lasts 1 minute)',
  save: 'INT saving throw',
  damage: '8d6 psychic',
  classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'],
  note: 'Same damage as Fireball (8d6) but at L5, targets INT (worst save for most monsters), and applies a lingering debuff. Strictly better than Fireball in most cases.',
};

export const SYNAPTIC_STATIC_DEBUFF = {
  effect: 'On failed save: subtract 1d6 from attack rolls, ability checks, and concentration saves for 1 minute.',
  duration: '1 minute (10 rounds)',
  endCondition: 'Target makes an INT save at end of each of its turns to end the effect.',
  noConcentration: 'NOT concentration. The debuff just exists. You can cast other concentration spells.',
  note: 'The debuff alone is worth a L5 slot. -1d6 (avg -3.5) to attacks AND concentration saves is crippling.',
};

export const SYNAPTIC_STATIC_VS_FIREBALL = [
  { category: 'Damage', fireball: '8d6 fire (28 avg)', synapticStatic: '8d6 psychic (28 avg)', winner: 'Synaptic Static (psychic rarely resisted)' },
  { category: 'Spell Level', fireball: 'L3', synapticStatic: 'L5', winner: 'Fireball (lower slot cost)' },
  { category: 'Save Type', fireball: 'DEX (common proficiency)', synapticStatic: 'INT (rare proficiency)', winner: 'Synaptic Static (most monsters have low INT)' },
  { category: 'Damage Type', fireball: 'Fire (commonly resisted)', synapticStatic: 'Psychic (rarely resisted)', winner: 'Synaptic Static' },
  { category: 'Additional Effect', fireball: 'Ignites objects', synapticStatic: '-1d6 to attacks/checks/concentration for 1 min', winner: 'Synaptic Static (massive debuff)' },
  { category: 'Concentration', fireball: 'No', synapticStatic: 'No', winner: 'Tie' },
];

export const SYNAPTIC_STATIC_TACTICS = [
  { tactic: 'Open with Synaptic Static', detail: 'Round 1: Synaptic Static on enemy group. 8d6 damage + survivors are debuffed for the whole fight. Then concentrate on something else.', rating: 'S' },
  { tactic: 'Target INT-weak enemies', detail: 'Most beasts, undead, oozes, and many fiends have terrible INT saves. This spell almost never misses.', rating: 'S' },
  { tactic: 'Debuff stacking', detail: 'Synaptic Static (-1d6 attacks) + Bless on allies (+1d4 attacks/saves) = massive swing in hit rates.', rating: 'S' },
  { tactic: 'Anti-caster usage', detail: '-1d6 to concentration saves. Enemy casters will lose concentration on average 17.5% more often.', rating: 'A' },
  { tactic: 'Non-concentration + other spells', detail: 'Debuff is not concentration. Cast Synaptic Static then use your concentration for Wall of Force, Haste, or other key spells.', rating: 'S' },
];

export const LOW_INT_MONSTERS = [
  { type: 'Most Beasts', avgINT: '1-4', note: 'Animals have 1-3 INT. Auto-fail most INT saves.' },
  { type: 'Zombies', avgINT: '3', note: 'INT 3 = -4 modifier. Will almost always fail.' },
  { type: 'Oozes', avgINT: '1-2', note: 'Lowest INT in the game. Guaranteed debuff.' },
  { type: 'Many Giants', avgINT: '5-10', note: 'Below average INT. Good targets.' },
  { type: 'Most Fiends (brutes)', avgINT: '5-8', note: 'Brute demons/devils have low INT.' },
  { type: 'Constructs', avgINT: '3-6', note: 'Some are immune to psychic — check first.' },
];

export function synapticStaticDPR(numberOfTargets) {
  return { damage: numberOfTargets * 28, debuffValue: numberOfTargets * 3.5, note: `${numberOfTargets} targets × 28 avg = ${numberOfTargets * 28} damage + ${numberOfTargets} debuffed enemies` };
}

export function debuffImpactOnAttacks(avgDebuffValue = 3.5) {
  return { hitReduction: avgDebuffValue / 20, percentReduction: `${(avgDebuffValue / 20 * 100).toFixed(1)}%`, note: `-1d6 avg (${avgDebuffValue}) = ~${(avgDebuffValue / 20 * 100).toFixed(1)}% fewer hits` };
}
