/**
 * weatherSystem.js
 * Weather generation and environmental effects system for The Codex — D&D Companion
 *
 * Roadmap items covered:
 * - Phase 3: Dynamic Weather System
 *   - Weather type definitions with mechanical modifiers
 *   - Wind level effects and DCs
 *   - Temperature-based exhaustion and damage (per DMG environmental hazards)
 *   - Seasonal weather probability tables
 *   - Terrain modifiers on weather outcomes
 *   - Special weather events with rarity and mechanical effects
 *   - Weather generation, forecasting, and change roll helpers
 */

// ---------------------------------------------------------------------------
// WEATHER_TYPES
// 12 weather conditions with mechanical modifiers and descriptions
// ---------------------------------------------------------------------------

export const WEATHER_TYPES = {
  clear: {
    id: "clear",
    label: "Clear",
    visibilityModifier: 0,       // no change to visibility range
    movementModifier: 1.0,       // multiplier on movement speed
    rangedAttackModifier: 0,     // bonus/penalty to ranged attack rolls
    perceptionModifier: 0,       // bonus/penalty to Perception checks
    temperatureRange: { min: -10, max: 110 }, // °F
    description:
      "Skies are clear and visibility is unobstructed. No mechanical penalties apply.",
  },
  partlyCloudy: {
    id: "partlyCloudy",
    label: "Partly Cloudy",
    visibilityModifier: 0,
    movementModifier: 1.0,
    rangedAttackModifier: 0,
    perceptionModifier: 0,
    temperatureRange: { min: 20, max: 100 },
    description:
      "Scattered clouds diffuse the light but cause no significant hindrance.",
  },
  overcast: {
    id: "overcast",
    label: "Overcast",
    visibilityModifier: -1,      // −1 category (e.g., normal → lightly obscured)
    movementModifier: 1.0,
    rangedAttackModifier: 0,
    perceptionModifier: -1,
    temperatureRange: { min: 10, max: 85 },
    description:
      "Heavy cloud cover dims the light. Passive Perception −1 outdoors.",
  },
  lightRain: {
    id: "lightRain",
    label: "Light Rain",
    visibilityModifier: -1,
    movementModifier: 0.9,
    rangedAttackModifier: -1,
    perceptionModifier: -2,
    temperatureRange: { min: 34, max: 75 },
    description:
      "A steady drizzle. Lightly obscured, −1 to ranged attacks, −2 to Perception checks relying on sight or hearing.",
  },
  heavyRain: {
    id: "heavyRain",
    label: "Heavy Rain",
    visibilityModifier: -2,
    movementModifier: 0.75,
    rangedAttackModifier: -2,
    perceptionModifier: -4,
    temperatureRange: { min: 34, max: 70 },
    description:
      "Downpour heavily obscures the area. −2 to ranged attacks, −4 to Perception, movement reduced to 75%.",
  },
  thunderstorm: {
    id: "thunderstorm",
    label: "Thunderstorm",
    visibilityModifier: -3,
    movementModifier: 0.5,
    rangedAttackModifier: -4,
    perceptionModifier: -5,
    temperatureRange: { min: 40, max: 85 },
    description:
      "Lightning and deafening thunder. Heavily obscured, disadvantage on Perception, ranged attacks at −4, movement halved. Creatures in metal armour may attract lightning (DM discretion).",
  },
  fog: {
    id: "fog",
    label: "Fog",
    visibilityModifier: -4,      // heavily obscured beyond 5 ft
    movementModifier: 0.75,
    rangedAttackModifier: -3,
    perceptionModifier: -5,
    temperatureRange: { min: 30, max: 65 },
    description:
      "Dense fog. Heavily obscured; creatures effectively blinded beyond 5 ft. −3 to ranged attacks, −5 to Perception.",
  },
  snow: {
    id: "snow",
    label: "Snow",
    visibilityModifier: -2,
    movementModifier: 0.5,
    rangedAttackModifier: -2,
    perceptionModifier: -3,
    temperatureRange: { min: -20, max: 32 },
    description:
      "Snowfall blankets the ground. Movement halved; tracks in snow are easy to follow (+5 to Survival). −2 to ranged attacks, −3 to Perception.",
  },
  blizzard: {
    id: "blizzard",
    label: "Blizzard",
    visibilityModifier: -5,      // near-zero visibility
    movementModifier: 0.25,
    rangedAttackModifier: -5,
    perceptionModifier: -6,
    temperatureRange: { min: -40, max: 15 },
    description:
      "Whiteout conditions. Movement reduced to 25%. Ranged attacks nearly impossible (−5). DC 10 CON save each hour or gain one level of exhaustion from cold exposure.",
  },
  hail: {
    id: "hail",
    label: "Hail",
    visibilityModifier: -2,
    movementModifier: 0.75,
    rangedAttackModifier: -3,
    perceptionModifier: -4,
    temperatureRange: { min: 20, max: 50 },
    description:
      "Hailstones pelt exposed creatures for 1 bludgeoning damage per minute outdoors without cover. −3 to ranged attacks.",
  },
  extremeHeat: {
    id: "extremeHeat",
    label: "Extreme Heat",
    visibilityModifier: 0,
    movementModifier: 0.9,
    rangedAttackModifier: 0,
    perceptionModifier: 0,
    temperatureRange: { min: 100, max: 140 },
    description:
      "Scorching temperatures. CON save (DC 5 + 1 per hour) or gain one level of exhaustion. Heavy armour doubles exhaustion risk. Fire vulnerability may apply per DM.",
  },
  extremeCold: {
    id: "extremeCold",
    label: "Extreme Cold",
    visibilityModifier: 0,
    movementModifier: 0.9,
    rangedAttackModifier: 0,
    perceptionModifier: 0,
    temperatureRange: { min: -60, max: 0 },
    description:
      "Brutal cold. DC 10 CON save per hour without cold weather gear or take 1d4 cold damage and gain one level of exhaustion. Unprotected water freezes.",
  },
};

