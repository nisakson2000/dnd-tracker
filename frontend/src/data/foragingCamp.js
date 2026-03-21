/**
 * Foraging & Camp Setup — terrain foraging rules, camp quality tiers, and watch rotation.
 * Covers roadmap items 450 (Foraging rules) and 451 (Camp setup).
 */

// ---------------------------------------------------------------------------
// 1. FORAGING TABLE — terrain-based DCs and possible yields
// ---------------------------------------------------------------------------

export const FORAGING_TABLE = {
  forest: {
    label: 'Forest',
    dc: 10,
    yields: [
      { name: 'Berries', weight: 0.3, rations: 0.5, description: 'Wild berries — blueberries, blackberries, elderberries.' },
      { name: 'Mushrooms', weight: 0.25, rations: 0.5, description: 'Edible forest mushrooms. DC 13 Nature check to avoid poisonous look-alikes.' },
      { name: 'Herbs', weight: 0.2, rations: 0, description: 'Rosemary, thyme, wild garlic. Useful for cooking or basic herbalism.' },
      { name: 'Game', weight: 0.25, rations: 2, description: 'Rabbit, pheasant, or deer. Requires a successful hunt (ranged attack or trap).' },
    ],
  },
  plains: {
    label: 'Plains / Grassland',
    dc: 12,
    yields: [
      { name: 'Wild grains', weight: 0.3, rations: 1, description: 'Wild wheat, barley, or oats that can be ground into rough flour.' },
      { name: 'Roots', weight: 0.35, rations: 0.5, description: 'Tubers and root vegetables — turnips, wild carrots.' },
      { name: 'Small game', weight: 0.35, rations: 1, description: 'Prairie hare, quail, or ground squirrel.' },
    ],
  },
  mountain: {
    label: 'Mountain',
    dc: 15,
    yields: [
      { name: 'Mountain herbs', weight: 0.3, rations: 0, description: 'Edelweiss, alpine sage. Valuable for potions and poultices.' },
      { name: 'Mountain goat', weight: 0.35, rations: 3, description: 'Requires a difficult hunt on steep terrain (Athletics DC 12 + ranged attack).' },
      { name: 'Mineral water', weight: 0.35, rations: 0.5, description: 'Natural spring water with restorative minerals. Counts as clean water for 2 people.' },
    ],
  },
  desert: {
    label: 'Desert',
    dc: 20,
    yields: [
      { name: 'Cactus water', weight: 0.35, rations: 0.5, description: 'Water extracted from barrel cacti. Enough for 1 person for half a day.' },
      { name: 'Lizards', weight: 0.35, rations: 0.5, description: 'Small desert lizards cooked over a fire. Meagre but sustaining.' },
      { name: 'Insects', weight: 0.3, rations: 0.5, description: 'Scorpions (de-stingered), beetles, grubs. Unpleasant but nutritious.' },
    ],
  },
  swamp: {
    label: 'Swamp',
    dc: 12,
    poisonChance: 0.25,
    yields: [
      { name: 'Fish', weight: 0.3, rations: 1, description: 'Catfish, crayfish, or eels caught in murky waters.' },
      { name: 'Reeds', weight: 0.3, rations: 0.5, description: 'Cattail roots and shoots — starchy and filling.' },
      { name: 'Medicinal plants', weight: 0.4, rations: 0, description: 'Swamp aloe, marsh marigold. Can be used for healing poultices (DC 13 Medicine).' },
    ],
    poisonNote: '25% chance any plant yield is toxic. DC 12 Nature check to identify; failure means 1d4 poison damage when consumed.',
  },
  coastal: {
    label: 'Coastal',
    dc: 10,
    yields: [
      { name: 'Fish', weight: 0.3, rations: 1, description: 'Shoreline fishing — mackerel, trout, or perch.' },
      { name: 'Shellfish', weight: 0.25, rations: 1, description: 'Mussels, clams, crabs gathered from tidal pools.' },
      { name: 'Seaweed', weight: 0.2, rations: 0.5, description: 'Edible kelp and nori. Can be dried for later use.' },
      { name: 'Coconuts', weight: 0.25, rations: 1, description: 'Tropical coastal only — provides both food and water.' },
    ],
  },
  arctic: {
    label: 'Arctic / Tundra',
    dc: 18,
    yields: [
      { name: 'Lichen', weight: 0.3, rations: 0.25, description: 'Reindeer moss and rock lichen — barely sustaining but available.' },
      { name: 'Arctic hare', weight: 0.35, rations: 1, description: 'White-furred hare. Difficult to spot (Perception DC 14) but good meat.' },
      { name: 'Seal', weight: 0.35, rations: 4, description: 'Requires proximity to water and a successful hunt. Feeds the whole party.' },
    ],
  },
  underdark: {
    label: 'Underdark',
    dc: 15,
    yields: [
      { name: 'Mushrooms', weight: 0.35, rations: 0.5, description: 'Zurkhwood sprouts, bigwig caps. DC 14 Nature to avoid toxic varieties.' },
      { name: 'Cave fish', weight: 0.3, rations: 1, description: 'Blind cave fish from underground streams. Bland but safe.' },
      { name: 'Phosphorescent moss', weight: 0.35, rations: 0, description: 'Glowing moss — not edible but useful as dim light source (5 ft) for 8 hours.' },
    ],
  },
};

