/**
 * playerEnvironmentSurvivalGuide.js
 * Player Mode: Environmental hazards — lava, water, falling, extreme weather
 * Pure JS — no React dependencies.
 */

export const FALLING_DAMAGE = {
  rule: '1d6 bludgeoning per 10ft fallen. Maximum 20d6 (200ft).',
  average: { '10ft': 3.5, '20ft': 7, '30ft': 10.5, '50ft': 17.5, '100ft': 35, '200ft': 70 },
  mitigation: [
    { method: 'Feather Fall', effect: 'Reaction: slow fall. No damage. Up to 5 creatures.', rating: 'S+' },
    { method: 'Monk Slow Fall', effect: 'Reduce by 5× Monk level. Reaction.', rating: 'A+' },
    { method: 'Fly / Levitate', effect: 'Don\'t fall.', rating: 'S' },
    { method: 'Rage (then fall)', effect: 'Resistance to bludgeoning. Half fall damage.', rating: 'A' },
  ],
};

export const DROWNING_RULES = {
  holdBreath: '1 + CON modifier minutes (minimum 30 seconds).',
  suffocating: 'After breath runs out: survive CON modifier rounds (min 1). Then 0 HP.',
  mitigation: [
    { method: 'Water Breathing (ritual)', effect: 'Breathe underwater 24 hours.', rating: 'S' },
    { method: 'Alter Self', effect: 'Gills + swim speed.', rating: 'A+' },
    { method: 'Triton / Water Genasi', effect: 'Natural water breathing.', rating: 'S' },
  ],
};

export const LAVA_AND_FIRE = {
  lava: { damage: '10d10 fire (entering or start turn). 18d10 submerged.', note: 'Fly over. Wall of Force bridge.' },
  magma: { damage: 'Same as lava. Volcanic environments.', note: 'Fire immunity is the only safe option.' },
  wildfire: { damage: 'DM-dependent. Usually 2d6-4d6 fire per round in area.', note: 'Create Water. Control Water. Fly over.' },
};

export const EXTREME_WEATHER = {
  extremeCold: { save: 'DC 10 CON each hour. Fail = 1 exhaustion.', gear: 'Cold weather clothes = advantage on save.' },
  extremeHeat: { save: 'DC 5 CON each hour (+1/hour). Fail = 1 exhaustion.', gear: 'Extra water consumption.' },
  highAltitude: { save: 'DC 10 CON each hour above 10,000ft. Fail = 1 exhaustion.', gear: 'Acclimate 1-3 days.' },
};

export const OTHER_HAZARDS = [
  { hazard: 'Quicksand', effect: 'Sink 1d4+1 ft/round. Restrained. DC 15 STR to escape.', counter: 'Rope. Fly. Misty Step.' },
  { hazard: 'Slippery Ice', effect: 'Difficult terrain. DC 10 DEX or fall prone.', counter: 'Spider Climb. Fly. Spike boots.' },
  { hazard: 'Cave-in', effect: 'DC 15 DEX save. 4d10 bludgeoning + buried.', counter: 'Stone Shape. Dimension Door.' },
  { hazard: 'Razorvine', effect: 'DC 10 DEX or 1d10 slashing.', counter: 'Burn it. Fly over.' },
  { hazard: 'Frigid Water', effect: 'DC 10 CON/minute or 1 exhaustion.', counter: 'Cold resistance. Get out fast.' },
];

export const ENVIRONMENT_SURVIVAL_TIPS = [
  'Feather Fall: always prepared. Falling is common and deadly.',
  'Water Breathing: ritual cast. Free underwater exploration.',
  'Lava: 10d10 fire. Fly over it. Wall of Force bridge.',
  'Exhaustion stacks. Extreme weather = quick death if unprepared.',
  'Tiny Hut: comfortable atmosphere regardless of weather.',
  'Cold weather gear: advantage on CON saves. Buy before going north.',
  'Create Water: solve dehydration for the whole party.',
  'Cave-ins: Stone Shape or Dimension Door to escape.',
  'Environmental damage bypasses AC. Only saves and resistance help.',
  'Always have an escape plan: Misty Step, Dimension Door, Fly.',
];