// ---------------------------------------------------------------------------
// WIND_LEVELS
// 5 wind intensities with speed, effects, and flying creature DCs
// ---------------------------------------------------------------------------

export const WIND_LEVELS = {
  calm: {
    id: "calm",
    label: "Calm",
    speedRange: { min: 0, max: 7 },   // mph
    effects: [
      "No mechanical effects.",
    ],
    flyingCreatureDC: null,
    rangedDisadvantage: false,
    rangedImpossible: false,
  },
  lightBreeze: {
    id: "lightBreeze",
    label: "Light Breeze",
    speedRange: { min: 8, max: 18 },
    effects: [
      "Flames flicker; unprotected flames (candles etc.) have a 50% chance to gutter out each round.",
    ],
    flyingCreatureDC: null,
    rangedDisadvantage: false,
    rangedImpossible: false,
  },
  moderateWind: {
    id: "moderateWind",
    label: "Moderate Wind",
    speedRange: { min: 19, max: 38 },
    effects: [
      "Unprotected flames are extinguished automatically.",
      "Fog and mist are dispersed (remove fog weather effects).",
      "−1 to ranged attack rolls beyond normal range.",
    ],
    flyingCreatureDC: 10,
    rangedDisadvantage: false,
    rangedImpossible: false,
  },
  strongWind: {
    id: "strongWind",
    label: "Strong Wind",
    speedRange: { min: 39, max: 73 },
    effects: [
      "Disadvantage on ranged weapon attack rolls.",
      "Disadvantage on Perception checks relying on hearing.",
      "Ranged spell attacks at disadvantage (DM discretion).",
      "Small creatures must make a DC 10 STR save or be pushed 10 ft.",
    ],
    flyingCreatureDC: 15,
    rangedDisadvantage: true,
    rangedImpossible: false,
  },
  gale: {
    id: "gale",
    label: "Gale",
    speedRange: { min: 74, max: 200 },
    effects: [
      "Ranged weapon attacks are impossible.",
      "All creatures must make a DC 15 DEX save each round or be knocked prone.",
      "Movement against the wind costs double.",
      "Flying is extremely dangerous: DC 20 Athletics or Acrobatics each round or be blown 30 ft downwind.",
    ],
    flyingCreatureDC: 20,
    rangedDisadvantage: true,
    rangedImpossible: true,
  },
};

