/**
 * playerBanishmentGuide.js
 * Player Mode: Banishment spell optimization — removing threats
 * Pure JS — no React dependencies.
 */

export const BANISHMENT_BASICS = {
  spell: 'Banishment',
  level: 4,
  school: 'Abjuration',
  castingTime: '1 action',
  range: '60ft',
  components: 'V, S, M (item distasteful to target)',
  duration: 'Concentration, up to 1 minute',
  classes: ['Cleric', 'Paladin', 'Sorcerer', 'Warlock', 'Wizard'],
  note: 'One of the best single-target removal spells. CHA save. Native plane creatures return after 1 minute. Extraplanar creatures are permanently banished if held for full duration.',
};

export const BANISHMENT_RULES = {
  nativePlane: 'If target is native to the current plane: sent to a harmless demiplane. Incapacitated. Returns when spell ends.',
  extraplanar: 'If target is NOT native to the current plane: banished to home plane. If concentration held for full minute, target stays banished PERMANENTLY.',
  upcast: 'Each slot above 4th: target one additional creature. L5 = 2 targets. L8 = 5 targets.',
  save: 'CHA saving throw. Repeated? No — one save only. Target gets NO repeat saves.',
  note: 'No repeated saves is what makes this spell incredible. One failed save = removed from combat for a full minute.',
};

export const BANISHMENT_TACTICS = [
  { tactic: 'Target low-CHA enemies', detail: 'Beasts, undead, constructs often have low CHA. A zombie has CHA 5 (-3 save). Almost auto-fail.', rating: 'S' },
  { tactic: 'Remove boss temporarily', detail: 'Banish the boss → fight the minions → prepare readied actions → boss returns → alpha strike.', rating: 'S' },
  { tactic: 'Permanent banishment of fiends/fey', detail: 'Demons, devils, fey on the Material Plane are extraplanar. Hold concentration for 1 minute = they\'re gone forever.', rating: 'S' },
  { tactic: 'Upcast for multiple targets', detail: 'L5 slot: banish 2 creatures. L6: 3 creatures. Mass removal from combat.', rating: 'S' },
  { tactic: 'Protect concentration', detail: 'This spell is worth protecting with everything. War Caster, Resilient (CON), positioning behind cover.', rating: 'S' },
  { tactic: 'Combo with Eloquence Bard', detail: 'Unsettling Words (-1d8 to save) then Banishment. Save debuffed by ~4.5. Devastating combo.', rating: 'S' },
];

export const BANISHMENT_VS_ALTERNATIVES = [
  { spell: 'Banishment', pros: 'No repeated saves, removes from combat entirely, permanent vs extraplanar', cons: 'Concentration, CHA save (some bosses have high CHA)', verdict: 'Best single-target removal at L4.' },
  { spell: 'Polymorph', pros: 'Transform into harmless beast, can use offensively on allies too', cons: 'WIS save, damage can break the polymorph, still present in combat', verdict: 'More versatile but less reliable removal.' },
  { spell: 'Hold Person/Monster', pros: 'Paralyzed = auto-crit in melee, great for burst damage', cons: 'Repeated saves each turn, WIS save', verdict: 'Better for burst damage, worse for removal.' },
];

export const LOW_CHA_MONSTERS = [
  { creature: 'Zombies', cha: 5, saveMod: -3 },
  { creature: 'Skeletons', cha: 5, saveMod: -3 },
  { creature: 'Golems', cha: 1, saveMod: -5 },
  { creature: 'Most Beasts', cha: '3-7', saveMod: '-4 to -2' },
  { creature: 'Oozes', cha: '1-2', saveMod: '-5 to -4' },
  { creature: 'Many Aberrations', cha: '6-10', saveMod: '-2 to 0' },
];

export function banishmentTargets(slotLevel) {
  return Math.max(1, slotLevel - 3);
}

export function estimateSaveChance(chaSaveMod, saveDC) {
  return Math.min(0.95, Math.max(0.05, (chaSaveMod + 20 - saveDC) / 20));
}
