/**
 * playerLightRules.js
 * Player Mode: Light levels, vision, and light sources
 * Pure JS — no React dependencies.
 */

export const LIGHT_LEVELS = [
  { level: 'Bright Light', effect: 'Normal vision. Most creatures see fine.', examples: ['Daylight', 'Torch radius (inner)', 'Light/Daylight spell'] },
  { level: 'Dim Light', effect: 'Lightly obscured. Disadvantage on Perception (sight). Darkvision sees as if bright.', examples: ['Twilight', 'Torch edge', 'Full moon', 'Dancing Lights'] },
  { level: 'Darkness', effect: 'Heavily obscured. Effectively blinded. Darkvision sees as dim light (still disadvantage on Perception).', examples: ['Night without moon', 'Unlit dungeon', 'Darkness spell'] },
];

export const VISION_TYPES = [
  { type: 'Normal Vision', range: 'Relies on light', description: 'Can\'t see in darkness at all.' },
  { type: 'Darkvision', range: '60ft (most), 120ft (Drow, Deep Gnome)', description: 'See in darkness as dim light (grayscale). Still disadvantage on Perception in darkness.' },
  { type: 'Superior Darkvision', range: '120ft', description: 'Same as darkvision but extended range. Drow, Duergar, Deep Gnome.' },
  { type: 'Blindsight', range: 'Varies (10-60ft)', description: 'Perceive surroundings without sight. Not affected by blindness, darkness, or invisibility within range.' },
  { type: 'Tremorsense', range: 'Varies', description: 'Detect creatures touching the same ground. Does not work against flying or ethereal creatures.' },
  { type: 'Truesight', range: 'Varies (usually 120ft)', description: 'See in darkness, see invisible, see through illusions, detect shapechangers, see into Ethereal Plane.' },
  { type: 'Devil\'s Sight', range: '120ft', description: 'Warlock invocation. See normally in all darkness, including magical darkness.' },
];

export const LIGHT_SOURCES = [
  { source: 'Candle', bright: '5 ft', dim: '5 ft (beyond bright)', duration: '1 hour', notes: 'Fragile, extinguished by wind.' },
  { source: 'Lamp', bright: '15 ft', dim: '30 ft', duration: '6 hours (1 pint oil)', notes: 'Can be hooded to block light.' },
  { source: 'Lantern, Hooded', bright: '30 ft', dim: '30 ft', duration: '6 hours', notes: 'Can lower hood to dim 5ft only.' },
  { source: 'Lantern, Bullseye', bright: '60 ft cone', dim: '60 ft', duration: '6 hours', notes: 'Directional beam, 60ft cone.' },
  { source: 'Torch', bright: '20 ft', dim: '20 ft', duration: '1 hour', notes: 'Can be used as improvised weapon (1 fire damage).' },
  { source: 'Light (cantrip)', bright: '20 ft', dim: '20 ft', duration: '1 hour (concentration-free)', notes: 'Cast on object. No concentration.' },
  { source: 'Dancing Lights', bright: '—', dim: '10 ft each', duration: '1 minute (concentration)', notes: 'Up to 4 lights, move 60ft as bonus action.' },
  { source: 'Continual Flame', bright: '20 ft', dim: '20 ft', duration: 'Permanent', notes: '50 gp ruby dust. Can be covered/hidden. Not suppressed by Darkness.' },
  { source: 'Daylight (3rd)', bright: '60 ft', dim: '60 ft', duration: '1 hour (no concentration)', notes: 'Not actual sunlight. Dispels darkness spells of 3rd level or lower.' },
];

export const DARKNESS_INTERACTIONS = [
  'Darkvision does NOT let you see in magical darkness (Darkness spell).',
  'Devil\'s Sight (Warlock) sees through ALL darkness, including magical.',
  'The Darkness + Devil\'s Sight combo: you can see, enemies can\'t. Attacks against you have disadvantage, yours have advantage.',
  'Daylight spell dispels Darkness of 3rd level or lower.',
  'Continual Flame is NOT dispelled by Darkness — they cancel each other\'s effects in the overlap.',
  'Shadow of Moil creates magical darkness around you + deals damage to attackers.',
];

export function getVisionType(type) {
  return VISION_TYPES.find(v => v.type.toLowerCase() === (type || '').toLowerCase()) || null;
}

export function getLightSource(source) {
  return LIGHT_SOURCES.find(l => l.source.toLowerCase().includes((source || '').toLowerCase())) || null;
}