// ---------------------------------------------------------------------------
// TEMPERATURE_EFFECTS
// Temperature bands mapped to DMG environmental hazard rules
// ---------------------------------------------------------------------------

export const TEMPERATURE_EFFECTS = {
  extremeCold: {
    id: "extremeCold",
    label: "Extreme Cold",
    fahrenheitRange: { max: 0 },
    saveDC: 10,
    saveInterval: "1 hour",
    saveAbility: "CON",
    onFailure: "1d4 cold damage and 1 level of exhaustion",
    damageType: "cold",
    notes:
      "Without cold weather gear (thick cloak, furs, etc.) a creature must make a DC 10 CON saving throw at the end of each hour. On a failure it takes 1d4 cold damage and suffers one level of exhaustion. Creatures with resistance or immunity to cold damage automatically succeed.",
    reference: "DMG p.110",
  },
  cold: {
    id: "cold",
    label: "Cold",
    fahrenheitRange: { min: 1, max: 32 },
    saveDC: null,
    saveInterval: null,
    saveAbility: null,
    onFailure: null,
    damageType: null,
    notes:
      "Below freezing. Water and wet surfaces freeze over time. No mandatory saves, but DMs may impose disadvantage on checks for creatures without cold protection.",
    reference: null,
  },
  mild: {
    id: "mild",
    label: "Mild",
    fahrenheitRange: { min: 33, max: 64 },
    saveDC: null,
    saveInterval: null,
    saveAbility: null,
    onFailure: null,
    damageType: null,
    notes: "Comfortable range for most humanoid creatures. No environmental effects.",
    reference: null,
  },
  warm: {
    id: "warm",
    label: "Warm",
    fahrenheitRange: { min: 65, max: 99 },
    saveDC: null,
    saveInterval: null,
    saveAbility: null,
    onFailure: null,
    damageType: null,
    notes:
      "Warm to hot. Strenuous activity (combat, forced march) may require water consumption. No saves unless DM rules otherwise.",
    reference: null,
  },
  hot: {
    id: "hot",
    label: "Hot",
    fahrenheitRange: { min: 100, max: 109 },
    saveDC: 5,
    saveInterval: "1 hour",
    saveAbility: "CON",
    onFailure: "1 level of exhaustion",
    damageType: null,
    notes:
      "DC 5 CON save per hour or gain one level of exhaustion. Heavy armour or heavy activity increases DC by 5. Water consumption halves the DC.",
    reference: "DMG p.110",
  },
  extremeHeat: {
    id: "extremeHeat",
    label: "Extreme Heat",
    fahrenheitRange: { min: 110 },
    saveDC: "5 + 1 per hour",
    saveInterval: "1 hour",
    saveAbility: "CON",
    onFailure: "1 level of exhaustion; possible fire vulnerability",
    damageType: "fire",
    notes:
      "The DC starts at 5 and increases by 1 for each consecutive hour of exposure. On a failure the creature suffers one level of exhaustion. At the DM's discretion creatures at 3+ exhaustion may gain vulnerability to fire damage. Ample water consumption removes the escalating DC.",
    reference: "DMG p.110",
  },
};

// ---------------------------------------------------------------------------
// SEASONAL_WEATHER
// Probability tables per season — values are percentage weights (must sum to 100)
// ---------------------------------------------------------------------------