// ---------------------------------------------------------------------------
// 2. CAMP SETUP — quality tiers with benefits, risks, and setup time
// ---------------------------------------------------------------------------

export const CAMP_SETUP = {
  none: {
    label: 'No Camp',
    survivalDC: null,
    hasFire: false,
    hasShelter: false,
    setupMinutes: 0,
    benefits: {
      restQuality: 'none',
      encounterModifier: 0,
      description: 'No camp set up. Sleeping in the open with no fire or protection.',
    },
    risks: [
      'No long rest benefit — only a short rest at best.',
      'Exposure to weather: Constitution save vs. exhaustion in harsh conditions.',
      'No passive deterrent against predators.',
    ],
  },
  basic: {
    label: 'Basic Camp',
    survivalDC: 10,
    hasFire: true,
    hasShelter: false,
    setupMinutes: 15,
    benefits: {
      restQuality: 'adequate',
      encounterModifier: -1,
      description: 'Bedroll on the ground, small fire for warmth and cooking.',
    },
    risks: [
      'Fire may attract attention (increases encounter chance by 5% in hostile territory).',
      'No shelter from heavy rain or snow — disadvantage on rest if weather is severe.',
    ],
  },
  good: {
    label: 'Good Camp',
    survivalDC: 13,
    hasFire: true,
    hasShelter: true,
    setupMinutes: 30,
    benefits: {
      restQuality: 'comfortable',
      encounterModifier: -2,
      description: 'Tents pitched, cook fire with proper meal, organised watch rotation.',
    },
    risks: [
      'Takes 30 minutes to set up — may not be viable if pressed for time.',
      'Visible from a distance in open terrain.',
    ],
  },
  fortified: {
    label: 'Fortified Camp',
    survivalDC: 16,
    hasFire: true,
    hasShelter: true,
    setupMinutes: 60,
    benefits: {
      restQuality: 'secure',
      encounterModifier: -4,
      description: 'Palisade or barricade, alarm traps at perimeter, multiple fires, clear sight lines.',
    },
    risks: [
      'Takes 1 hour to set up — entire party should contribute.',
      'Requires materials (wood, rope). May not be possible in desert or arctic.',
      'Very visible — intelligent enemies may scout and plan a coordinated assault.',
    ],
  },
};

// ---------------------------------------------------------------------------
// 3. WATCH ROTATION — schedules based on party size (8-hour long rest)
// ---------------------------------------------------------------------------

export const WATCH_ROTATION = [
  {
    partySize: 2,
    hoursEach: 4,
    shifts: 2,
    longRestBenefit: false,
    note: 'With only 2 party members, each watches for 4 hours — no one gets a full long rest (requires 6 hours of sleep).',
  },
  {
    partySize: 3,
    hoursEach: 2.67,
    shifts: 3,
    longRestBenefit: true,
    note: 'Each member watches ~2 hours 40 minutes. Just enough sleep for a long rest.',
  },
  {
    partySize: 4,
    hoursEach: 2,
    shifts: 4,
    longRestBenefit: true,
    note: 'Comfortable 2-hour watches. Full long rest for everyone.',
  },
  {
    partySize: 5,
    hoursEach: 1.6,
    shifts: 5,
    longRestBenefit: true,
    note: 'Short 1.5-hour watches. Well-rested party.',
  },
];

/**
 * Perception DC modifiers by watch position (0-indexed).
 * Late watches impose penalties due to drowsiness.
 */
