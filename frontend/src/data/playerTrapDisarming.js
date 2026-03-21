/**
 * playerTrapDisarming.js
 * Player Mode: Trap detection, disarming, and trap DCs by tier
 * Pure JS — no React dependencies.
 */

export const TRAP_DCS_BY_TIER = [
  { tier: 'Setback (L1-4)', detectDC: '10-11', disarmDC: '10-11', saveDC: '10-11', damage: '1d10 (5)', note: 'Nuisance traps. Low risk.' },
  { tier: 'Dangerous (L5-10)', detectDC: '12-15', disarmDC: '12-15', saveDC: '12-15', damage: '2d10 (11)', note: 'Meaningful threat. Pay attention.' },
  { tier: 'Deadly (L11-16)', detectDC: '16-20', disarmDC: '16-20', saveDC: '16-20', damage: '4d10 (22)', note: 'Can down a character. Be careful.' },
  { tier: 'Epic (L17-20)', detectDC: '21-25', disarmDC: '21-25', saveDC: '21-25', damage: '10d10 (55)', note: 'Potentially lethal. Extreme caution.' },
];

export const TRAP_TYPES = [
  { type: 'Pressure Plate', detection: 'Investigation or Perception', disarm: 'Thieves\' tools + DEX', bypass: 'Step over, use 10ft pole, place weight on plate' },
  { type: 'Tripwire', detection: 'Perception (hard to see)', disarm: 'Cut carefully or step over', bypass: 'Jump, crawl under, detect with 10ft pole' },
  { type: 'Pit Trap', detection: 'Investigation to spot seams in floor', disarm: 'Wedge or jam the mechanism', bypass: 'Jump across, rope bridge, Feather Fall ready' },
  { type: 'Poison Dart', detection: 'Small holes in walls', disarm: 'Block holes or disarm trigger', bypass: 'Shield facing wall, Mage Hand trigger from distance' },
  { type: 'Glyph of Warding', detection: 'Investigation DC or Detect Magic', disarm: 'Dispel Magic (DC based on spell level)', bypass: 'Trigger from distance, Counterspell' },
  { type: 'Symbol', detection: 'Very high Investigation DC', disarm: 'Dispel Magic (DC 19 for 7th level)', bypass: 'Don\'t look at it / avoid the area' },
  { type: 'Collapsing Ceiling', detection: 'Investigation (cracks, loose stones)', disarm: 'Shore up or avoid trigger', bypass: 'Run through quickly, Immovable Rod' },
  { type: 'Magic Trap', detection: 'Detect Magic or Arcana check', disarm: 'Dispel Magic', bypass: 'Trigger from range, counterspell' },
];

export const TRAP_DETECTION_METHODS = [
  { method: 'Passive Perception', who: 'Everyone', note: 'DM compares trap DC to your passive. No action needed.' },
  { method: 'Active Investigation', who: 'Anyone', note: 'Action to search. Investigation check vs trap DC.' },
  { method: 'Detect Magic (ritual)', who: 'Casters', note: 'Detects magical traps within 30ft. Free if cast as ritual.' },
  { method: 'Find Traps (2nd level)', who: 'Cleric/Druid/Ranger', note: 'Pings presence of traps within 120ft. Does NOT reveal location or type.' },
  { method: 'Familiar scouting', who: 'Wizard/Warlock', note: 'Send familiar ahead. If it triggers a trap, resummon for 10 gp.' },
  { method: 'Rogue Reliable Talent (L11)', who: 'Rogue', note: 'Minimum 10 on ability checks. Can\'t roll below 10+mods on Investigation.' },
  { method: 'Dungeoneering feat', who: 'Anyone', note: 'Dungeon Delver feat: advantage on Perception/Investigation for traps and secret doors.' },
];

export const TRAP_DISARMING_TIPS = [
  'Always have someone with Thieves\' tools proficiency in the party.',
  'If disarming fails, trigger from a distance (Mage Hand, throw a rock).',
  'Dispel Magic is the universal trap remover for magical traps.',
  'Some traps reset. Mark them even after disarming.',
  'Rogues with expertise in Investigation + Thieves\' tools are the best trap handlers.',
  'Dungeon Delver feat gives advantage on saves against traps + advantage to detect them.',
];

export function passivePerception(wisMod, profBonus, isProficient, hasObservant) {
  return 10 + wisMod + (isProficient ? profBonus : 0) + (hasObservant ? 5 : 0);
}

export function canDetectTrap(passivePerception, trapDC) {
  return passivePerception >= trapDC;
}

export function disarmChance(toolMod, trapDC) {
  const needed = trapDC - toolMod;
  return Math.min(95, Math.max(5, (21 - needed) * 5));
}