export const SEASONAL_WEATHER = {
  spring: {
    id: "spring",
    label: "Spring",
    temperatureRange: { min: 35, max: 75 },
    weatherProbabilities: {
      clear: 15,
      partlyCloudy: 20,
      overcast: 15,
      lightRain: 20,
      heavyRain: 10,
      thunderstorm: 8,
      fog: 7,
      snow: 3,
      blizzard: 0,
      hail: 2,
      extremeHeat: 0,
      extremeCold: 0,
    },
    notes: "Variable weather; frequent rain and mild temperatures.",
  },
  summer: {
    id: "summer",
    label: "Summer",
    temperatureRange: { min: 65, max: 110 },
    weatherProbabilities: {
      clear: 35,
      partlyCloudy: 25,
      overcast: 8,
      lightRain: 8,
      heavyRain: 5,
      thunderstorm: 10,
      fog: 1,
      snow: 0,
      blizzard: 0,
      hail: 2,
      extremeHeat: 5,
      extremeCold: 0,
      // remainder rounds to 99 — add 1 to clear in practice
    },
    notes: "Warm and mostly clear; afternoon thunderstorms common in many climates.",
  },
  autumn: {
    id: "autumn",
    label: "Autumn",
    temperatureRange: { min: 25, max: 70 },
    weatherProbabilities: {
      clear: 15,
      partlyCloudy: 20,
      overcast: 18,
      lightRain: 15,
      heavyRain: 8,
      thunderstorm: 4,
      fog: 12,
      snow: 4,
      blizzard: 0,
      hail: 2,
      extremeHeat: 0,
      extremeCold: 2,
    },
    notes: "Cool and foggy; early snows possible by late autumn.",
  },
  winter: {
    id: "winter",
    label: "Winter",
    temperatureRange: { min: -30, max: 40 },
    weatherProbabilities: {
      clear: 10,
      partlyCloudy: 12,
      overcast: 18,
      lightRain: 5,
      heavyRain: 2,
      thunderstorm: 1,
      fog: 5,
      snow: 25,
      blizzard: 10,
      hail: 2,
      extremeHeat: 0,
      extremeCold: 10,
    },
    notes: "Cold and snowy; blizzards and extreme cold are real hazards.",
  },
};

// ---------------------------------------------------------------------------
// TERRAIN_WEATHER_MODIFIERS
// Adjustments applied on top of seasonal probabilities
// ---------------------------------------------------------------------------

export const TERRAIN_WEATHER_MODIFIERS = {
  coastal: {
    id: "coastal",
    label: "Coastal",
    description: "Proximity to large bodies of water moderates temperature extremes and increases wind and fog.",
    temperatureModifier: 0,          // °F shift
    windLevelBonus: 1,               // shift wind level up by this many steps
    probabilityModifiers: {
      fog: +10,
      lightRain: +5,
      heavyRain: +5,
      thunderstorm: +3,
      extremeHeat: -5,
      extremeCold: -5,
      blizzard: -3,
    },
    specialRules: [
      "Sea fog can roll in suddenly; fog events last d4+1 hours.",
      "Storms from the sea may arrive 1d4 hours faster than forecast.",
    ],
  },
  mountain: {
    id: "mountain",
    label: "Mountain",
    description: "High altitude means colder temperatures, thinner air, and violent sudden storms.",
    temperatureModifier: -15,
    windLevelBonus: 1,
    probabilityModifiers: {
      snow: +10,
      blizzard: +8,
      thunderstorm: +5,
      extremeCold: +8,
      extremeHeat: -10,
      clear: -5,
      fog: +4,
    },
    specialRules: [
      "Above 10,000 ft: thin air — strenuous activity requires DC 10 CON save or gain 1 exhaustion.",
      "Rockslides have a 5% chance per hour of heavy rain or blizzard.",
    ],
  },
  desert: {
    id: "desert",
    label: "Desert",
    description: "Extreme heat by day and surprising cold by night with minimal precipitation.",
    temperatureModifier: +20,        // daytime; nights subtract 40 (DM's call)
    windLevelBonus: 0,
    probabilityModifiers: {
      extremeHeat: +25,
      clear: +20,
      lightRain: -15,
      heavyRain: -10,
      fog: -8,
      snow: -10,
      blizzard: -10,
      thunderstorm: +2,             // rare but violent sandstorms
    },
    specialRules: [
      "Desert nights drop temperature by ~40 °F — extremeCold possible after midnight.",
      "Sandstorm variant of thunderstorm: treat as heavyRain visibility but no water; DC 10 CON save or blinded for 1 round per round of exposure.",
    ],
  },
  forest: {
    id: "forest",
    label: "Forest",
    description: "Dense canopy shelters against wind and moderates temperature.",
    temperatureModifier: -5,
    windLevelBonus: -1,              // reduce wind level by 1 step
    probabilityModifiers: {
      fog: +5,
      lightRain: +3,
      heavyRain: -3,
      thunderstorm: -3,
      extremeHeat: -5,
      blizzard: -5,
    },
    specialRules: [
      "Lightning strikes: 10% chance any thunderstorm starts a wildfire (DM's discretion).",
      "Canopy reduces falling precipitation by one severity step for creatures beneath it.",
    ],
  },
  arctic: {
    id: "arctic",
    label: "Arctic",
    description: "Perpetually cold; blizzards are common and the sun barely rises in winter.",
    temperatureModifier: -40,
    windLevelBonus: 1,
    probabilityModifiers: {
      extremeCold: +30,
      blizzard: +20,
      snow: +15,
      clear: -10,
      lightRain: -20,
      heavyRain: -20,
      thunderstorm: -10,
      extremeHeat: -30,
      fog: +5,
    },
    specialRules: [
      "All creatures without cold resistance must save against extreme cold each hour regardless of season.",
      "White-out navigation: DC 15 Survival or travel in a random direction.",
    ],
  },
  swamp: {
    id: "swamp",
    label: "Swamp",
    description: "High humidity breeds persistent fog and rain with little wind relief.",
    temperatureModifier: +5,
    windLevelBonus: -1,
    probabilityModifiers: {
      fog: +20,
      lightRain: +10,
      heavyRain: +5,
      overcast: +10,
      clear: -15,
      blizzard: -10,
      extremeCold: -5,
      extremeHeat: +3,
    },
    specialRules: [
      "Standing water: movement costs +5 ft per 5 ft in ankle-deep water.",
      "Insects and disease: DC 10 CON save after 24 h in swamp or contract Swamp Fever (DMG diseases).",
    ],
  },
  underground: {
    id: "underground",
    label: "Underground",
    description: "Caves and tunnels are insulated from surface weather entirely.",
    temperatureModifier: 0,          // constant ~55 °F regardless of surface
    windLevelBonus: -10,             // effectively calm at all times
    probabilityModifiers: {
      // Underground overrides everything; all weather resolved as 'clear' unless near a surface opening
      clear: +100,
    },
    specialRules: [
      "No weather effects apply underground unless within 60 ft of a large surface opening.",
      "Temperature is constant (~55 °F) regardless of surface season.",
      "Exceptions: volcanic caverns (extreme heat), icy caverns (extreme cold), flooded tunnels (heavy rain mechanics for movement).",
    ],
  },
};

