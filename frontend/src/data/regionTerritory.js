/**
 * regionTerritory.js
 * D&D Region & Territory Map Annotation Data
 *
 * Roadmap Items Covered:
 *   - #185: Region/territory map annotations
 *
 * Provides structured data for region types, danger levels, territory features,
 * faction control mechanics, and trade routes. No React dependencies.
 */

// ---------------------------------------------------------------------------
// REGION_TYPES
// 10 political/geographical region classifications
// ---------------------------------------------------------------------------

export const REGION_TYPES = {
  kingdom: {
    id: 'kingdom',
    label: 'Kingdom',
    governanceStyle: 'Monarchy or feudal hierarchy; ruled by a king, queen, or emperor with noble vassals',
    typicalPopulationDensity: 'high',
    defenseLevel: 'strong',
    description: 'A large, organized realm with established laws, military, and infrastructure.',
  },
  cityState: {
    id: 'cityState',
    label: 'City-State',
    governanceStyle: 'Council, oligarchy, or elected magistrates; self-governing urban center',
    typicalPopulationDensity: 'very high',
    defenseLevel: 'strong',
    description: 'An independent city and its surrounding territory, often commercially powerful.',
  },
  tribalLand: {
    id: 'tribalLand',
    label: 'Tribal Land',
    governanceStyle: 'Chieftain, elder council, or shamanic leadership; clan-based authority',
    typicalPopulationDensity: 'low',
    defenseLevel: 'moderate',
    description: 'Territory controlled by one or more tribes, often with oral law and ancestral traditions.',
  },
  wilderness: {
    id: 'wilderness',
    label: 'Wilderness',
    governanceStyle: 'None; unclaimed or untamed land beyond civilized control',
    typicalPopulationDensity: 'very low',
    defenseLevel: 'none',
    description: 'Vast stretches of untamed nature — forests, mountains, swamps — with no ruling authority.',
  },
  contestedZone: {
    id: 'contestedZone',
    label: 'Contested Zone',
    governanceStyle: 'Disputed; multiple factions assert overlapping claims with no clear authority',
    typicalPopulationDensity: 'low',
    defenseLevel: 'variable',
    description: 'A region where two or more powers are actively fighting or competing for dominance.',
  },
  tradeRoute: {
    id: 'tradeRoute',
    label: 'Trade Route Corridor',
    governanceStyle: 'Consortium, guild charter, or treaty between neighboring powers',
    typicalPopulationDensity: 'moderate',
    defenseLevel: 'moderate',
    description: 'A corridor of land maintained primarily for commerce, often patrolled by merchant guild guards.',
  },
  dungeonRegion: {
    id: 'dungeonRegion',
    label: 'Dungeon Region',
    governanceStyle: 'Monster lord, undead ruler, or ancient curse; lawless and hostile',
    typicalPopulationDensity: 'very low',
    defenseLevel: 'hostile',
    description: 'A blighted area dominated by dungeons, ruins, or monster strongholds.',
  },
  underwaterTerritory: {
    id: 'underwaterTerritory',
    label: 'Underwater Territory',
    governanceStyle: 'Aquatic monarchy, sahuagin war-band, or merfolk senate',
    typicalPopulationDensity: 'low',
    defenseLevel: 'strong',
    description: 'Submerged regions with their own civilizations, laws, and territorial claims.',
  },
  planarZone: {
    id: 'planarZone',
    label: 'Planar Zone',
    governanceStyle: 'Planar lord, outsider collective, or raw elemental force',
    typicalPopulationDensity: 'variable',
    defenseLevel: 'extreme',
    description: 'Areas where the Material Plane bleeds into another plane, warping reality and laws of nature.',
  },
  neutralGround: {
    id: 'neutralGround',
    label: 'Neutral Ground',
    governanceStyle: 'Treaty-enforced neutrality; maintained by mutual agreement of surrounding powers',
    typicalPopulationDensity: 'moderate',
    defenseLevel: 'light',
    description: 'Demilitarized zones used for diplomacy, trade negotiations, or religious gatherings.',
  },
};

