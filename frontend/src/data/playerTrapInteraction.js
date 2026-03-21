/**
 * playerTrapInteraction.js
 * Player Mode: Trap interaction rules, disarming, and avoidance
 * Pure JS — no React dependencies.
 */

export const TRAP_DETECTION = {
  passive: 'Passive Perception detects some traps automatically (if your passive ≥ trap DC).',
  active: 'Investigation or Perception check to actively search. Usually better odds.',
  magicTraps: 'Detect Magic reveals magical traps. Dispel Magic may disarm them.',
  identify: 'After finding a trap, Investigation check to understand how it works.',
};

export const TRAP_DISARMING = {
  thievesTools: 'Thieves\' Tools proficiency + DEX check. Standard method. DC matches trap.',
  dispelMagic: 'Dispel Magic disarms magical traps. DC = 10 + spell level if higher than your slot.',
  triggerFromAfar: 'Throw a rock at the pressure plate. Use Mage Hand to pull the lever.',
  avoidance: 'Sometimes the best option is to just go around the trap.',
  controlled: 'Trigger the trap intentionally from a safe distance/position.',
};

export const COMMON_TRAP_ACTIONS = [
  { trap: 'Pit Trap', detection: 'DC 15 Perception/Investigation', disarm: 'Wedge the cover shut or avoid.', ifTriggered: 'DEX save DC 10-15 or fall 10-30ft (1d6-3d6 damage). Might have spikes (+1d10).' },
  { trap: 'Poison Dart', detection: 'DC 15 Perception (small holes in wall)', disarm: 'DC 15 Thieves\' Tools or block the holes.', ifTriggered: '1d4 piercing + 2d10 poison (CON save for half).' },
  { trap: 'Collapsing Ceiling', detection: 'DC 15 Investigation (cracks above)', disarm: 'Shore up with props or avoid area.', ifTriggered: 'DEX save DC 15. 4d10 bludgeoning on failure, half on success.' },
  { trap: 'Fire Glyph', detection: 'DC 15 Investigation or Detect Magic', disarm: 'Dispel Magic (DC 13) or Thieves\' Tools (DC 15).', ifTriggered: '5d8 fire damage (DEX save for half).' },
  { trap: 'Sleeping Gas', detection: 'DC 20 Perception (faint hissing)', disarm: 'Block the vents or Dispel Magic.', ifTriggered: 'CON save DC 15 or fall unconscious for 1 minute.' },
  { trap: 'Blade Trap', detection: 'DC 15 Perception (thin slits in walls)', disarm: 'DC 15 Thieves\' Tools to jam the mechanism.', ifTriggered: '+8 to hit, 2d10 slashing damage. Triggers each round.' },
  { trap: 'Symbol', detection: 'DC 15 Investigation or Detect Magic', disarm: 'Dispel Magic (DC 15+).', ifTriggered: 'Varies: Death (10d10 necrotic), Stun, Sleep, Fear, etc.' },
  { trap: 'Sphere of Annihilation', detection: 'DC 20 Arcana (looks like dark void)', disarm: 'Control with Talisman of the Sphere. Otherwise, don\'t touch it.', ifTriggered: '4d10 force damage. 90% of you is destroyed.' },
];

export function canDetectTrap(passivePerception, trapDC) {
  return passivePerception >= trapDC;
}

export function canDisarm(toolsBonus, trapDC) {
  // Returns probability of success
  const needed = trapDC - toolsBonus;
  if (needed <= 1) return { chance: '100%', assessment: 'Easy — guaranteed.' };
  if (needed <= 8) return { chance: `${(21 - needed) * 5}%`, assessment: 'Good odds.' };
  if (needed <= 14) return { chance: `${(21 - needed) * 5}%`, assessment: 'Risky. Consider alternatives.' };
  return { chance: `${Math.max(5, (21 - needed) * 5)}%`, assessment: 'Very difficult. Find another way.' };
}