// ---------------------------------------------------------------------------
// WEATHER_EVENTS
// 8 special/rare weather events with rarity, duration, and mechanical effects
// ---------------------------------------------------------------------------

export const WEATHER_EVENTS = {
  tornado: {
    id: "tornado",
    label: "Tornado",
    rarity: "rare",                  // rare | uncommon | legendary
    rarityWeight: 2,                 // lower = rarer (out of 100)
    duration: { dice: "1d6", unit: "minutes", average: 3 },
    prerequisites: ["thunderstorm", "strongWind", "gale"],
    mechanicalEffects: [
      "300-ft-wide path of destruction; creatures in path must make DC 18 STR save or be flung 60 ft and take 10d6 bludgeoning damage.",
      "Structures in path: DC 22 to remain standing (DM uses object HP rules).",
      "Ranged attacks impossible; all movement against tornado costs 4× speed.",
      "Flying creatures automatically fail saves.",
    ],
    description:
      "A violent rotating column of air touching the ground, leaving a trail of destruction.",
  },
  earthquake: {
    id: "earthquake",
    label: "Earthquake",
    rarity: "rare",
    rarityWeight: 3,
    duration: { dice: "1d4", unit: "rounds", average: 2 },
    prerequisites: [],               // can occur in any weather
    mechanicalEffects: [
      "All creatures on the ground must make DC 15 DEX save or fall prone.",
      "Concentration checks require DC 15 CON save each round.",
      "Fissures open on a 1-in-20 chance per 10-ft square (DC 15 DEX save or fall in; 1d10×10 ft deep).",
      "Structures: DC 20 to avoid partial collapse, DC 25 to avoid total collapse.",
      "Spell components (material) may be lost: DC 10 DEX save to retain.",
    ],
    description:
      "The ground shakes violently, cracking stone and toppling structures.",
  },
  flood: {
    id: "flood",
    label: "Flood",
    rarity: "uncommon",
    rarityWeight: 5,
    duration: { dice: "2d6", unit: "hours", average: 7 },
    prerequisites: ["heavyRain", "thunderstorm"],
    mechanicalEffects: [
      "Rising water (1 ft per 10 min at peak): difficult terrain in ankle-deep, swimming required knee-deep+.",
      "Fast-moving water: DC 10 STR (Athletics) check each round or be swept 10 ft downstream.",
      "Fire spells and effects halve their damage in flooded terrain.",
      "Wooden structures and bridges: 50% chance to be swept away after 1 hour of flooding.",
    ],
    description:
      "Rapidly rising waters driven by sustained heavy rain overwhelm low-lying terrain.",
  },
  drought: {
    id: "drought",
    label: "Drought",
    rarity: "uncommon",
    rarityWeight: 4,
    duration: { dice: "2d4", unit: "weeks", average: 5 },
    prerequisites: ["extremeHeat"],
    mechanicalEffects: [
      "Water sources (rivers, streams) dry up on a 1-in-6 chance per week.",
      "Foraging for water: DC 18 Survival instead of DC 10.",
      "Fire damage +1 per die due to dry vegetation.",
      "Crops fail; settlement supply rolls made at disadvantage.",
    ],
    description:
      "A prolonged absence of rain parches the land, straining all living things.",
  },
  magicalStorm: {
    id: "magicalStorm",
    label: "Magical Storm (Wild Magic)",
    rarity: "rare",
    rarityWeight: 2,
    duration: { dice: "1d4", unit: "hours", average: 2 },
    prerequisites: [],
    mechanicalEffects: [
      "Wild magic surges: any spell cast triggers a roll on the Wild Magic Surge table (DMG p.104).",
      "Ley line interference: Concentration checks have their DC increased by 5.",
      "Arcane feedback: Spells of 3rd level+ that miss or fail deal half damage to caster.",
      "Strange effects visible: lightning bolts are coloured, rain is warm, thunder speaks words.",
    ],
    description:
      "A storm saturated with arcane energy warps the fabric of magic itself.",
  },
  eclipse: {
    id: "eclipse",
    label: "Eclipse",
    rarity: "uncommon",
    rarityWeight: 4,
    duration: { dice: "1d4+1", unit: "minutes", average: 3 },
    prerequisites: ["clear", "partlyCloudy"],
    mechanicalEffects: [
      "Daylight conditions drop to darkness for the duration.",
      "Undead creatures gain advantage on attack rolls and ability checks for 1d4 hours following the eclipse.",
      "Creatures sensitive to sunlight (vampires, certain drow) are briefly relieved of sunlight penalties.",
      "Druids and celestial casters may treat this as an omen: Insight DC 14 to read portents.",
    ],
    description:
      "The moon passes between the sun and world, plunging the land into sudden darkness.",
  },
  aurora: {
    id: "aurora",
    label: "Aurora",
    rarity: "uncommon",
    rarityWeight: 6,
    duration: { dice: "2d4", unit: "hours", average: 5 },
    prerequisites: ["clear", "partlyCloudy"],
    mechanicalEffects: [
      "Celestials and fey within the aurora's light gain advantage on Charisma checks.",
      "Divination spells cast during an aurora have their range doubled.",
      "Creatures attuned to items with a fey or celestial origin gain 1d6 temporary HP.",
      "Navigation by stars is impossible while the aurora is active.",
    ],
    description:
      "Ribbons of colour dance across the night sky, a spectacle of celestial energy.",
  },
  meteorShower: {
    id: "meteorShower",
    label: "Meteor Shower",
    rarity: "uncommon",
    rarityWeight: 5,
    duration: { dice: "1d6", unit: "hours", average: 3 },
    prerequisites: ["clear"],
    mechanicalEffects: [
      "Striking meteors (rare, 1-in-20 per hour per party): 4d6 fire + 4d6 bludgeoning damage in a 20-ft radius, DC 15 DEX save for half.",
      "Astrologers and scholars gain advantage on History checks relating to celestial events for 1 week.",
      "Wish spells cast within 1 hour of a meteor strike: DM may reduce one drawback at their discretion.",
      "Meteor fragments (star metal): treat as adamantine; a 1-hour search yields 1d4 fragments on a DC 15 Survival check.",
    ],
    description:
      "Streaks of fire cross the night sky as debris burns through the atmosphere. Occasionally one reaches the ground.",
  },
};

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Picks a weighted random key from an object whose values are numeric weights.
 * @param {Object.<string, number>} weightMap
 * @returns {string} The selected key
 */