// ---------------------------------------------------------------------------
// DANGER_LEVELS
// 5 tiers scaled to D&D Challenge Rating encounter difficulty
// ---------------------------------------------------------------------------

export const DANGER_LEVELS = {
  safe: {
    id: 'safe',
    label: 'Safe',
    crRange: { min: 0, max: 2 },
    crRangeLabel: 'CR 0–2',
    encounterFrequency: 'Rare; mostly harmless wildlife or non-hostile travelers',
    travelSpeedModifier: 1.0,
    description: 'Well-patrolled roads and settled lands. Threats are minimal and easily handled.',
    color: '#4caf50',
    colorLabel: 'Green',
  },
  low: {
    id: 'low',
    label: 'Low',
    crRange: { min: 3, max: 5 },
    crRangeLabel: 'CR 3–5',
    encounterFrequency: 'Occasional; bandits, wolves, minor monsters on outskirts',
    travelSpeedModifier: 0.9,
    description: 'Lightly dangerous territory. Parties should travel with some preparation.',
    color: '#8bc34a',
    colorLabel: 'Light Green',
  },
  moderate: {
    id: 'moderate',
    label: 'Moderate',
    crRange: { min: 6, max: 10 },
    crRangeLabel: 'CR 6–10',
    encounterFrequency: 'Frequent; organized monsters, dangerous predators, hostile patrols',
    travelSpeedModifier: 0.75,
    description: 'Requires competent adventurers. Rest stops and ambushes are common concerns.',
    color: '#ffc107',
    colorLabel: 'Yellow',
  },
  high: {
    id: 'high',
    label: 'High',
    crRange: { min: 11, max: 15 },
    crRangeLabel: 'CR 11–15',
    encounterFrequency: 'Very frequent; apex predators, powerful undead, major monster war-bands',
    travelSpeedModifier: 0.5,
    description: 'Extremely perilous. Only experienced parties should enter without careful planning.',
    color: '#ff5722',
    colorLabel: 'Orange-Red',
  },
  deadly: {
    id: 'deadly',
    label: 'Deadly',
    crRange: { min: 16, max: 30 },
    crRangeLabel: 'CR 16+',
    encounterFrequency: 'Constant; legendary creatures, demon lords, planar horrors',
    travelSpeedModifier: 0.25,
    description: 'Near-suicidal to traverse. Even gods may avoid these regions without purpose.',
    color: '#9c27b0',
    colorLabel: 'Purple',
  },
};

// ---------------------------------------------------------------------------
// TERRITORY_FEATURES
// 12 point-of-interest / landmark categories for map annotation
// ---------------------------------------------------------------------------

