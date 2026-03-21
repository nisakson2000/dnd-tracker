// ============================================================
// D&D 5e Vision, Lighting, Obscurement, Cover & Travel Rules
// Pure JS data — no React dependencies
// ============================================================

// ----- 1. LIGHT LEVELS -----
export const LIGHT_LEVELS = [
  {
    id: 'bright',
    name: 'Bright Light',
    description:
      'Most creatures see normally in bright light. Even gloomy days provide bright light, as do torches, lanterns, fires, and other sources of illumination within a specific radius.',
    effect: 'Normal vision for all creatures. No penalties.',
    examples: [
      'Direct sunlight',
      'Within the bright radius of a torch or lantern',
      'Overcast daylight',
      'Full moon on a clear night (borderline)',
    ],
  },
  {
    id: 'dim',
    name: 'Dim Light',
    description:
      'Dim light, also called shadows, creates a lightly obscured area. An area of dim light is usually a boundary between a source of bright light and surrounding darkness.',
    effect:
      'Creates a lightly obscured area. Creatures have disadvantage on Wisdom (Perception) checks that rely on sight.',
    examples: [
      'Twilight or dawn',
      'The edge of a torch's radius',
      'Bright moonlight',
      'A particularly brilliant full moon',
    ],
  },
  {
    id: 'darkness',
    name: 'Darkness',
    description:
      'Darkness creates a heavily obscured area. Characters face darkness outdoors at night (even most moonlit nights), within the confines of an unlit dungeon, or in an area of magical darkness.',
    effect:
      'Creates a heavily obscured area. A creature effectively suffers from the blinded condition when trying to see something in that area.',
    examples: [
      'An unlit dungeon or basement',
      'Outdoors on a moonless night',
      'Inside an area of magical darkness',
    ],
  },
];

// ----- 2. LIGHT SOURCES -----
export const LIGHT_SOURCES = [
  {
    id: 'candle',
    name: 'Candle',
    brightRadius: 5,
    dimRadius: 5,
    totalRadius: 10,
    duration: '1 hour',
    cost: '1 cp',
    weight: 0,
    type: 'mundane',
    notes: 'Sheds dim light in a 5-foot radius beyond its bright light.',
  },
  {
    id: 'torch',
    name: 'Torch',
    brightRadius: 20,
    dimRadius: 20,
    totalRadius: 40,
    duration: '1 hour',
    cost: '1 cp',
    weight: 1,
    type: 'mundane',
    notes:
      'Can be used as an improvised weapon dealing 1 fire damage on a hit.',
  },
  {
    id: 'lamp',
    name: 'Lamp',
    brightRadius: 15,
    dimRadius: 30,
    totalRadius: 45,
    duration: '6 hours (1 pint of oil)',
    cost: '5 sp',
    weight: 1,
    type: 'mundane',
    notes: 'Casts bright light in a 15-foot radius and dim light for an additional 30 feet.',
  },
  {
    id: 'hooded-lantern',
    name: 'Hooded Lantern',
    brightRadius: 30,
    dimRadius: 30,
    totalRadius: 60,
    duration: '6 hours (1 pint of oil)',
    cost: '5 gp',
    weight: 2,
    type: 'mundane',
    notes:
      'As an action, you can lower the hood, reducing the light to dim light in a 5-foot radius.',
    hoodedBrightRadius: 0,
    hoodedDimRadius: 5,
  },
  {
    id: 'bullseye-lantern',
    name: 'Bullseye Lantern',
    brightRadius: 60,
    dimRadius: 60,
    totalRadius: 120,
    duration: '6 hours (1 pint of oil)',
    cost: '10 gp',
    weight: 2,
    type: 'mundane',
    shape: 'cone',
    notes:
      'Casts bright light in a 60-foot cone and dim light for an additional 60 feet.',
  },
  {
    id: 'light-cantrip',
    name: 'Light (Cantrip)',
    brightRadius: 20,
    dimRadius: 20,
    totalRadius: 40,
    duration: '1 hour (concentration not required)',
    cost: null,
    weight: 0,
    type: 'spell',
    level: 0,
    notes:
      'Touches one object no larger than 10 feet in any dimension. The object sheds light. Covering it with an opaque object blocks the light. The spell ends if cast again or dismissed as an action.',
  },
  {
    id: 'dancing-lights',
    name: 'Dancing Lights (Cantrip)',
    brightRadius: 0,
    dimRadius: 10,
    totalRadius: 10,
    duration: '1 minute (concentration)',
    cost: null,
    weight: 0,
    type: 'spell',
    level: 0,
    notes:
      'Creates up to four torch-sized lights within range. Each sheds dim light in a 10-foot radius. You can combine them into one vaguely humanoid Medium-sized form. They must stay within 20 feet of each other.',
    count: 4,
  },
  {
    id: 'daylight',
    name: 'Daylight (3rd-level spell)',
    brightRadius: 60,
    dimRadius: 60,
    totalRadius: 120,
    duration: '1 hour (no concentration)',
    cost: null,
    weight: 0,
    type: 'spell',
    level: 3,
    notes:
      'A 60-foot-radius sphere of light spreads from a point. Dispels any darkness in its area created by a spell of 3rd level or lower. Despite the name, this spell does not count as sunlight.',
  },
  {
    id: 'continual-flame',
    name: 'Continual Flame (2nd-level spell)',
    brightRadius: 20,
    dimRadius: 20,
    totalRadius: 40,
    duration: 'Permanent (until dispelled)',
    cost: '50 gp ruby dust (consumed)',
    weight: 0,
    type: 'spell',
    level: 2,
    notes:
      'A flame equivalent in brightness to a torch springs forth from the object you touch. It emits no heat, does not consume oxygen, and cannot be extinguished by nonmagical means.',
  },
  {
    id: 'sunbeam',
    name: 'Sunbeam (6th-level spell)',
    brightRadius: 60,
    dimRadius: 0,
    totalRadius: 60,
    duration: '1 minute (concentration)',
    cost: null,
    weight: 0,
    type: 'spell',
    level: 6,
    shape: 'line',
    lineWidth: 5,
    notes:
      'A beam of brilliant light flashes out from your hand in a 5-foot-wide, 60-foot-long line. Also creates bright sunlight in a 30-foot radius and dim light for an additional 30 feet around you for the duration. Counts as sunlight.',
    isSunlight: true,
  },
];