function weightedRandom(weightMap) {
  const entries = Object.entries(weightMap).filter(([, w]) => w > 0);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;
  for (const [key, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

/**
 * Applies terrain probability modifiers to a base weather probability table.
 * @param {Object.<string, number>} baseProbs
 * @param {string} terrain - Key from TERRAIN_WEATHER_MODIFIERS
 * @returns {Object.<string, number>} Adjusted probability table (all values ≥ 0)
 */
function applyTerrainModifiers(baseProbs, terrain) {
  const mod = TERRAIN_WEATHER_MODIFIERS[terrain];
  if (!mod) return { ...baseProbs };

  // Underground special case: everything becomes clear
  if (terrain === "underground") {
    return Object.fromEntries(Object.keys(baseProbs).map((k) => [k, k === "clear" ? 100 : 0]));
  }

  const adjusted = { ...baseProbs };
  for (const [type, delta] of Object.entries(mod.probabilityModifiers)) {
    if (type in adjusted) {
      adjusted[type] = Math.max(0, adjusted[type] + delta);
    }
  }
  return adjusted;
}

/**
 * Generates a single weather result for a given season and terrain.
 * @param {string} season - Key from SEASONAL_WEATHER (spring|summer|autumn|winter)
 * @param {string} [terrain="forest"] - Key from TERRAIN_WEATHER_MODIFIERS
 * @returns {{ weatherType: Object, windLevel: Object, temperature: number, season: string, terrain: string }}
 */
export function generateWeather(season, terrain = "forest") {
  const seasonData = SEASONAL_WEATHER[season] ?? SEASONAL_WEATHER.spring;
  const adjustedProbs = applyTerrainModifiers(seasonData.weatherProbabilities, terrain);
  const weatherKey = weightedRandom(adjustedProbs);
  const weatherType = WEATHER_TYPES[weatherKey];

  // Temperature: random within seasonal range, adjusted by terrain modifier
  const terrainMod = TERRAIN_WEATHER_MODIFIERS[terrain];
  const tempShift = terrainMod ? terrainMod.temperatureModifier : 0;
  const { min, max } = seasonData.temperatureRange;
  const baseTemp = Math.round(min + Math.random() * (max - min));
  const temperature = baseTemp + tempShift;

  // Wind: weighted toward calm/light unless terrain or weather suggests more
  const windKeys = Object.keys(WIND_LEVELS);
  let windWeights = { calm: 40, lightBreeze: 30, moderateWind: 18, strongWind: 9, gale: 3 };
  if (terrainMod) {
    const shift = terrainMod.windLevelBonus;
    if (shift > 0) {
      // Shift probability mass toward higher wind
      windWeights = { calm: 25, lightBreeze: 25, moderateWind: 25, strongWind: 18, gale: 7 };
    } else if (shift < 0) {
      windWeights = { calm: 60, lightBreeze: 30, moderateWind: 8, strongWind: 2, gale: 0 };
    }
  }
  // Storms push wind up
  if (weatherKey === "thunderstorm" || weatherKey === "blizzard") {
    windWeights = { calm: 0, lightBreeze: 5, moderateWind: 15, strongWind: 50, gale: 30 };
  }
  const windKey = weightedRandom(windWeights);
  const windLevel = WIND_LEVELS[windKey];

  return { weatherType, windLevel, temperature, season, terrain };
}

/**
 * Returns the full mechanical effect block for a weather type.
 * @param {string} weatherTypeKey - Key from WEATHER_TYPES
 * @returns {Object|null} WEATHER_TYPES entry or null if not found
 */
export function getWeatherEffects(weatherTypeKey) {
  return WEATHER_TYPES[weatherTypeKey] ?? null;
}

/**
 * Rolls whether the weather changes and, if so, transitions to a new state.
 * Consecutive days of extreme weather are more likely to persist (momentum).
 * @param {string} currentWeatherKey - Key from WEATHER_TYPES
 * @param {string} season - Key from SEASONAL_WEATHER
 * @returns {{ changed: boolean, newWeatherKey: string, newWeather: Object }}
 */
export function rollWeatherChange(currentWeatherKey, season) {
  // 40% base chance of change per period
  const changeChance = 0.4;
  if (Math.random() > changeChance) {
    return { changed: false, newWeatherKey: currentWeatherKey, newWeather: WEATHER_TYPES[currentWeatherKey] };
  }

  const seasonData = SEASONAL_WEATHER[season] ?? SEASONAL_WEATHER.spring;
  // Bias toward adjacent weather types by boosting neighbours
  const currentIndex = Object.keys(WEATHER_TYPES).indexOf(currentWeatherKey);
  const probs = { ...seasonData.weatherProbabilities };

  // Slightly increase probability of nearby weather entries in the list
  const allKeys = Object.keys(WEATHER_TYPES);
  [-1, 1].forEach((offset) => {
    const neighbourKey = allKeys[currentIndex + offset];
    if (neighbourKey && probs[neighbourKey] !== undefined) {
      probs[neighbourKey] = (probs[neighbourKey] ?? 0) + 10;
    }
  });

  const newWeatherKey = weightedRandom(probs);
  return {
    changed: newWeatherKey !== currentWeatherKey,
    newWeatherKey,
    newWeather: WEATHER_TYPES[newWeatherKey],
  };
}

/**
 * Returns the temperature effects band for a given temperature in °F.
 * @param {number} temperature - Temperature in °F
 * @returns {Object} TEMPERATURE_EFFECTS entry
 */
export function getTemperatureEffects(temperature) {
  if (temperature <= 0) return TEMPERATURE_EFFECTS.extremeCold;
  if (temperature <= 32) return TEMPERATURE_EFFECTS.cold;
  if (temperature <= 64) return TEMPERATURE_EFFECTS.mild;
  if (temperature <= 99) return TEMPERATURE_EFFECTS.warm;
  if (temperature <= 109) return TEMPERATURE_EFFECTS.hot;
  return TEMPERATURE_EFFECTS.extremeHeat;
}

/**
 * Generates a multi-day weather forecast array.
 * @param {number} days - Number of days to forecast (1–30)
 * @param {string} season - Key from SEASONAL_WEATHER
 * @param {string} [terrain="forest"] - Key from TERRAIN_WEATHER_MODIFIERS
 * @returns {Array<{ day: number, weatherType: Object, windLevel: Object, temperature: number, temperatureEffects: Object }>}
 */
export function generateWeatherForecast(days, season, terrain = "forest") {
  const clampedDays = Math.min(Math.max(1, Math.round(days)), 30);
  const forecast = [];

  let current = generateWeather(season, terrain);

  for (let day = 1; day <= clampedDays; day++) {
    if (day > 1) {
      const change = rollWeatherChange(current.weatherType.id, season);
      if (change.changed) {
        current = generateWeather(season, terrain);
      } else {
        // Recalculate temperature variation even on same weather type
        const terrainMod = TERRAIN_WEATHER_MODIFIERS[terrain];
        const tempShift = terrainMod ? terrainMod.temperatureModifier : 0;
        const seasonData = SEASONAL_WEATHER[season] ?? SEASONAL_WEATHER.spring;
        const { min, max } = seasonData.temperatureRange;
        const baseTemp = Math.round(min + Math.random() * (max - min));
        current = { ...current, temperature: baseTemp + tempShift };
      }
    }

    forecast.push({
      day,
      weatherType: current.weatherType,
      windLevel: current.windLevel,
      temperature: current.temperature,
      temperatureEffects: getTemperatureEffects(current.temperature),
    });
  }

  return forecast;
}

/**
 * Rolls for a random special weather event.
 * Returns null if no event occurs (most rolls).
 * Base chance is ~15% per invocation; rarity weight further filters results.
 * @returns {Object|null} WEATHER_EVENTS entry or null
 */
export function rollWeatherEvent() {
  // 15% base chance an event occurs at all
  if (Math.random() > 0.15) return null;

  const weightMap = Object.fromEntries(
    Object.entries(WEATHER_EVENTS).map(([key, evt]) => [key, evt.rarityWeight])
  );
  const eventKey = weightedRandom(weightMap);
  return WEATHER_EVENTS[eventKey];
}
