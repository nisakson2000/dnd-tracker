/**
 * playerWeatherCombat.js
 * Player Mode: Weather effects on combat and tactical adjustments
 * Pure JS — no React dependencies.
 */

export const WEATHER_COMBAT_EFFECTS = [
  { weather: 'Heavy Rain', visibility: 'Lightly obscured', effects: ['Disadvantage on Perception checks relying on sight', 'Extinguishes open flames', 'Disadvantage on ranged attacks beyond normal range', 'Fire damage reduced by half (DM discretion)'], tacticalTip: 'Close to melee range. Rain favors melee fighters and stealth.' },
  { weather: 'Heavy Snow', visibility: 'Lightly obscured', effects: ['Difficult terrain (halved movement)', 'Tracks are easy to follow (Survival DC 10)', 'Cold damage sources are enhanced (DM discretion)'], tacticalTip: 'Movement is king. Ignore difficult terrain effects are incredibly valuable.' },
  { weather: 'Fog', visibility: 'Heavily obscured', effects: ['Effectively blinded beyond fog range', 'Can\'t target creatures you can\'t see (most spells)', 'Advantage on Stealth checks', 'Counterspell blocked (can\'t see caster)'], tacticalTip: 'Blindsight and Tremorsense bypass fog. AoE spells don\'t need to see targets.' },
  { weather: 'Strong Wind', visibility: 'Normal', effects: ['Disadvantage on ranged weapon attacks', 'Tiny creatures may be pushed (STR save)', 'Fog/gas effects dispersed', 'Flying creatures have disadvantage on checks to maintain flight'], tacticalTip: 'Ground-based melee dominates. Don\'t rely on ranged or flying.' },
  { weather: 'Extreme Heat', visibility: 'Normal', effects: ['CON save DC 5 (increasing +1/hour) or gain exhaustion', 'Heavy armor: disadvantage on the save', 'Fire damage vulnerability possible (DM call)'], tacticalTip: 'Remove heavy armor if possible. Create Water and Prestidigitation for cooling.' },
  { weather: 'Extreme Cold', visibility: 'Normal', effects: ['CON save DC 10 each hour or gain exhaustion', 'Cold resistance negates', 'Unprotected creatures take cold damage'], tacticalTip: 'Cold resistance is mandatory. Endure Elements, warm clothing, or racial resistance.' },
  { weather: 'Lightning Storm', visibility: 'Intermittent (lightning flashes)', effects: ['Deafening thunder: disadvantage on Perception (hearing)', 'Metal armor attracts lightning (DM may target armored creatures)', 'Bright flashes may reveal hidden creatures momentarily'], tacticalTip: 'Doff metal armor if possible. Use thunder to mask spell verbal components.' },
  { weather: 'Sandstorm', visibility: 'Heavily obscured', effects: ['1d4 slashing damage per round (unprotected)', 'Blinded while in the storm', 'Difficult terrain', 'Equipment may be damaged'], tacticalTip: 'Find cover immediately. Leomund\'s Tiny Hut is perfect. Wind Wall blocks it.' },
];

export const WEATHER_SPELLS = [
  { spell: 'Control Weather', level: 8, effect: 'Change weather in 5-mile radius. Takes 1d4×10 minutes.', note: 'Concentration 8 hours. Can clear any weather condition.' },
  { spell: 'Call Lightning', level: 3, effect: '3d10 lightning damage. +d10 during storms (natural).', note: 'Storm weather = free bonus damage. Great in thunderstorms.' },
  { spell: 'Fog Cloud', level: 1, effect: 'Create fog. Heavily obscures.', note: 'Works like fog weather but you control placement.' },
  { spell: 'Gust of Wind', level: 2, effect: '60ft line of strong wind.', note: 'Disperses gas/fog. Pushes creatures 15ft.' },
  { spell: 'Wind Wall', level: 3, effect: 'Wall of wind blocks projectiles and gases.', note: 'Blocks arrows, bolts, and sandstorm particles.' },
  { spell: 'Sleet Storm', level: 3, effect: 'Create frozen rain. Difficult terrain + prone risk.', note: 'Concentration breaker. Forces repeated saves.' },
];

export function getWeatherEffects(weather) {
  return WEATHER_COMBAT_EFFECTS.find(w =>
    w.weather.toLowerCase().includes((weather || '').toLowerCase())
  ) || null;
}

export function getWeatherCounterSpells(weather) {
  const weatherInfo = getWeatherEffects(weather);
  if (!weatherInfo) return [];
  return WEATHER_SPELLS.filter(s =>
    s.note.toLowerCase().includes(weather.toLowerCase()) ||
    s.effect.toLowerCase().includes(weather.toLowerCase())
  );
}
