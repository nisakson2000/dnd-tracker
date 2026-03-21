/**
 * playerLightingVisionRulesGuide.js
 * Player Mode: Lighting, vision types, and obscurement rules
 * Pure JS — no React dependencies.
 */

export const LIGHTING_LEVELS = [
  { level: 'Bright Light', effect: 'Normal vision. All creatures see normally.', examples: 'Daylight, torches (20ft), Light cantrip, Daylight spell.' },
  { level: 'Dim Light', effect: 'Lightly obscured. Disadvantage on Perception checks relying on sight.', examples: 'Twilight, torchlight edges (20-40ft), moonlight, dawn/dusk.' },
  { level: 'Darkness', effect: 'Heavily obscured. Effectively blinded (auto-fail sight checks, disadvantage on attacks, attacks against have advantage).', examples: 'Night without moon, deep underground, inside a dark building.' },
];

export const VISION_TYPES = [
  { type: 'Normal Vision', range: 'Unlimited in bright light', effect: 'Standard sight. Needs light to function.', note: 'Most humans, halflings.' },
  { type: 'Darkvision', range: '60ft (some 120ft)', effect: 'See in darkness as if dim light (grays, no color). Dim light as bright.', note: 'Most non-human races. Dwarves, Elves, Half-Orcs, Tieflings, etc.' },
  { type: 'Superior Darkvision', range: '120ft', effect: 'Same as Darkvision but double range.', note: 'Drow, Duergar, Deep Gnome, Owlin, Gloom Stalker.' },
  { type: 'Blindsight', range: '10-120ft (varies)', effect: 'Perceive surroundings without sight. Not affected by blindness, darkness, or invisibility.', note: 'Blind Fighting style (10ft). Some monsters. Bat familiar.' },
  { type: 'Truesight', range: '120ft (typically)', effect: 'See through magical darkness, invisibility, illusions, shapechangers, into Ethereal Plane.', note: 'Extremely rare for PCs. True Seeing spell (L6). Some high-CR monsters.' },
  { type: 'Tremorsense', range: '30-60ft', effect: 'Detect creatures touching same ground surface. Not affected by invisibility or darkness.', note: 'Rare for PCs. Earth Elemental, some beasts.' },
];

export const OBSCUREMENT = {
  lightlyObscured: {
    effect: 'Disadvantage on Perception checks that rely on sight.',
    sources: ['Dim light', 'Patchy fog', 'Moderate foliage', 'Fog Cloud edges'],
    note: 'You CAN see, just not well. No disadvantage on attacks.',
  },
  heavilyObscured: {
    effect: 'Effectively blinded: auto-fail sight checks, disadvantage on attacks, attacks against you have advantage.',
    sources: ['Darkness (without Darkvision)', 'Opaque fog', 'Dense foliage', 'Darkness spell', 'Fog Cloud center'],
    note: 'Can\'t see = can\'t target with "creature you can see" spells. Devastating for casters.',
  },
};

export const DARKVISION_MISCONCEPTIONS = [
  'Darkvision does NOT let you see in darkness as normal. Darkness → dim light → disadvantage on Perception.',
  'Darkvision only works in DARKNESS → treats as DIM LIGHT. There\'s still disadvantage on Perception.',
  'Dim light with Darkvision → bright light equivalent. This is the part that\'s great.',
  'Darkvision doesn\'t see through magical darkness. Only Devil\'s Sight and Truesight do.',
  'Darkvision is grayscale. No color perception in darkness.',
  'Stealth in darkness vs Darkvision: you\'re lightly obscured, not invisible. You can still be seen.',
];

export const LIGHT_SOURCES = [
  { source: 'Torch', bright: '20ft', dim: '40ft', duration: '1 hour', note: 'Free hand required.' },
  { source: 'Lantern (hooded)', bright: '30ft', dim: '60ft', duration: '6 hours', note: 'Can hood to dim 5ft.' },
  { source: 'Lantern (bullseye)', bright: '60ft cone', dim: '120ft cone', duration: '6 hours', note: 'Directional.' },
  { source: 'Light (cantrip)', bright: '20ft', dim: '40ft', duration: '1 hour', note: 'No hand required. Cast on object.' },
  { source: 'Dancing Lights (cantrip)', bright: '10ft each', dim: '10ft', duration: '1 min (concentration)', note: '4 lights. Move as BA.' },
  { source: 'Continual Flame (L2)', bright: '20ft', dim: '40ft', duration: 'Forever', note: '50gp. Permanent. Can be covered but never goes out.' },
  { source: 'Daylight (L3)', bright: '60ft', dim: '60ft', duration: '1 hour', note: 'Not actual sunlight. Counters Darkness.' },
];

export const VISION_COMBAT_TIPS = [
  'In darkness, creatures without Darkvision are effectively blind. Exploit this.',
  'Gloom Stalker: invisible to Darkvision. In darkness, you\'re unseen even by Darkvision.',
  'Fog Cloud: blocks ALL vision, including Darkvision. Cheap anti-ranged tool.',
  'Devil\'s Sight + Darkness: you see, they don\'t. Advantage on attacks, disadvantage on theirs.',
  'Blind Fighting style (10ft Blindsight): works in Fog Cloud and magical Darkness.',
  'Torches reveal YOU to enemies in the dark. Sometimes darkness is better than light.',
];