export const TERRITORY_FEATURES = {
  capitalCity: {
    id: 'capitalCity',
    label: 'Capital City',
    iconHint: 'crown',
    strategicValue: 10,
    description: 'The seat of government. Controls region-wide law, taxation, and military command.',
    bonuses: ['political influence +3', 'recruitment hub', 'market access'],
  },
  fortress: {
    id: 'fortress',
    label: 'Fortress',
    iconHint: 'shield',
    strategicValue: 8,
    description: 'A military stronghold defending a chokepoint, border, or valuable asset.',
    bonuses: ['defense +2', 'garrison capacity', 'supply depot'],
  },
  tradeHub: {
    id: 'tradeHub',
    label: 'Trade Hub',
    iconHint: 'scales',
    strategicValue: 7,
    description: 'A major market town or port city. Economic center of a region.',
    bonuses: ['gold income +2', 'supply availability', 'information network'],
  },
  sacredSite: {
    id: 'sacredSite',
    label: 'Sacred Site',
    iconHint: 'ankh',
    strategicValue: 6,
    description: 'Temple, shrine, or holy ground of religious or magical significance.',
    bonuses: ['divine favor', 'healing services', 'pilgrim traffic'],
  },
  monsterLair: {
    id: 'monsterLair',
    label: 'Monster Lair',
    iconHint: 'skull',
    strategicValue: -5,
    description: 'Den of a powerful creature or monster band. Threatens surrounding territory.',
    bonuses: ['raid risk', 'territory destabilization', 'potential loot cache'],
  },
  resourceDeposit: {
    id: 'resourceDeposit',
    label: 'Resource Deposit',
    iconHint: 'pickaxe',
    strategicValue: 7,
    description: 'Mine, forest, quarry, or farmland producing valuable raw materials.',
    bonuses: ['resource income +2', 'crafting material access', 'economic leverage'],
  },
  portalCrossing: {
    id: 'portalCrossing',
    label: 'Portal / Crossing',
    iconHint: 'portal',
    strategicValue: 9,
    description: 'A stable portal, planar rift, or dimensional gateway. Highly contested by factions.',
    bonuses: ['rapid travel', 'planar access', 'exotic goods'],
  },
  ruins: {
    id: 'ruins',
    label: 'Ruins',
    iconHint: 'pillar',
    strategicValue: 3,
    description: 'Remnants of a former civilization. May contain secrets, traps, or undead.',
    bonuses: ['historical knowledge', 'salvage potential', 'dungeon access'],
  },
  settlement: {
    id: 'settlement',
    label: 'Settlement',
    iconHint: 'house',
    strategicValue: 4,
    description: 'A village, hamlet, or small town. Provides rest, resupply, and local quests.',
    bonuses: ['rest stop', 'supply resupply', 'local rumor source'],
  },
  patrolRoute: {
    id: 'patrolRoute',
    label: 'Patrol Route',
    iconHint: 'boot',
    strategicValue: 5,
    description: 'Regular military or guard patrol path. Increases safety along the corridor.',
    bonuses: ['danger reduction', 'bandit deterrence', 'emergency response'],
  },
  borderCrossing: {
    id: 'borderCrossing',
    label: 'Border Crossing',
    iconHint: 'gate',
    strategicValue: 6,
    description: 'Official checkpoint between territories. May require papers, tolls, or negotiations.',
    bonuses: ['legal entry point', 'customs revenue', 'diplomatic contact'],
  },
  naturalBarrier: {
    id: 'naturalBarrier',
    label: 'Natural Barrier',
    iconHint: 'mountain',
    strategicValue: 6,
    description: 'Mountain range, deep river, dense forest, or swamp that limits movement.',
    bonuses: ['defensive chokepoint', 'enemy advance blocker', 'resource isolation'],
  },
};

// ---------------------------------------------------------------------------
// FACTION_CONTROL
// Mechanics for tracking how factions assert influence over territory
// ---------------------------------------------------------------------------

export const FACTION_CONTROL = {
  influenceRange: {
    min: 0,
    max: 100,
    description: 'Influence score (0–100) a faction holds in a given region.',
  },
  controlThresholds: {
    dominant: {
      min: 75,
      max: 100,
      label: 'Dominant Control',
      description: 'Faction openly rules. Laws, taxes, and military are theirs alone.',
      color: '#1565c0',
    },
    strong: {
      min: 50,
      max: 74,
      label: 'Strong Influence',
      description: 'Faction has clear authority but faces minor opposition.',
      color: '#1976d2',
    },
    contested: {
      min: 30,
      max: 49,
      label: 'Contested',
      description: 'Multiple factions hold near-equal sway. Instability is common.',
      color: '#f57c00',
    },
    weak: {
      min: 10,
      max: 29,
      label: 'Weak Presence',
      description: 'Faction has outposts or sympathizers but lacks real authority.',
      color: '#e53935',
    },
    none: {
      min: 0,
      max: 9,
      label: 'No Control',
      description: 'Faction has negligible or no foothold in this region.',
      color: '#757575',
    },
  },
  expansionRules: {
    ratePerSession: 5,
    description: 'A faction may gain up to 5 influence points per session through active effort.',
    methods: [
      'Military conquest: +10 influence, triggers border dispute with displaced faction',
      'Political alliance: +5 influence, requires NPC relationship',
      'Economic investment: +3 influence per trade hub or resource deposit controlled',
      'Espionage/propaganda: +2 influence, -3 to rival faction in same region',
      'Religious conversion: +4 influence in regions with sacred site',
    ],
  },
  contractionRules: {
    ratePerSession: 3,
    description: 'Factions passively lose 3 influence per session in regions they cannot supply.',
    causes: [
      'Supply line severed: -5 influence per session',
      'Military defeat in region: -10 influence',
      'Key NPC defection: -4 influence',
      'Natural disaster or monster raid unaddressed: -3 influence',
      'Rival propaganda campaign: -2 influence per session',
    ],
  },
  borderDisputeThreshold: {
    triggerDifference: 10,
    description:
      'A border dispute is triggered when two factions are within 10 influence points of each other in the same region.',
    resolutionOptions: ['Negotiation', 'Military conflict', 'Third-party arbitration', 'Economic buyout'],
  },
};

