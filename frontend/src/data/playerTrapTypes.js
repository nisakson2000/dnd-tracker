/**
 * playerTrapTypes.js
 * Player Mode: Common trap types, detection, and disarming
 * Pure JS — no React dependencies.
 */

export const TRAP_SEVERITY = [
  { severity: 'Setback', levels: '1-4', saveDC: '10-11', attackBonus: '+3-5', damage: '1d10' },
  { severity: 'Dangerous', levels: '5-10', saveDC: '12-15', attackBonus: '+6-8', damage: '2d10' },
  { severity: 'Deadly', levels: '11-16', saveDC: '16-20', attackBonus: '+9-12', damage: '4d10' },
  { severity: 'Epic', levels: '17-20', saveDC: '21+', attackBonus: '+13+', damage: '10d10' },
];

export const COMMON_TRAPS = [
  { name: 'Pit Trap', detection: 'DC 15 Perception or Investigation', disarm: 'DC 10-15 Thieves\' Tools or jump across', effect: '1d6-2d6 bludgeoning per 10ft depth. May have spikes (+1d6 piercing).' },
  { name: 'Poison Needle', detection: 'DC 15-20 Perception', disarm: 'DC 15 Thieves\' Tools', effect: '1 piercing + poison (1d10-4d10, CON save).' },
  { name: 'Poison Dart', detection: 'DC 15 Perception', disarm: 'DC 15 Thieves\' Tools', effect: '1d4 piercing + 2d6 poison (CON save for half).' },
  { name: 'Collapsing Roof', detection: 'DC 10 Investigation (cracks)', disarm: 'Shore up with supports (DC 15 STR/tools)', effect: '4d10 bludgeoning in 10ft radius (DEX save half). Creates difficult terrain.' },
  { name: 'Fire Trap', detection: 'DC 15 Perception or Detect Magic', disarm: 'DC 15 Thieves\' Tools or Dispel Magic', effect: '4d6 fire in 20ft radius (DEX save half).' },
  { name: 'Net Trap', detection: 'DC 12 Perception', disarm: 'DC 10 Thieves\' Tools or cut the trigger line', effect: 'Restrained. DC 12 STR or DEX to escape. Net has AC 10, 5 HP.' },
  { name: 'Swinging Blade', detection: 'DC 15 Perception', disarm: 'DC 15 Thieves\' Tools (jam mechanism)', effect: '3d10 slashing (DEX save for half). Resets each round.' },
  { name: 'Glyph of Warding', detection: 'DC 15 Investigation or Detect Magic', disarm: 'Dispel Magic or avoid trigger', effect: '5d8 elemental damage (DEX save half) or stored spell triggers.' },
  { name: 'Symbol', detection: 'DC 15 Investigation or Detect Magic', disarm: 'Dispel Magic (DC 17+)', effect: 'Various: Death (10d10 necrotic), Fear, Insanity, Pain, Sleep, Stunning.' },
  { name: 'Sphere of Annihilation', detection: 'DC 20 Arcana', disarm: 'Control with Talisman of the Sphere or DC 25 Arcana', effect: 'Obliterates anything that touches it. 4d10 necrotic within 5ft.' },
];

export const TRAP_DETECTION_METHODS = [
  { method: 'Passive Perception', description: 'DM compares your passive Perception to trap DC. No action needed.' },
  { method: 'Active Search', description: 'Use Investigation or Perception as an action to search a specific area.' },
  { method: 'Detect Magic', description: 'Reveals magical traps (Glyph of Warding, Symbol, etc.) as auras.' },
  { method: 'Find Traps (2nd)', description: 'Reveals presence of traps within 120ft. Doesn\'t pinpoint or disarm.' },
  { method: 'Familiar Scouting', description: 'Send familiar ahead to trigger traps. It disappears but you\'re safe.' },
  { method: 'Mage Hand', description: 'Trigger pressure plates or open containers from 30ft away.' },
  { method: '10-foot Pole', description: 'Classic dungeon tool. Prod the ground ahead of you.' },
];

export function getTrapSeverity(partyLevel) {
  if (partyLevel >= 17) return TRAP_SEVERITY[3];
  if (partyLevel >= 11) return TRAP_SEVERITY[2];
  if (partyLevel >= 5) return TRAP_SEVERITY[1];
  return TRAP_SEVERITY[0];
}

export function getTrapInfo(name) {
  return COMMON_TRAPS.find(t => t.name.toLowerCase().includes((name || '').toLowerCase())) || null;
}
