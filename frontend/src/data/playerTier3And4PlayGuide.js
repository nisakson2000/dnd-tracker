/**
 * playerTier3And4PlayGuide.js
 * Player Mode: Tier 3-4 (L11-20) play guide — what changes and how to adapt
 * Pure JS — no React dependencies.
 */

export const TIER_SUMMARY = [
  { tier: 'Tier 1 (L1-4)', name: 'Local Heroes', note: 'Fragile. Limited resources.' },
  { tier: 'Tier 2 (L5-10)', name: 'Heroes of the Realm', note: 'Extra Attack. L3 spells. Power jump at L5.' },
  { tier: 'Tier 3 (L11-16)', name: 'Masters of the Realm', note: 'Flight, teleportation, raise dead. Casters dominate.' },
  { tier: 'Tier 4 (L17-20)', name: 'Masters of the World', note: 'Wish, True Polymorph, 9th level spells.' },
];

export const HIGH_LEVEL_CHANGES = [
  { change: 'Casters overtake Martials', detail: 'L6-9 spells reshape reality. Wish, Forcecage, Simulacrum.' },
  { change: 'Save-or-suck intensifies', detail: 'Feeblemind, Power Word Stun, Maze. Build saves.' },
  { change: 'Flight becomes standard', detail: 'Fly spell, magic items. Ground = disadvantage.' },
  { change: 'Teleportation replaces travel', detail: 'Teleport, Plane Shift. Distance is meaningless.' },
  { change: 'Death is temporary', detail: 'Revivify, Raise Dead, True Resurrection, Wish.' },
  { change: 'Legendary Resistances', detail: 'Bosses auto-succeed 3/day. Burn them first.' },
];

export const HIGH_LEVEL_PRIORITIES = [
  { priority: 'Max saves', method: 'Resilient, Paladin Aura, Magic Resistance items.' },
  { priority: 'Get flight', method: 'Winged Boots, Fly, race flight.' },
  { priority: 'Counter enemy magic', method: 'Counterspell, Dispel Magic. Mandatory.' },
  { priority: 'Burn Legendary Resistance', method: 'Cheap spells first, kill spells after LR gone.' },
];

export const LEGENDARY_RESISTANCE_BURN = [
  'Use cheap spells: Faerie Fire, Hold Person, Mind Sliver.',
  'Count uses. Usually 3/day.',
  'After LR gone: Banishment, Polymorph, Feeblemind.',
  'Wall of Force: no save, no LR needed.',
  'Party coordination: one burns LR, another lands the kill.',
];

export const HIGH_LEVEL_TIPS = [
  'Max saves. Failed save at L15+ = death or worse.',
  'Counterspell: MANDATORY. Enemy casters have L7-9 spells.',
  'Burn LR with cheap spells. Then land critical spells.',
  'Fly or die. Flight expected at Tier 3+.',
  'Wall of Force: no save, no LR. Best spell.',
  'Wish: replicate any L8 or lower. Ultimate flexibility.',
  'True Polymorph: permanent. Turn enemy into snail.',
  'At L20: casters warp reality. Martials need items to compete.',
];