// ---------------------------------------------------------------------------
// TRADE_ROUTES
// 6 route types with travel and economic metadata
// ---------------------------------------------------------------------------

export const TRADE_ROUTES = {
  landRoad: {
    id: 'landRoad',
    label: 'Land Road',
    speedModifier: 1.0,
    riskLevel: 'low',
    typicalGoods: ['grain', 'livestock', 'crafted goods', 'textiles', 'timber'],
    tollCostGpPerMile: 0.1,
    description: 'Maintained roads connecting cities and towns. Most common trade artery.',
    requirements: 'Cart or wagon; no special equipment needed',
  },
  river: {
    id: 'river',
    label: 'River',
    speedModifier: 1.25,
    riskLevel: 'low',
    typicalGoods: ['bulk cargo', 'stone', 'ore', 'barrels', 'foodstuffs'],
    tollCostGpPerMile: 0.05,
    description: 'River barge transport. Faster and cheaper than land for heavy cargo.',
    requirements: 'Boat or barge; navigable waterway',
  },
  seaLane: {
    id: 'seaLane',
    label: 'Sea Lane',
    speedModifier: 1.5,
    riskLevel: 'moderate',
    typicalGoods: ['spices', 'exotic goods', 'slaves', 'magical components', 'luxury items'],
    tollCostGpPerMile: 0.02,
    description: 'Open ocean shipping lanes. Fast for long distances but weather-dependent.',
    requirements: 'Seaworthy vessel; navigator; storm risk',
  },
  mountainPass: {
    id: 'mountainPass',
    label: 'Mountain Pass',
    speedModifier: 0.5,
    riskLevel: 'high',
    typicalGoods: ['gems', 'metal ore', 'furs', 'dwarven crafts', 'rare herbs'],
    tollCostGpPerMile: 0.3,
    description: 'Treacherous but irreplaceable paths through mountain ranges.',
    requirements: 'Pack animals preferred; cold weather gear; guide recommended',
  },
  undergroundTunnel: {
    id: 'undergroundTunnel',
    label: 'Underground Tunnel',
    speedModifier: 0.6,
    riskLevel: 'high',
    typicalGoods: ['contraband', 'underdark reagents', 'refugees', 'stolen goods', 'mushrooms'],
    tollCostGpPerMile: 0.5,
    description: 'Underdark or smuggler tunnel networks. Hidden from surface authorities.',
    requirements: 'Darkvision or light source; local guide; danger from denizens',
  },
  aerialRoute: {
    id: 'aerialRoute',
    label: 'Aerial Route',
    speedModifier: 3.0,
    riskLevel: 'moderate',
    typicalGoods: ['messages', 'light valuables', 'urgent cargo', 'VIP passengers', 'magical items'],
    tollCostGpPerMile: 2.0,
    description: 'Flight-based transport via mounts, ships, or teleportation networks.',
    requirements: 'Flying mount or vessel; weather awareness; expensive',
  },
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Returns a region type definition by its string ID.
 * @param {string} typeId - One of the REGION_TYPES keys
 * @returns {Object|null} The region type object, or null if not found
 */
export function getRegionType(typeId) {
  return REGION_TYPES[typeId] ?? null;
}

/**
 * Returns the appropriate DANGER_LEVELS entry for a given Challenge Rating.
 * @param {number} cr - The encounter Challenge Rating (0–30)
 * @returns {Object} The matching danger level object
 */
export function getDangerLevel(cr) {
  const numericCr = Number(cr) || 0;
  for (const level of Object.values(DANGER_LEVELS)) {
    if (numericCr >= level.crRange.min && numericCr <= level.crRange.max) {
      return level;
    }
  }
  // Default to deadly for anything above the known range
  return DANGER_LEVELS.deadly;
}

/**
 * Returns a territory feature definition by its string ID.
 * @param {string} featureId - One of the TERRITORY_FEATURES keys
 * @returns {Object|null} The feature object, or null if not found
 */
export function getFeature(featureId) {
  return TERRITORY_FEATURES[featureId] ?? null;
}

/**
 * Calculates estimated travel time in hours for a given distance.
 *
 * Base assumption: a party travels ~24 miles per day (3 miles/hour, 8 hours/day).
 * Both route type and danger level apply multiplicative speed modifiers.
 *
 * @param {number} distanceMiles - Distance to travel in miles
 * @param {string} routeType     - Key from TRADE_ROUTES (e.g. 'landRoad')
 * @param {string} dangerLevelId - Key from DANGER_LEVELS (e.g. 'moderate')
 * @returns {{ hours: number, days: number, modifiedMilesPerHour: number }}
 */
export function calculateTravelTime(distanceMiles, routeType, dangerLevelId) {
  const BASE_MILES_PER_HOUR = 3;
  const route = TRADE_ROUTES[routeType] ?? TRADE_ROUTES.landRoad;
  const danger = DANGER_LEVELS[dangerLevelId] ?? DANGER_LEVELS.safe;

  const modifiedMilesPerHour = BASE_MILES_PER_HOUR * route.speedModifier * danger.travelSpeedModifier;
  const hours = distanceMiles / modifiedMilesPerHour;
  const days = hours / 8; // 8 hours of travel per day

  return {
    hours: Math.ceil(hours * 10) / 10,
    days: Math.ceil(days * 10) / 10,
    modifiedMilesPerHour: Math.round(modifiedMilesPerHour * 100) / 100,
    routeLabel: route.label,
    dangerLabel: danger.label,
  };
}

/**
 * Returns the full trade route definition for a given route type ID.
 * @param {string} routeType - Key from TRADE_ROUTES
 * @returns {Object|null} The trade route object, or null if not found
 */
export function getTradeRouteInfo(routeType) {
  return TRADE_ROUTES[routeType] ?? null;
}

/**
 * Assesses the overall strategic strength of a region based on its features
 * and a faction's influence score.
 *
 * Strategic value is the sum of all feature strategicValues, scaled by
 * faction influence (0–100) as a percentage modifier.
 *
 * @param {string[]} featureIds       - Array of TERRITORY_FEATURES keys present in region
 * @param {number}   factionInfluence - Faction influence score (0–100)
 * @returns {{
 *   rawStrategicValue: number,
 *   influenceModifier: number,
 *   effectiveStrength: number,
 *   controlStatus: Object,
 *   featureBreakdown: Array
 * }}
 */
export function assessRegionStrength(featureIds, factionInfluence) {
  const influence = Math.max(0, Math.min(100, Number(factionInfluence) || 0));

  const featureBreakdown = featureIds.map((id) => {
    const feature = TERRITORY_FEATURES[id];
    return feature
      ? { id, label: feature.label, strategicValue: feature.strategicValue }
      : { id, label: 'Unknown', strategicValue: 0 };
  });

  const rawStrategicValue = featureBreakdown.reduce((sum, f) => sum + f.strategicValue, 0);
  const influenceModifier = influence / 100;
  const effectiveStrength = Math.round(rawStrategicValue * influenceModifier * 10) / 10;

  // Determine control status from thresholds
  let controlStatus = FACTION_CONTROL.controlThresholds.none;
  for (const threshold of Object.values(FACTION_CONTROL.controlThresholds)) {
    if (influence >= threshold.min && influence <= threshold.max) {
      controlStatus = threshold;
      break;
    }
  }

  return {
    rawStrategicValue,
    influenceModifier,
    effectiveStrength,
    controlStatus,
    featureBreakdown,
  };
}
