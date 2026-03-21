/**
 * playerSpiritGuardiansOptGuide.js
 * Player Mode: Spirit Guardians optimization — the Cleric's best spell
 * Pure JS — no React dependencies.
 */

export const SPIRIT_GUARDIANS_BASICS = {
  spell: 'Spirit Guardians',
  level: 3,
  school: 'Conjuration',
  castTime: '1 action',
  range: 'Self (15ft radius)',
  components: 'V, S, M (a holy symbol)',
  duration: 'Concentration, up to 10 minutes',
  classes: ['Cleric'],
  note: 'The single best Cleric spell. AoE damage every turn, halves enemy speed, no friendly fire. Concentration but worth protecting at all costs.',
};

export const SPIRIT_GUARDIANS_MECHANICS = {
  damage: '3d8 radiant/necrotic (half on save)',
  save: 'WIS save',
  scaling: '+1d8 per slot level above 3rd',
  trigger: 'When creature enters area for first time on a turn OR starts its turn there',
  speedReduction: 'Hostile creatures: speed halved in the area',
  friendlyFire: 'You choose which creatures are affected. Allies are safe.',
  note: 'Triggers on ENTRY or START of turn. Forced movement into the area triggers damage.',
};

export const SPIRIT_GUARDIANS_DAMAGE_TABLE = [
  { slot: 3, dice: '3d8', avgPerTarget: 13.5, halfDamage: 6.75 },
  { slot: 4, dice: '4d8', avgPerTarget: 18, halfDamage: 9 },
  { slot: 5, dice: '5d8', avgPerTarget: 22.5, halfDamage: 11.25 },
  { slot: 6, dice: '6d8', avgPerTarget: 27, halfDamage: 13.5 },
  { slot: 7, dice: '7d8', avgPerTarget: 31.5, halfDamage: 15.75 },
];

export const SPIRIT_GUARDIANS_COMBOS = [
  { combo: 'Spirit Guardians + Spiritual Weapon', detail: 'SG (concentration) + SW (no concentration). AoE + BA single-target. The classic Cleric combo.', rating: 'S' },
  { combo: 'Spirit Guardians + Dodge', detail: 'Cast SG → Dodge each turn. Enemies can\'t hit you (protecting concentration). They take damage just existing near you.', rating: 'S' },
  { combo: 'SG + forced movement', detail: 'Ally pushes enemy into SG = entry damage. Repelling Blast, Thorn Whip, Thunderwave. Double-dip damage.', rating: 'S' },
  { combo: 'SG + Heavy Armor + Shield', detail: 'AC 20+ Cleric standing in AoE damage aura. Enemies halved speed, can\'t hit you, take 3d8/round.', rating: 'S' },
  { combo: 'SG + Warding Bond', detail: 'Pre-cast Warding Bond (no concentration). +1 AC/saves to protect SG concentration.', rating: 'A' },
];

export const SPIRIT_GUARDIANS_TACTICS = [
  { tactic: 'Wade into melee', detail: 'Walk into enemy groups. They take damage AND have half speed. You don\'t need to attack — just exist.', rating: 'S' },
  { tactic: 'Protect concentration', detail: 'War Caster + Resilient (CON). Losing SG = losing your best spell. CON save proficiency is critical.', rating: 'S' },
  { tactic: 'Duration = value', detail: '10 minute duration. 5 rounds × 3 enemies = 202.5 total damage from one L3 slot. Insane efficiency.', rating: 'S' },
];

export function spiritGuardiansDPR(slotLevel, numTargets, savePct = 0.5) {
  const dice = slotLevel;
  const avgPerTarget = dice * 4.5;
  const effectivePerTarget = avgPerTarget * (1 - savePct) + (avgPerTarget / 2) * savePct;
  return { perTarget: Math.round(effectivePerTarget * 10) / 10, total: Math.round(effectivePerTarget * numTargets * 10) / 10 };
}
