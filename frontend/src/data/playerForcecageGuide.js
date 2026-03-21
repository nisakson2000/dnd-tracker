/**
 * playerForcecageGuide.js
 * Player Mode: Forcecage — the ultimate no-save prison
 * Pure JS — no React dependencies.
 */

export const FORCECAGE_BASICS = {
  spell: 'Forcecage',
  level: 7,
  school: 'Evocation',
  castingTime: '1 action',
  range: '100ft',
  components: 'V, S, M (1,500 gp ruby dust)',
  duration: '1 hour',
  classes: ['Bard', 'Warlock', 'Wizard'],
  note: 'No saving throw to create. No concentration. Lasts 1 hour. Traps any creature. Only CHA save to teleport out (once per turn).',
};

export const FORCECAGE_SHAPES = [
  { shape: 'Box (10ft cube)', properties: 'Solid walls of force. Nothing passes in or out. No attacks through walls. Spell effects can\'t pass through.', use: 'Complete isolation. Enemy can\'t attack out. You can\'t attack in (without AoE that ignores walls).', note: 'Total lockdown. Enemy suffocates eventually. But you can\'t damage them either.' },
  { shape: 'Cage (20ft cube)', properties: 'Bars of force with 1/2 inch gaps. Can see through. Spells and ranged attacks CAN pass through the gaps.', use: 'Trap enemy but still attack them. Bars prevent movement. Spells go through gaps.', note: 'Better than box for combat — you can still kill the trapped creature. Bars prevent melee escape.' },
];

export const FORCECAGE_RULES = {
  noSaveToCreate: 'No saving throw when the cage appears. If the creature is in the area, it\'s trapped.',
  teleportEscape: 'Creature inside can try to teleport out: CHA save vs your spell save DC. Fail = teleport fails and slot wasted.',
  noPhysicalEscape: 'Nothing physical passes through. Even ethereal creatures are blocked (extends into Ethereal Plane).',
  noConcentration: 'NOT concentration. Once cast, it lasts the full hour. Caster can do whatever they want.',
  dispelMagic: 'Can be dispelled (DC 17). Disintegrate does nothing to it (Force damage).',
  note: 'The CHA save to teleport is the ONLY way out. Many bosses lack teleportation entirely. They\'re just trapped.',
};

export const FORCECAGE_COMBOS = [
  { combo: 'Cage + Sickening Radiance', detail: 'Cage shape (attacks pass through bars). Cast Sickening Radiance inside. Target takes 4d10 radiant per turn + exhaustion stacking. Can\'t escape. Exhaustion 6 = death.', rating: 'S', note: 'The most notorious combo in 5e. Guaranteed kill if they can\'t teleport or Counterspell.' },
  { combo: 'Cage + Cloudkill', detail: 'Cage shape + Cloudkill inside. 5d8 poison per turn. Trapped. Can\'t leave the poison cloud.', rating: 'S' },
  { combo: 'Cage + Wall of Fire', detail: 'Cage shape + Wall of Fire inside. 5d8 fire damage per turn. Trapped in the fire.', rating: 'A' },
  { combo: 'Box for isolation', detail: 'Box a boss. Fight the minions. Return to the boss later. No concentration needed.', rating: 'S' },
  { combo: 'Cage + Spirit Guardians', detail: 'Cleric walks up with Spirit Guardians. 3d8 radiant per turn. Enemy can\'t leave the cage.', rating: 'A' },
  { combo: 'Cage + ranged attacks', detail: 'Simply attack through the bars. Enemy can\'t close distance. Free ranged damage.', rating: 'A' },
];

export const FORCECAGE_COUNTERS = [
  { counter: 'CHA save teleportation', detail: 'Misty Step, Dimension Door: CHA save vs your DC to escape. High-CHA creatures might escape.', chance: 'Variable' },
  { counter: 'Dispel Magic', detail: 'DC 17 Dispel check. Most casters need to roll well or upcast.', chance: 'Low-Medium' },
  { counter: 'Antimagic Field', detail: 'Suppresses the cage in the overlapping area. Very rare ability.', chance: 'Very Low' },
  { counter: 'Counterspell', detail: 'Can counterspell Forcecage as it\'s cast. DC 17 check.', chance: 'Medium (if in range)' },
  { counter: 'No teleportation = no escape', detail: 'Most monsters below CR 10 lack teleportation. They\'re stuck.', chance: 'N/A' },
];

export function chaEscapeChance(chaSaveMod, saveDC) {
  return Math.min(0.95, Math.max(0.05, (chaSaveMod + 20 - saveDC) / 20));
}

export function sickeningRadianceKillTime(targetMaxHP, conSaveMod, saveDC) {
  // Sickening Radiance: 4d10 (22 avg) per failed save + 1 exhaustion level
  // 6 exhaustion levels = death regardless of HP
  const failChance = Math.max(0.05, 1 - (conSaveMod + 20 - saveDC) / 20);
  const roundsTo6Exhaustion = Math.ceil(6 / failChance);
  return { roundsToKill: roundsTo6Exhaustion, note: `~${roundsTo6Exhaustion} rounds to reach exhaustion 6 (death)` };
}