export const WATCH_PERCEPTION_MODIFIERS = [
  { watch: 1, label: '1st Watch (evening)', modifier: 0, note: 'Alert — just started resting period.' },
  { watch: 2, label: '2nd Watch (midnight)', modifier: 0, note: 'Normal alertness.' },
  { watch: 3, label: '3rd Watch (late night)', modifier: -2, note: 'Drowsy — deep-night fatigue sets in.' },
  { watch: 4, label: '4th Watch (pre-dawn)', modifier: -2, note: 'Groggy — hardest hours to stay awake.' },
];

// ---------------------------------------------------------------------------
// 4. HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Simulate a foraging attempt and return the result.
 * @param {string} terrain — key from FORAGING_TABLE (e.g. 'forest', 'desert')
 * @param {number} survivalMod — the character's Survival modifier
 * @returns {object} { success, roll, dc, terrain, yield?, poisoned?, message }
 */
export function generateForagingResult(terrain, survivalMod = 0) {
  const data = FORAGING_TABLE[terrain];
  if (!data) {
    return { success: false, roll: 0, dc: 0, terrain, message: `Unknown terrain type: "${terrain}".` };
  }

  const roll = Math.floor(Math.random() * 20) + 1;
  const total = roll + survivalMod;
  const success = total >= data.dc;

  if (!success) {
    return {
      success: false,
      roll,
      total,
      dc: data.dc,
      terrain: data.label,
      message: `Foraging failed (rolled ${roll} + ${survivalMod} = ${total} vs DC ${data.dc}). No food found.`,
    };
  }

  // Pick a yield based on weights
  const rand = Math.random();
  let cumulative = 0;
  let chosen = data.yields[0];
  for (const y of data.yields) {
    cumulative += y.weight;
    if (rand <= cumulative) {
      chosen = y;
      break;
    }
  }

  // Check for swamp poison chance
  let poisoned = false;
  if (data.poisonChance && chosen.rations === 0) {
    // Plant-based yield in swamp
    poisoned = Math.random() < data.poisonChance;
  }

  return {
    success: true,
    roll,
    total,
    dc: data.dc,
    terrain: data.label,
    yield: { ...chosen },
    poisoned,
    message: poisoned
      ? `Foraging succeeded but the ${chosen.name.toLowerCase()} turned out to be toxic! ${data.poisonNote}`
      : `Foraging succeeded (rolled ${roll} + ${survivalMod} = ${total} vs DC ${data.dc}). Found: ${chosen.name} — ${chosen.description}`,
  };
}

/**
 * Return all camp options sorted by quality.
 * @returns {Array<object>}
 */
export function getCampOptions() {
  return Object.entries(CAMP_SETUP).map(([key, camp]) => ({
    id: key,
    ...camp,
  }));
}

/**
 * Generate a watch schedule for a given party size.
 * @param {number} partySize
 * @returns {object} { partySize, schedule, perceptionModifiers, note }
 */
export function generateWatchSchedule(partySize) {
  if (partySize < 1) {
    return { partySize, schedule: [], perceptionModifiers: [], note: 'No party members to stand watch.' };
  }

  // Find the closest matching entry or extrapolate
  let entry = WATCH_ROTATION.find((w) => w.partySize === partySize);

  if (!entry) {
    // Extrapolate for sizes not explicitly listed
    const hoursEach = parseFloat((8 / partySize).toFixed(2));
    entry = {
      partySize,
      hoursEach,
      shifts: partySize,
      longRestBenefit: hoursEach <= 2.67,
      note: partySize === 1
        ? 'A single watcher gets no sleep at all. No long rest benefit.'
        : partySize > 5
          ? `${partySize} party members each watch ~${hoursEach} hours. Very comfortable rotation.`
          : `Each member watches ~${hoursEach} hours.`,
    };
  }

  // Build per-shift perception modifiers (up to 4 watches; cycle if more)
  const modifiers = [];
  for (let i = 0; i < entry.shifts; i++) {
    const watchIndex = Math.min(i, WATCH_PERCEPTION_MODIFIERS.length - 1);
    modifiers.push({ ...WATCH_PERCEPTION_MODIFIERS[watchIndex], shift: i + 1 });
  }

  return {
    partySize: entry.partySize,
    hoursEach: entry.hoursEach,
    shifts: entry.shifts,
    longRestBenefit: entry.longRestBenefit,
    perceptionModifiers: modifiers,
    note: entry.note,
  };
}
