/**
 * playerWeatherEffects.js
 * Player Mode: Weather conditions and their combat/travel effects
 * Pure JS — no React dependencies.
 */

export const WEATHER_CONDITIONS = [
  {
    weather: 'Clear',
    visibility: 'Normal',
    combatEffect: 'No special effects.',
    travelEffect: 'Normal travel speed.',
    color: '#fbbf24',
  },
  {
    weather: 'Light Rain',
    visibility: 'Normal',
    combatEffect: 'Extinguishes small open flames.',
    travelEffect: 'Normal speed. Tracks easier to follow (+2 Survival).',
    color: '#94a3b8',
  },
  {
    weather: 'Heavy Rain',
    visibility: 'Lightly obscured',
    combatEffect: 'Disadvantage on Perception (hearing). Extinguishes flames. Disadvantage on ranged attacks beyond 30ft (optional).',
    travelEffect: 'Half speed in unpaved areas. Navigation DC +2.',
    color: '#64748b',
  },
  {
    weather: 'Thunderstorm',
    visibility: 'Heavily obscured during lightning',
    combatEffect: 'Heavy rain effects + lightning risk. Metal armor: lightning targets you.',
    travelEffect: 'Half speed. Navigation DC +5. Seek shelter.',
    color: '#475569',
  },
  {
    weather: 'Fog',
    visibility: 'Heavily obscured (beyond 30-60ft)',
    combatEffect: 'Can\'t target creatures you can\'t see. Ranged attacks have disadvantage. Opportunity attacks may fail.',
    travelEffect: 'Half speed. Easy to get lost. Navigation DC +5.',
    color: '#cbd5e1',
  },
  {
    weather: 'Snow',
    visibility: 'Lightly obscured',
    combatEffect: 'Difficult terrain (light snow). Extinguishes flames.',
    travelEffect: 'Half speed. Tracks very easy to follow.',
    color: '#e2e8f0',
  },
  {
    weather: 'Blizzard',
    visibility: 'Heavily obscured',
    combatEffect: 'Difficult terrain. Disadvantage on Perception. Extreme cold rules apply.',
    travelEffect: 'Quarter speed. Navigation DC +10. Exhaustion risk (DC 10 CON/hour).',
    color: '#f1f5f9',
  },
  {
    weather: 'Extreme Heat',
    visibility: 'Normal (heat shimmer at distance)',
    combatEffect: 'Heavy armor: disadvantage on CON saves. Exhaustion risk after prolonged combat.',
    travelEffect: 'DC 5 CON save/hour (+1/subsequent). Failure = exhaustion. Water consumption doubled.',
    color: '#f97316',
  },
  {
    weather: 'Extreme Cold',
    visibility: 'Normal',
    combatEffect: 'Cold damage risk. Cold resistance helps.',
    travelEffect: 'DC 10 CON save/hour. Failure = exhaustion. Need cold weather gear.',
    color: '#7dd3fc',
  },
  {
    weather: 'High Wind',
    visibility: 'Normal (but hearing impaired)',
    combatEffect: 'Disadvantage on ranged attacks. Flying creatures pushed. Disadvantage on Perception (hearing).',
    travelEffect: 'Flying: speed halved or impossible. Sailing: speed increased or capsizing risk.',
    color: '#a5b4fc',
  },
];

export function getWeatherEffects(weather) {
  return WEATHER_CONDITIONS.find(w => w.weather.toLowerCase() === (weather || '').toLowerCase()) || null;
}

export function getWeatherColor(weather) {
  const w = getWeatherEffects(weather);
  return w ? w.color : '#6b7280';
}
