/**
 * playerTrapDetection.js
 * Player Mode: Trap detection, investigation, and disarming
 * Pure JS — no React dependencies.
 */

export const TRAP_DETECTION_RULES = {
  passive: 'Passive Perception can spot traps if their DC is ≤ your passive score.',
  active: 'Investigation check to identify trap mechanism. Perception to spot hidden triggers.',
  disarm: 'Thieves\' Tools check to disarm (DC set by DM, typically 10-20).',
  trigger: 'If you fail or trigger it, the trap activates.',
  note: 'Rogues excel at this — proficiency with Thieves\' Tools + Expertise.',
};

export const COMMON_TRAPS = [
  { name: 'Pit Trap', detectionDC: 15, disarmDC: null, damage: '1d10 fall (10ft) to 2d10 (20ft)', trigger: 'Step on cover plate', note: 'Covered pit. May have spikes (+2d10 piercing).' },
  { name: 'Poison Needle', detectionDC: 15, disarmDC: 15, damage: '1 piercing + 2d10 poison', trigger: 'Open lock/chest without disarming', note: 'DC 15 CON save or poisoned 1 hour.' },
  { name: 'Poison Dart', detectionDC: 15, disarmDC: 13, damage: '1d10 poison', trigger: 'Pressure plate or tripwire', note: '+8 to hit, DC 15 CON save.' },
  { name: 'Fire Trap', detectionDC: 12, disarmDC: 12, damage: '2d10 fire', trigger: 'Open door/chest', note: 'DEX save for half.' },
  { name: 'Rolling Boulder', detectionDC: 15, disarmDC: null, damage: '4d10 bludgeoning', trigger: 'Tripwire or pressure plate', note: 'DEX DC 15 to dodge. Fills hallway.' },
  { name: 'Swinging Blade', detectionDC: 15, disarmDC: 15, damage: '3d10 slashing', trigger: 'Pressure plate', note: '+8 to hit. May block passage.' },
  { name: 'Collapsing Ceiling', detectionDC: 10, disarmDC: null, damage: '4d10 bludgeoning', trigger: 'Tripwire, pressure plate, or timed', note: 'DC 15 DEX to take half. Blocked passage.' },
  { name: 'Sleep Gas', detectionDC: 15, disarmDC: 13, damage: 'None (unconscious)', trigger: 'Open container or enter room', note: 'DC 13 CON save or fall unconscious 1d10 minutes.' },
];

export function canDetectTrap(passivePerception, trapDC) {
  return passivePerception >= trapDC;
}

export function getDisarmModifier(dexScore, profBonus, hasThievesTools) {
  const dexMod = Math.floor((dexScore - 10) / 2);
  return dexMod + (hasThievesTools ? profBonus : 0);
}

export function getTrap(name) {
  return COMMON_TRAPS.find(t => t.name.toLowerCase().includes(name.toLowerCase())) || null;
}
