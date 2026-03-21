/**
 * playerEnvironmentalHazards.js
 * Player Mode: Environmental hazards, traps, and natural dangers
 * Pure JS — no React dependencies.
 */

export const ENVIRONMENTAL_HAZARDS = [
  {
    name: 'Extreme Cold',
    save: 'CON DC 10 (each hour exposed)',
    effect: '1 level of exhaustion on failure.',
    protection: 'Cold weather gear, resistance to cold damage, natural cold adaptation.',
  },
  {
    name: 'Extreme Heat',
    save: 'CON DC 5+1 per hour (each hour exposed)',
    effect: '1 level of exhaustion on failure. Disadvantage if wearing medium/heavy armor.',
    protection: 'Access to drinking water, resistance to fire damage.',
  },
  {
    name: 'Strong Wind',
    effect: 'Disadvantage on ranged weapon attacks and Perception checks relying on hearing. Extinguishes open flames. Fog dispersed.',
    save: null,
  },
  {
    name: 'Heavy Precipitation',
    effect: 'Lightly obscured. Disadvantage on Perception (hearing). Extinguishes open flames.',
    save: null,
  },
  {
    name: 'High Altitude (10,000+ ft)',
    effect: 'Each hour of travel counts as 2 hours for exhaustion. Half travel speed in 5+ min intervals.',
    save: null,
    acclimation: '30 days at altitude to acclimate.',
  },
  {
    name: 'Desecrated Ground',
    effect: 'Undead in area have advantage on saving throws. Dead humanoids may rise as undead.',
    save: null,
  },
  {
    name: 'Frigid Water',
    save: 'CON DC 10',
    effect: '1 level of exhaustion on failure. Cold resistance or swim speed grants immunity.',
  },
  {
    name: 'Quicksand',
    save: 'DEX DC 10 (when entering area)',
    effect: 'On failure, sink 1d4+1 feet. Athletics DC 10+depth to escape. Fully submerged = suffocating.',
  },
  {
    name: 'Razorvine',
    effect: '5 slashing damage per 5ft moved through it. AC 11, 25 HP, immune to most conditions.',
    save: null,
  },
  {
    name: 'Slippery Ice',
    save: 'DEX (Acrobatics) DC 10',
    effect: 'Fall prone on failure. Difficult terrain.',
  },
  {
    name: 'Thin Ice',
    effect: 'Weight threshold per 10ft area. Breaking through = fall into frigid water.',
    save: null,
  },
];

export const TRAP_SEVERITY = [
  { severity: 'Setback', saveDC: '10-11', attackBonus: '+3 to +5', damage: '1d10 (levels 1-4)', color: '#22c55e' },
  { severity: 'Dangerous', saveDC: '12-15', attackBonus: '+6 to +8', damage: '2d10 (levels 1-4), 4d10 (5-10)', color: '#eab308' },
  { severity: 'Deadly', saveDC: '16-20', attackBonus: '+9 to +12', damage: '4d10 (levels 1-4), 10d10 (5-10)', color: '#ef4444' },
];

export function getHazard(name) {
  return ENVIRONMENTAL_HAZARDS.find(h => h.name.toLowerCase().includes(name.toLowerCase())) || null;
}

export function getTrapSeverity(severity) {
  return TRAP_SEVERITY.find(t => t.severity.toLowerCase() === severity.toLowerCase()) || null;
}
