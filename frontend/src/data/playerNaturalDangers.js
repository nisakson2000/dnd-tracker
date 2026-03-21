/**
 * playerNaturalDangers.js
 * Player Mode: Environmental hazards, weather, and survival
 * Pure JS — no React dependencies.
 */

export const FALL_DAMAGE = {
  rule: '1d6 per 10ft. Max 20d6 (200ft).',
  avg: { '10ft': 3.5, '20ft': 7, '50ft': 17.5, '100ft': 35, '200ft': 70 },
  prevention: ['Feather Fall (reaction)', 'Slow Fall (Monk)', 'Wild Shape before impact', 'Fly/Levitate'],
};

export const LAVA = { damage: '10d10 fire (entering/start of turn). Submersion: 18d10.', counter: 'Fire immunity or avoid.' };

export const TEMPERATURES = {
  cold: 'DC 10 CON/hour or exhaustion. Cold weather gear → advantage.',
  heat: 'DC 5 CON/hour (+1/hour). Fire resistance auto-succeeds.',
  altitude: 'Above 10,000ft: DC 10 CON/hour or exhaustion.',
};

export const HAZARDS = [
  { hazard: 'Quicksand', effect: 'Sink 1d4+1 ft/round. STR DC 10 to escape.', counter: 'Rope. Don\'t struggle.' },
  { hazard: 'Avalanche', effect: '4d10 bludgeoning. DEX DC 15 half. May bury.', counter: 'High ground. Mold Earth to dig out.' },
  { hazard: 'Flash Flood', effect: 'STR save or swept 60ft. 4d6 bludgeoning.', counter: 'High ground. Control Water.' },
  { hazard: 'Poison Gas', effect: 'CON save or poisoned/damage.', counter: 'Gust of Wind. Hold breath. Poison resistance.' },
  { hazard: 'Cave-in', effect: '4d10 bludgeoning. DEX save or buried.', counter: 'Stone Shape. Mold Earth.' },
  { hazard: 'Thin Ice', effect: 'DEX DC 10 or fall through. Cold water = exhaustion.', counter: 'Water Walking. Prone to spread weight.' },
];

export const WEATHER = [
  { type: 'Heavy Rain', effect: 'Lightly obscured. Disadv Perception. Flames out.' },
  { type: 'Strong Wind', effect: 'Disadv ranged. Flames out. Flight difficult.' },
  { type: 'Heavy Snow', effect: 'Heavily obscured. Difficult terrain. Cold.' },
  { type: 'Fog', effect: 'Heavily obscured. Hide easily. Ranged limited.' },
];

export function fallDmg(ft) { return Math.min(20, Math.floor(ft / 10)) * 3.5; }
export function heatDC(hours) { return 5 + Math.max(0, hours - 1); }
