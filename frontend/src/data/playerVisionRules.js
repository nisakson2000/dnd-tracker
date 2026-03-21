/**
 * playerVisionRules.js
 * Player Mode: Vision, light, and obscurement rules
 * Pure JS — no React dependencies.
 */

export const LIGHT_LEVELS = [
  { level: 'Bright Light', effect: 'Normal vision. No penalties.', examples: 'Daylight, Daylight spell, Light cantrip in 20ft radius, torches in 20ft.' },
  { level: 'Dim Light', effect: 'Lightly obscured. Disadvantage on Perception (sight).', examples: 'Dusk/dawn, torchlight at 20-40ft, darkvision in darkness, moonlight.' },
  { level: 'Darkness', effect: 'Heavily obscured. Effectively BLINDED without darkvision.', examples: 'Underground, moonless night, Darkness spell, inside a bag.' },
];

export const OBSCUREMENT = {
  lightlyObscured: {
    effect: 'Disadvantage on Perception checks that rely on sight.',
    examples: 'Dim light, patchy fog, moderate foliage.',
    combat: 'Can still see creatures. Can target them normally. Just harder to spot hidden things.',
  },
  heavilyObscured: {
    effect: 'Effectively BLINDED. Can\'t see anything in the area.',
    examples: 'Darkness (without darkvision), opaque fog, dense foliage.',
    combat: 'Can\'t target creatures with spells requiring sight. Attack rolls have disadvantage, attacks against you have advantage.',
  },
};

export const SPECIAL_SENSES = [
  { sense: 'Darkvision', range: 'Typically 60ft', effect: 'See in darkness as if dim light (grayscale only). Dim light as bright light.', races: 'Dwarf, Elf, Half-Elf, Gnome, Half-Orc, Tiefling', note: 'Does NOT see in magical darkness. Still dim light = disadvantage on Perception.' },
  { sense: 'Superior Darkvision', range: '120ft', effect: 'Extended darkvision range.', races: 'Drow, Deep Gnome (Svirfneblin)', note: 'Same rules as Darkvision, just farther.' },
  { sense: 'Blindsight', range: 'Varies (10-120ft)', effect: 'Perceive surroundings without sight. Unaffected by blindness, darkness, fog, invisibility.', races: 'Some monsters. Players get it from class features or items.', note: 'Counters ALL visual obscurement. The best defensive sense.' },
  { sense: 'Tremorsense', range: 'Varies (30-60ft)', effect: 'Detect creatures touching the same ground/surface.', races: 'Monsters mainly. Some subclasses.', note: 'Doesn\'t work against flying or ethereal creatures.' },
  { sense: 'Truesight', range: 'Typically 120ft', effect: 'See through magical darkness, invisibility, illusions, shapechangers, and into the Ethereal Plane.', races: 'Very rare. True Seeing spell (6th level).', note: 'The ultimate sense. Sees through EVERYTHING.' },
];

export const LIGHT_SOURCES = [
  { source: 'Torch', bright: '20ft', dim: '40ft', duration: '1 hour', hands: 1, notes: 'Can be used as improvised weapon (1 fire damage).' },
  { source: 'Lantern (Hooded)', bright: '30ft', dim: '60ft', duration: '6 hours (1 pint oil)', hands: 1, notes: 'Can be shuttered to block light. Best mundane source.' },
  { source: 'Lantern (Bullseye)', bright: '60ft cone', dim: '120ft cone', duration: '6 hours', hands: 1, notes: 'Directional. Great for scouting. Doesn\'t reveal you from behind.' },
  { source: 'Candle', bright: '5ft', dim: '10ft', duration: '1 hour', hands: 1, notes: 'Basically useless for dungeoneering. Atmospheric only.' },
  { source: 'Light cantrip', bright: '20ft', dim: '40ft', duration: '1 hour (concentration-free)', hands: 0, notes: 'Cast on an object. Free hands! Best low-level option.' },
  { source: 'Dancing Lights', bright: '10ft each (4 lights)', dim: '10ft each', duration: '1 minute (concentration)', hands: 0, notes: 'Flexible placement. Can scout ahead. But requires concentration.' },
  { source: 'Continual Flame', bright: '20ft', dim: '40ft', duration: 'Permanent', hands: 0, notes: '50 gp ruby dust. Cast once, light forever. Put it on a shield or weapon.' },
  { source: 'Driftglobe', bright: '20ft', dim: '40ft', duration: 'Until dismissed', hands: 0, notes: 'Magic item. Follows you. Can cast Daylight 1/day.' },
];

export const VISION_COMBAT_IMPLICATIONS = [
  { situation: 'Attacker can\'t see target', effect: 'Disadvantage on attack rolls.' },
  { situation: 'Target can\'t see attacker', effect: 'Attacker has advantage on attack rolls.' },
  { situation: 'Neither can see other', effect: 'Advantage and disadvantage cancel. Straight roll.' },
  { situation: 'Invisible attacker', effect: 'Advantage on attacks. Target can\'t use reactions requiring sight (no Counterspell, no Shield targeting you).' },
  { situation: 'In magical darkness', effect: 'Darkvision doesn\'t work. Only Blindsight, Tremorsense, Devil\'s Sight, or Truesight.' },
];

export function canSee(senses, lightLevel, magicalDarkness) {
  if (magicalDarkness) {
    return senses.includes('Blindsight') || senses.includes('Truesight') || senses.includes('Devil\'s Sight');
  }
  if (lightLevel === 'Darkness') {
    return senses.includes('Darkvision') || senses.includes('Superior Darkvision') || senses.includes('Blindsight') || senses.includes('Truesight');
  }
  return true;
}

export function getLightSource(name) {
  return LIGHT_SOURCES.find(l =>
    l.source.toLowerCase().includes((name || '').toLowerCase())
  ) || null;
}
