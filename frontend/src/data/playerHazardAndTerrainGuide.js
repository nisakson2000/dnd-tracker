/**
 * playerHazardAndTerrainGuide.js
 * Player Mode: Environmental hazards — rules for fire, water, falling, weather, etc.
 * Pure JS — no React dependencies.
 */

export const FALLING = {
  damage: '1d6 bludgeoning per 10ft fallen. Max 20d6 (200ft).',
  landing: 'You land prone.',
  save: 'No save. Automatic damage.',
  prevention: 'Feather Fall (reaction), Fly, Levitate, Slow Fall (Monk L4).',
};

export const SUFFOCATION = {
  holdBreath: '1 + CON mod minutes (minimum 30 seconds).',
  outOfAir: 'Survive CON mod rounds (minimum 1) after out of breath.',
  death: 'Next turn after that: drop to 0 HP. Dying.',
};

export const HAZARDS = [
  { hazard: 'Extreme Cold', effect: 'DC 10 CON save/hour or exhaustion.', fix: 'Cold gear, fire, resistance.' },
  { hazard: 'Extreme Heat', effect: 'DC 5+ CON save/hour or exhaustion.', fix: 'Water, shade, resistance.' },
  { hazard: 'Strong Wind', effect: 'Disadvantage ranged attacks and hearing Perception.', fix: 'Shelter.' },
  { hazard: 'Heavy Precipitation', effect: 'Lightly obscured. Extinguishes flames.', fix: 'Shelter, darkvision.' },
  { hazard: 'Frigid Water', effect: 'DC 10 CON save/minute or exhaustion.', fix: 'Cold resistance, dry off.' },
  { hazard: 'Quicksand', effect: 'Sink. Restrained. Athletics to escape.', fix: 'Rope, Misty Step, fly.' },
  { hazard: 'Lava', effect: '10d10 fire on entry or start of turn.', fix: 'Fire immunity, fly.' },
  { hazard: 'Thin Ice', effect: 'DEX DC 10 or fall through.', fix: 'Spread weight, fly.' },
  { hazard: 'High Altitude', effect: 'Half speed or CON save vs exhaustion above 10,000ft.', fix: 'Acclimatization.' },
  { hazard: 'Desecrated Ground', effect: 'Undead advantage on saves. Healing halved.', fix: 'Hallow spell.' },
];

export const DIFFICULT_TERRAIN = {
  rule: '1 foot costs 2 feet of movement.',
  examples: 'Rubble, ice, shallow water, underbrush, stairs, snow, mud.',
  crawling: '1 foot costs 3 feet through difficult terrain.',
  spellTerrain: 'Spike Growth, Plant Growth, Web, Entangle.',
  immunity: 'Freedom of Movement, Land\'s Stride (nonmagical only).',
};

export const HAZARD_TIPS = [
  'Falling: 1d6/10ft. Max 20d6 at 200ft.',
  'Feather Fall: reaction. Saves lives. Always prepare.',
  'Suffocation: 1+CON mod minutes breath. Then CON mod rounds.',
  'Extreme temps: CON saves vs exhaustion. Prepare accordingly.',
  'Lava: 10d10 fire. Avoid at all costs.',
  'Difficult terrain: double movement cost.',
  'Freedom of Movement: ignore difficult terrain and grapples.',
  'Tiny Hut: shelter from all weather.',
  'Water Breathing: 24h, ritual. Prevent drowning.',
  'Always scout for hazards before rushing in.',
];
