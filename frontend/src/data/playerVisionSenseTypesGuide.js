/**
 * playerVisionSenseTypesGuide.js
 * Player Mode: Vision types — darkvision, blindsight, tremorsense, truesight
 * Pure JS — no React dependencies.
 */

export const VISION_TYPES = [
  {
    type: 'Normal Vision',
    range: 'Unlimited (with light)',
    what: 'Standard sight. Requires light source.',
    limitations: 'Blind in darkness. Dim light = disadvantage on Perception.',
    races: ['Human', 'Halfling', 'Dragonborn'],
    note: 'Carry a torch or cast Light if no darkvision.',
  },
  {
    type: 'Darkvision',
    range: '60ft (most), 120ft (Drow, Deep Gnome)',
    what: 'See in darkness as dim light. Dim light as bright light.',
    limitations: 'Darkness = dim light = disadvantage on Perception. No color, only shades of gray.',
    races: ['Elf', 'Dwarf', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling'],
    note: 'Most common. Still disadvantage in total darkness. NOT perfect night vision.',
  },
  {
    type: 'Superior Darkvision',
    range: '120ft',
    what: 'Extended darkvision range.',
    limitations: 'Same rules as darkvision, just farther.',
    races: ['Drow', 'Deep Gnome (Svirfneblin)', 'Duergar'],
    note: 'Underdark races. Double the range of standard darkvision.',
  },
  {
    type: 'Blindsight',
    range: 'Usually 10-60ft',
    what: 'Perceive surroundings without sight. Echolocation, keen senses, etc.',
    limitations: 'Limited range. Beyond it, you\'re blind (unless you have other senses).',
    races: [],
    sources: ['Blind Fighting style (10ft)', 'Some monsters', 'Robe of Eyes'],
    note: 'Defeats invisibility and darkness within range. Very powerful.',
  },
  {
    type: 'Tremorsense',
    range: 'Usually 30-60ft',
    what: 'Detect creatures touching the ground through vibrations.',
    limitations: 'Only works on solid ground. Flying, hovering, ethereal creatures are invisible.',
    races: [],
    sources: ['Some monsters (Bulette, Purple Worm)', 'Very rare for PCs'],
    note: 'Walking enemies can\'t hide. But fly or levitate to bypass it.',
  },
  {
    type: 'Truesight',
    range: 'Usually 30-120ft',
    what: 'See through illusions, shapechangers, invisibility, darkness, and into the Ethereal Plane.',
    limitations: 'Very rare. Usually only high-level spells or legendary items.',
    races: [],
    sources: ['True Seeing spell (L6)', 'Some high-CR creatures', 'Robe of Eyes (partial)'],
    note: 'The ultimate vision. Sees EVERYTHING. Penetrates all deception.',
  },
];

export const LIGHT_LEVELS = {
  brightLight: { visibility: 'Normal sight. No penalties.', examples: 'Daylight, Daylight spell, most indoor lighting.' },
  dimLight: { visibility: 'Lightly obscured. Disadvantage on Perception (sight).', examples: 'Torchlight edge, twilight, moonlight, fog.' },
  darkness: { visibility: 'Heavily obscured. Effectively blinded without darkvision.', examples: 'Unlit dungeon, moonless night, Darkness spell.' },
};

export const LIGHT_SOURCES = [
  { source: 'Torch', bright: '20ft', dim: '20ft more', duration: '1 hour', note: 'Free hand occupied. Can be dropped.' },
  { source: 'Lantern (hooded)', bright: '30ft', dim: '30ft more', duration: '6 hours', note: 'Can close hood (5ft dim). Better than torch.' },
  { source: 'Lantern (bullseye)', bright: '60ft cone', dim: '60ft more', duration: '6 hours', note: 'Directional. Great for scouting.' },
  { source: 'Light cantrip', bright: '20ft', dim: '20ft more', duration: '1 hour', note: 'No hand needed if cast on object. Free.' },
  { source: 'Dancing Lights', bright: 'None', dim: '10ft each (4 lights)', duration: '1 min (concentration)', note: 'Flexible but requires concentration.' },
  { source: 'Continual Flame (L2)', bright: '20ft', dim: '20ft more', duration: 'Permanent', note: '50gp cost but lasts forever. Put on a rock.' },
  { source: 'Daylight (L3)', bright: '60ft', dim: '60ft more', duration: '1 hour', note: 'Not sunlight despite the name. Doesn\'t hurt vampires.' },
];

export const DARKNESS_STRATEGIES = [
  { strategy: 'Devil\'s Sight + Darkness', combo: 'Warlock casts Darkness, sees through it with Devil\'s Sight.', note: 'You see, they don\'t. Advantage on attacks, disadvantage on theirs.' },
  { strategy: 'Shadow of Moil', spell: 'L4 Warlock. Heavily obscured in darkness. Deals damage to attackers.', note: 'Better than Darkness combo. Doesn\'t blind allies.' },
  { strategy: 'Fog Cloud + Blindsight', combo: 'Fog Cloud blocks everyone. Blindsight lets you see in it.', note: 'Blind Fighting style (10ft) or creature blindsight.' },
  { strategy: 'Blind Fighting Style', source: 'Fighter, Paladin, Ranger (Tasha\'s).', note: '10ft blindsight. See invisible and in darkness within 10ft.' },
];

export const VISION_TIPS = [
  'Darkvision ≠ perfect night vision. Darkness = dim light = disadvantage on Perception.',
  'Darkvision sees in grayscale. No colors in darkness.',
  'Light cantrip: free, no concentration, no hand. Cast on a button.',
  'Continual Flame: 50gp for permanent light. Worth it.',
  'Blindsight beats invisibility within range. Very strong.',
  'Devil\'s Sight: magical darkness + you can see = huge advantage.',
  'Daylight spell is NOT sunlight. Doesn\'t hurt vampires.',
  'Fog Cloud: blocks darkvision too. Only blindsight/tremorsense work.',
  'Truesight: the ultimate. Sees through everything. True Seeing (L6).',
  'Races without darkvision: Human, Halfling, Dragonborn. Carry light.',
];
