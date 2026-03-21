/**
 * playerLightingVisionGuide.js
 * Player Mode: Lighting, vision types, and darkness rules
 * Pure JS — no React dependencies.
 */

export const LIGHTING_LEVELS = [
  { level: 'Bright Light', effect: 'Normal vision. No penalties.', examples: 'Daylight, torches within radius, Light cantrip, Daylight spell.' },
  { level: 'Dim Light', effect: 'Lightly obscured. Disadvantage on Perception (sight).', examples: 'Twilight, torchlight edges, moonlight, dawn/dusk.' },
  { level: 'Darkness', effect: 'Heavily obscured. Effectively blind. Can\'t see.', examples: 'Underground, moonless night, Darkness spell, deep forest.' },
];

export const VISION_TYPES = [
  { type: 'Normal Vision', range: 'Varies', effect: 'See in bright light. Dim = disadvantage Perception. Darkness = blind.', races: 'Humans, Dragonborn, Halflings.' },
  { type: 'Darkvision', range: '60ft (some 120ft)', effect: 'See in darkness as dim light (grayscale). Dim light as bright.', races: 'Elves, Dwarves, Half-Orcs, Gnomes, Tieflings, etc. Most races.' },
  { type: 'Superior Darkvision', range: '120ft', effect: 'Same as darkvision but double range.', races: 'Drow, Deep Gnome (Svirfneblin), Duergar.' },
  { type: 'Devil\'s Sight', range: '120ft', effect: 'See in ALL darkness, including magical. Full color.', races: 'Warlock invocation. NOT darkvision.' },
  { type: 'Blindsight', range: '10-120ft', effect: 'Perceive surroundings without sight. Works in magical darkness.', races: 'Some monsters. Blind Fighting style (10ft).' },
  { type: 'Truesight', range: '120ft', effect: 'See in all darkness. See invisible. See through illusions. See into Ethereal.', races: 'True Seeing spell. Very rare.' },
  { type: 'Tremorsense', range: '30-60ft', effect: 'Detect creatures touching the ground via vibrations.', races: 'Some monsters. Earth Elemental.' },
];

export const LIGHT_SOURCES = [
  { source: 'Torch', bright: '20ft', dim: '40ft', duration: '1 hour', note: 'Free hand required. 1cp.' },
  { source: 'Lantern (Hooded)', bright: '30ft', dim: '60ft', duration: '6 hours (1 pint oil)', note: 'Can lower hood to reduce to 5ft dim. Best mundane option.' },
  { source: 'Lantern (Bullseye)', bright: '60ft cone', dim: '120ft cone', duration: '6 hours', note: 'Directional. 60ft bright cone.' },
  { source: 'Candle', bright: '5ft', dim: '10ft', duration: '1 hour', note: 'Very short range. 1cp.' },
  { source: 'Light cantrip', bright: '20ft', dim: '40ft', duration: '1 hour', note: 'No hands needed. Attach to weapon/shield. Free.' },
  { source: 'Dancing Lights', bright: 'None (dim 10ft each)', dim: '10ft per light (4 lights)', duration: 'Concentration, 1 min', note: 'Concentration is the cost. Flexible positioning.' },
  { source: 'Continual Flame', bright: '20ft', dim: '40ft', duration: 'Permanent', note: '50gp ruby dust. Permanent torch. Worth the investment.' },
  { source: 'Daylight (L3)', bright: '60ft', dim: '120ft', duration: 'Concentration, 1 hour', note: 'Not actual sunlight (doesn\'t harm vampires). Very bright.' },
];

export const DARKNESS_COMBAT_IMPLICATIONS = {
  blind: 'Blinded: auto-fail sight checks. Attacks have disadvantage. Attacks against you have advantage.',
  bothBlind: 'Both attacker and target blind: advantage and disadvantage cancel. Roll normally.',
  unseenAttacker: 'If you can see the target but they can\'t see you: advantage.',
  unseenTarget: 'If you can\'t see the target: disadvantage. Must guess location.',
  note: 'This is why Darkness + Devil\'s Sight is so powerful: you see, they don\'t.',
};

export const VISION_TIPS = [
  'Darkvision sees darkness as DIM light. You still have disadvantage on Perception.',
  'Most races have darkvision. If yours doesn\'t, get a light source or Darkvision spell.',
  'Devil\'s Sight ≠ darkvision. It sees through MAGICAL darkness. Darkvision doesn\'t.',
  'Darkness + Devil\'s Sight: you have advantage, enemies have disadvantage. BUT allies are also blinded.',
  'Light cantrip: free, no hands. Put it on your shield or weapon.',
  'Continual Flame: 50gp for permanent light. Cast it on a coin.',
  'Blind Fighting style (10ft blindsight): works in all darkness. Fog Cloud combo.',
  'Darkvision is grayscale. You can\'t distinguish colors in darkness.',
  'Alert your party before casting Darkness. Your allies will be blinded too.',
  'Truesight sees EVERYTHING: invisible, illusions, Ethereal, true form of shapechangers.',
];