// ----- 3. VISION TYPES -----
export const VISION_TYPES = [
  {
    id: 'normal',
    name: 'Normal Vision',
    range: null,
    description:
      'The default vision for most humanoid races. Requires a light source to see.',
    rules: [
      'Can see normally in bright light.',
      'Dim light imposes a lightly obscured condition — disadvantage on Perception (sight) checks.',
      'Cannot see in darkness — effectively blinded.',
    ],
    races: ['Human', 'Halfling', 'Dragonborn'],
  },
  {
    id: 'darkvision',
    name: 'Darkvision',
    range: 60,
    unit: 'ft',
    description:
      'A creature with darkvision can see in dim light as if it were bright light and in darkness as if it were dim light. The creature cannot discern color in darkness, only shades of gray.',
    rules: [
      'Within range, treats darkness as dim light and dim light as bright light.',
      'Cannot discern color in darkness — sees only in shades of gray.',
      'Does NOT allow seeing in magical darkness unless specifically stated.',
      'Dim light still counts as lightly obscured even with darkvision treating it as bright — the disadvantage on Perception is removed.',
    ],
    races: ['Dwarf', 'Elf', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling'],
  },
  {
    id: 'superior-darkvision',
    name: 'Superior Darkvision',
    range: 120,
    unit: 'ft',
    description:
      'Functions identically to darkvision but with a range of 120 feet instead of 60 feet.',
    rules: [
      'All standard darkvision rules apply.',
      'Extended range of 120 feet.',
      'Still cannot discern color in darkness.',
    ],
    races: ['Drow (Dark Elf)', 'Duergar (Gray Dwarf)', 'Deep Gnome (Svirfneblin)'],
  },
  {
    id: 'blindsight',
    name: 'Blindsight',
    range: null,
    rangeNote: '10–120 ft depending on source',
    unit: 'ft',
    description:
      'A creature with blindsight can perceive its surroundings without relying on sight, within a specific radius. Typically granted by heightened senses, echolocation, or other non-visual means.',
    rules: [
      'Can perceive surroundings without relying on sight within the given radius.',
      'Immune to the blinded condition within that radius (for purposes of detecting creatures/objects).',
      'Invisible creatures and objects can be detected.',
      'Darkness, fog, and other visual obstructions do not impede perception within range.',
      'A creature with blindsight that is also blind beyond its blindsight radius still cannot see past that range.',
    ],
    commonRanges: {
      'Bat / Swarm of Bats': 60,
      'Gelatinous Cube': 60,
      'Grimlock': 30,
      'Purple Worm': 30,
      'Roper': 30,
      'Oozes (various)': 60,
    },
  },
  {
    id: 'truesight',
    name: 'Truesight',
    range: 120,
    unit: 'ft',
    description:
      'A creature with truesight can see in normal and magical darkness, see invisible creatures and objects, automatically detect visual illusions and succeed on saving throws against them, perceive the original form of a shapechanger or transformed creature, and see into the Ethereal Plane — all within range.',
    rules: [
      'Can see in normal and magical darkness.',
      'Can see invisible creatures and objects.',
      'Automatically detects visual illusions and succeeds on saves against them.',
      'Perceives the original form of a shapechanger or a creature transformed by magic.',
      'Can see into the Ethereal Plane within the same range.',
    ],
    grantedBy: [
      'True Seeing spell (6th level)',
      'Some high-level creatures innately',
      'Certain magic items (e.g., Gem of Seeing)',
    ],
  },
  {
    id: 'tremorsense',
    name: 'Tremorsense',
    range: null,
    rangeNote: '10–60 ft depending on creature',
    unit: 'ft',
    description:
      'A creature with tremorsense can detect and pinpoint the origin of vibrations within a specific radius, provided that the creature and the source of the vibrations are in contact with the same ground or substance.',
    rules: [
      'Detects creatures and movement through vibrations in the ground (or water, walls, etc.).',
      'Both the sensing creature and the target must be in contact with the same surface.',
      'Cannot detect flying or hovering creatures.',
      'Not impeded by darkness or visual obstructions.',
      'Does not work across gaps, chasms, or different surfaces.',
    ],
    commonRanges: {
      'Ankheg': 60,
      'Bulette': 60,
      'Purple Worm': 60,
      'Umber Hulk': 60,
      'Xorn': 60,
    },
  },
];

// ----- 4. OBSCUREMENT -----
export const OBSCUREMENT = [
  {
    id: 'lightly-obscured',
    name: 'Lightly Obscured',
    description:
      'An area that is lightly obscured — such as dim light, patchy fog, or moderate foliage — makes it harder to see.',
    effect: 'Creatures have disadvantage on Wisdom (Perception) checks that rely on sight.',
    causedBy: [
      'Dim light',
      'Patchy fog or light mist',
      'Moderate foliage',
    ],
    condition: null,
  },
  {
    id: 'heavily-obscured',
    name: 'Heavily Obscured',
    description:
      'A heavily obscured area — such as darkness, opaque fog, or dense foliage — blocks vision entirely.',
    effect:
      'A creature effectively suffers from the blinded condition when trying to see something in that area.',
    causedBy: [
      'Darkness (nonmagical or magical)',
      'Opaque fog (e.g., Fog Cloud spell)',
      'Dense foliage',
      'Thick smoke or heavy snowfall',
    ],
    condition: 'blinded',
    blindedEffects: [
      'Automatically fails any ability check that requires sight.',
      'Attack rolls against the blinded creature have advantage.',
      'The blinded creature\'s attack rolls have disadvantage.',
    ],
  },
];

// ----- 5. COVER -----
export const COVER = [
  {
    id: 'half',
    name: 'Half Cover',
    acBonus: 2,
    dexSaveBonus: 2,
    description:
      'A target has half cover if an obstacle blocks at least half of its body. The obstacle might be a low wall, a large piece of furniture, a narrow tree trunk, or a creature — whether that creature is an enemy or a friend.',
    examples: [
      'Low wall',
      'Large piece of furniture',
      'Narrow tree trunk',
      'Another creature (enemy or ally)',
    ],
  },
  {
    id: 'three-quarters',
    name: 'Three-Quarters Cover',
    acBonus: 5,
    dexSaveBonus: 5,
    description:
      'A target has three-quarters cover if about three-quarters of it is covered by an obstacle. The obstacle might be a portcullis, an arrow slit, or a thick tree trunk.',
    examples: [
      'Portcullis',
      'Arrow slit',
      'Thick tree trunk',
      'Peering around a corner',
    ],
  },
  {
    id: 'total',
    name: 'Total Cover',
    acBonus: null,
    dexSaveBonus: null,
    description:
      'A target with total cover can\'t be targeted directly by an attack or a spell, although some spells can reach such a target by including it in an area of effect. A target has total cover if it is completely concealed by an obstacle.',
    examples: [
      'Completely behind a wall',
      'Closed door between attacker and target',
      'Fully behind a pillar wide enough to hide behind',
    ],
  },
];

// ----- 6. TRAVEL PACE -----
export const TRAVEL_PACE = [
  {
    id: 'fast',
    name: 'Fast',
    feetPerMinute: 400,
    milesPerHour: 4,
    milesPerDay: 30,
    effect: '-5 penalty to passive Wisdom (Perception) scores.',
    canStealth: false,
    notes: 'Characters moving at a fast pace are less perceptive of danger.',
  },
  {
    id: 'normal',
    name: 'Normal',
    feetPerMinute: 300,
    milesPerHour: 3,
    milesPerDay: 24,
    effect: 'No special benefits or penalties.',
    canStealth: false,
    notes: 'Standard travel speed. No ability to use stealth.',
  },
  {
    id: 'slow',
    name: 'Slow',
    feetPerMinute: 200,
    milesPerHour: 2,
    milesPerDay: 18,
    effect: 'Able to use stealth.',
    canStealth: true,
    notes:
      'Characters moving at a slow pace can move stealthily. As long as they are not in the open, they can try to surprise or sneak by other creatures.',
  },
];

// ----- HELPER / LOOKUP FUNCTIONS -----

/**
 * Get a light source by its id.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getLightSourceById(id) {
  return LIGHT_SOURCES.find((s) => s.id === id);
}

/**
 * Get a vision type by its id.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getVisionTypeById(id) {
  return VISION_TYPES.find((v) => v.id === id);
}

/**
 * Determine effective light level for a creature at a given distance from a light source.
 * @param {object} lightSource - An entry from LIGHT_SOURCES
 * @param {number} distance - Distance in feet from the light source
 * @returns {'bright'|'dim'|'darkness'}
 */
export function getLightLevelAtDistance(lightSource, distance) {
  if (distance <= lightSource.brightRadius) return 'bright';
  if (distance <= lightSource.brightRadius + lightSource.dimRadius) return 'dim';
  return 'darkness';
}

/**
 * Determine what a creature with a given vision type perceives at a given ambient light level.
 * @param {string} visionTypeId - e.g. 'normal', 'darkvision', 'truesight'
 * @param {'bright'|'dim'|'darkness'} ambientLight - Current light level at the creature's location
 * @param {number} [distance=0] - Distance to the thing being observed (relevant for ranged vision like darkvision)
 * @returns {{ perceivedAs: string, disadvantagePerception: boolean, effectivelyBlinded: boolean }}
 */
export function getPerception(visionTypeId, ambientLight, distance = 0) {
  const vision = getVisionTypeById(visionTypeId);
  if (!vision) {
    return { perceivedAs: ambientLight, disadvantagePerception: ambientLight === 'dim', effectivelyBlinded: ambientLight === 'darkness' };
  }

  const range = vision.range || Infinity;
  const withinRange = distance <= range;

  switch (visionTypeId) {
    case 'truesight':
      if (withinRange) {
        return { perceivedAs: 'bright', disadvantagePerception: false, effectivelyBlinded: false };
      }
      // Falls through to normal outside range
      return getPerception('normal', ambientLight, distance);

    case 'darkvision':
    case 'superior-darkvision':
      if (withinRange) {
        if (ambientLight === 'darkness') {
          return { perceivedAs: 'dim (grayscale)', disadvantagePerception: true, effectivelyBlinded: false };
        }
        if (ambientLight === 'dim') {
          return { perceivedAs: 'bright', disadvantagePerception: false, effectivelyBlinded: false };
        }
        return { perceivedAs: 'bright', disadvantagePerception: false, effectivelyBlinded: false };
      }
      return getPerception('normal', ambientLight, distance);

    case 'blindsight':
      if (withinRange) {
        return { perceivedAs: 'perceived (non-visual)', disadvantagePerception: false, effectivelyBlinded: false };
      }
      return getPerception('normal', ambientLight, distance);

    case 'tremorsense':
      if (withinRange) {
        return { perceivedAs: 'vibrations only', disadvantagePerception: false, effectivelyBlinded: false };
      }
      return getPerception('normal', ambientLight, distance);

    case 'normal':
    default:
      if (ambientLight === 'bright') {
        return { perceivedAs: 'bright', disadvantagePerception: false, effectivelyBlinded: false };
      }
      if (ambientLight === 'dim') {
        return { perceivedAs: 'dim', disadvantagePerception: true, effectivelyBlinded: false };
      }
      return { perceivedAs: 'darkness', disadvantagePerception: true, effectivelyBlinded: true };
  }
}

/**
 * Get cover details by id.
 * @param {'half'|'three-quarters'|'total'} id
 * @returns {object|undefined}
 */
export function getCoverById(id) {
  return COVER.find((c) => c.id === id);
}

/**
 * Get travel pace details by id.
 * @param {'fast'|'normal'|'slow'} id
 * @returns {object|undefined}
 */
export function getTravelPaceById(id) {
  return TRAVEL_PACE.find((p) => p.id === id);
}
