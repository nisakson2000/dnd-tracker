/**
 * playerMountainEnvironment.js
 * Player Mode: Mountain, altitude, and climbing rules
 * Pure JS — no React dependencies.
 */

export const ALTITUDE_EFFECTS = [
  { altitude: 'Low (0-5,000 ft)', effect: 'No special effects.', note: 'Normal adventuring.' },
  { altitude: 'Moderate (5,000-10,000 ft)', effect: 'Mild altitude sickness possible for unacclimated creatures.', note: 'DM may call for CON checks after extended exertion.' },
  { altitude: 'High (10,000-20,000 ft)', effect: 'Each hour: DC 10 CON save or gain 1 exhaustion. Creatures adapted to high altitude auto-pass.', note: 'Acclimatize by spending 30+ days at this altitude.' },
  { altitude: 'Extreme (20,000+ ft)', effect: 'As High altitude, but DC increases to 15. Extreme cold also applies.', note: 'Very few natural creatures survive here.' },
];

export const CLIMBING_RULES = {
  normalClimbing: 'Climbing costs 1 extra foot of movement per foot climbed (effectively halved speed).',
  difficultSurface: 'Slippery or sheer surfaces require a STR (Athletics) check. DC varies: 10 (rough), 15 (smooth), 20+ (slick/overhanging).',
  climbingGear: 'Climber\'s kit: advantage on Athletics checks for climbing. Pitons + hammer for resting points.',
  spiderClimb: 'Spider Climb spell: climb at full speed, even on ceilings. No checks needed.',
  falling: 'Falling: 1d6 bludgeoning per 10 feet fallen (max 20d6). Land prone.',
};

export const MOUNTAIN_HAZARDS = [
  { hazard: 'Avalanche', effect: 'DC 15 DEX save or 4d10 bludgeoning + buried. Buried = restrained, suffocating.', trigger: 'Loud noise, Thunderwave, explosions.' },
  { hazard: 'Rockslide', effect: 'DC 12 DEX save or 2d6 bludgeoning + difficult terrain.', trigger: 'Earthquakes, heavy rain, combat vibrations.' },
  { hazard: 'Thin Ice / Weak Ground', effect: 'DC 10 DEX save or fall through. Falling into water = extreme cold rules apply.', trigger: 'Weight threshold, fire, vibration.' },
  { hazard: 'High Winds', effect: 'Disadvantage on ranged attacks. DC 10 STR save or be pushed 10ft. Flying creatures pushed 2x.', trigger: 'Mountain passes, ridgelines, storms.' },
  { hazard: 'Lightning Storm', effect: 'Metal armor = disadvantage on save. 8d6 lightning damage, DEX save DC 15 for half.', trigger: 'Random during storms, metal exposure.' },
  { hazard: 'Altitude Sickness', effect: 'Exhaustion levels accumulate. Headache, nausea, confusion.', trigger: 'Extended time above 10,000 ft without acclimatization.' },
];

export function getAltitudeEffect(altitudeFt) {
  if (altitudeFt >= 20000) return ALTITUDE_EFFECTS[3];
  if (altitudeFt >= 10000) return ALTITUDE_EFFECTS[2];
  if (altitudeFt >= 5000) return ALTITUDE_EFFECTS[1];
  return ALTITUDE_EFFECTS[0];
}
