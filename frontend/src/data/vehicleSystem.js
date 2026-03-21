/**
 * Vehicle System — Vehicles, siege weapons, sea travel events, and caravan mechanics.
 * Covers roadmap items 454–456.
 */

// ---------------------------------------------------------------------------
// 1. VEHICLES
// ---------------------------------------------------------------------------

export const VEHICLES = {
  cart: {
    name: 'Cart',
    type: 'land',
    speed: '40 ft.',
    crew: 1,
    passengers: 3,
    cargoCapacity: '2,000 lb.',
    cargoLb: 2000,
    hp: 50,
    ac: 13,
    costGp: 15,
    description: 'A simple two-wheeled vehicle drawn by a single draft animal. Common among farmers and merchants for short hauls.',
  },
  wagon: {
    name: 'Wagon',
    type: 'land',
    speed: '40 ft.',
    crew: 2,
    passengers: 8,
    cargoCapacity: '4,000 lb.',
    cargoLb: 4000,
    hp: 80,
    ac: 13,
    costGp: 35,
    description: 'A sturdy four-wheeled vehicle suited for long overland journeys. The workhorse of trade caravans.',
  },
  carriage: {
    name: 'Carriage',
    type: 'land',
    speed: '60 ft.',
    crew: 2,
    passengers: 4,
    cargoCapacity: '500 lb.',
    cargoLb: 500,
    hp: 100,
    ac: 14,
    costGp: 100,
    description: 'An enclosed, sprung coach favored by nobility. Fast but light on cargo space.',
  },
  rowboat: {
    name: 'Rowboat',
    type: 'water',
    speed: '15 ft.',
    crew: 1,
    passengers: 3,
    cargoCapacity: '500 lb.',
    cargoLb: 500,
    hp: 50,
    ac: 11,
    costGp: 50,
    description: 'A small oar-powered boat for rivers and calm coastal waters.',
  },
  keelboat: {
    name: 'Keelboat',
    type: 'water',
    speed: '10 ft. (row) / 30 ft. (sail)',
    crew: 3,
    passengers: 6,
    cargoCapacity: '1/2 ton (1,000 lb.)',
    cargoLb: 1000,
    hp: 100,
    ac: 15,
    costGp: 3000,
    description: 'A flat-bottomed vessel that can navigate shallow rivers and coastal waters under oar or sail.',
  },
  sailingShip: {
    name: 'Sailing Ship',
    type: 'water',
    speed: '40 ft. (sail)',
    crew: 20,
    passengers: 20,
    cargoCapacity: '100 tons',
    cargoLb: 200000,
    hp: 300,
    ac: 15,
    costGp: 10000,
    description: 'A large wind-powered merchant vessel capable of ocean crossings.',
  },
  galley: {
    name: 'Galley',
    type: 'water',
    speed: '40 ft. (row/sail)',
    crew: 80,
    passengers: 40,
    cargoCapacity: '150 tons',
    cargoLb: 300000,
    hp: 500,
    ac: 15,
    costGp: 30000,
    description: 'A massive oar-and-sail warship. Banks of rowers provide reliable speed regardless of wind.',
  },
  warship: {
    name: 'Warship',
    type: 'water',
    speed: '25 ft. (sail)',
    crew: 60,
    passengers: 60,
    cargoCapacity: '200 tons',
    cargoLb: 400000,
    hp: 500,
    ac: 15,
    costGp: 25000,
    siegeWeapons: true,
    description: 'A heavily reinforced sailing vessel built for naval combat. Comes equipped with siege weapon mounts.',
  },
  airship: {
    name: 'Airship',
    type: 'air',
    speed: '80 ft. (fly)',
    crew: 10,
    passengers: 20,
    cargoCapacity: '1 ton (2,000 lb.)',
    cargoLb: 2000,
    hp: 300,
    ac: 13,
    costGp: 50000,
    description: 'A rare, magically or mechanically buoyant vessel that soars above the landscape. Prized and coveted.',
  },
};

// ---------------------------------------------------------------------------
// 2. SIEGE WEAPONS
// ---------------------------------------------------------------------------

export const SIEGE_WEAPONS = {
  ballista: {
    name: 'Ballista',
    attackBonus: 6,
    damage: '3d10',
    damageType: 'piercing',
    range: '120/480 ft.',
    rangeNormal: 120,
    rangeLong: 480,
    crew: 3,
    description: 'A giant crossbow that fires heavy bolts. Requires an action to load and an action to fire.',
  },
  cannon: {
    name: 'Cannon',
    attackBonus: 6,
    damage: '8d10',
    damageType: 'bludgeoning',
    range: '600/2,400 ft.',
    rangeNormal: 600,
    rangeLong: 2400,
    crew: 3,
    description: 'A heavy iron tube that launches explosive projectiles. Deafeningly loud.',
  },
  mangonel: {
    name: 'Mangonel',
    attackBonus: 5,
    damage: '5d10',
    damageType: 'bludgeoning',
    range: '200/800 ft.',
    rangeNormal: 200,
    rangeLong: 800,
    aoe: true,
    aoeSize: '10 ft. radius',
    crew: 5,
    description: 'A catapult that hurls heavy stones in an arc. Each creature in the impact area must make a DC 15 Dex save or take full damage (half on success).',
  },
  ram: {
    name: 'Battering Ram',
    attackBonus: null,
    autoHit: true,
    damage: '3d10',
    damageType: 'bludgeoning',
    range: 'Melee (must be adjacent to target)',
    rangeNormal: 5,
    rangeLong: 5,
    targetRestriction: 'structures only',
    crew: 4,
    description: 'A heavy log, sometimes iron-tipped, swung or rolled into doors and walls. Automatically hits structures.',
  },
  greekFire: {
    name: 'Greek Fire Projector',
    attackBonus: null,
    autoHit: true,
    damage: '2d6',
    damageType: 'fire',
    range: '30 ft. cone or 60 ft. line',
    aoe: true,
    aoeSize: '10 ft. area',
    ignites: true,
    crew: 2,
    description: 'A pressurized siphon that sprays alchemical fire. Targets in the area must succeed on a DC 13 Dex save or catch fire, taking 1d6 fire damage at the start of each turn until extinguished (action).',
  },
};

// ---------------------------------------------------------------------------
// 3. SEA TRAVEL EVENTS (d20)
// ---------------------------------------------------------------------------

export const SEA_TRAVEL_EVENTS = [
  { roll: 1,  event: 'Calm Seas',          description: 'Glass-smooth water. No wind — sailing ships make half speed for 1d4 hours.', severity: 'neutral' },
  { roll: 2,  event: 'Favorable Wind',     description: 'Strong tailwind doubles sailing speed for the day.', severity: 'beneficial' },
  { roll: 3,  event: 'Sudden Squall',      description: 'A brief but violent storm. DC 13 crew check or take 2d6 ship damage and lose half a day\'s travel.', severity: 'dangerous' },
  { roll: 4,  event: 'Fog Bank',           description: 'Thick fog reduces visibility to 30 ft. for 1d6 hours. Navigation DC 14 or drift off course.', severity: 'hazardous' },
  { roll: 5,  event: 'Pirate Sighting',    description: 'A pirate vessel spotted on the horizon. It begins closing distance. Fight, flee, or parley.', severity: 'dangerous' },
  { roll: 6,  event: 'Floating Wreckage',  description: 'Debris from a destroyed ship. Investigation DC 12 reveals 2d6 × 10 gp worth of salvageable cargo.', severity: 'beneficial' },
  { roll: 7,  event: 'Sea Monster',        description: 'A large creature surfaces nearby — roll on the encounter table or use a kraken, dragon turtle, or sea serpent.', severity: 'deadly' },
  { roll: 8,  event: 'Merfolk Encounter',   description: 'A pod of merfolk approach the ship. They may trade, warn of dangers, or ask for help.', severity: 'neutral' },
  { roll: 9,  event: 'Doldrums',           description: 'No wind for 1d3 days. Sailing ships are becalmed. Crew morale drops; rations are consumed.', severity: 'hazardous' },
  { roll: 10, event: 'Schools of Fish',    description: 'Abundant fish surround the vessel. A successful Survival DC 10 yields enough food for 2d4 days of rations.', severity: 'beneficial' },
  { roll: 11, event: 'Coral Reef',         description: 'Hidden reef ahead. Perception DC 14 to spot it in time; failure means 4d6 hull damage.', severity: 'hazardous' },
  { roll: 12, event: 'Stowaway Discovered', description: 'The crew finds a stowaway — a runaway, a spy, or something worse.', severity: 'neutral' },
  { roll: 13, event: 'Ghost Ship',         description: 'An unmanned vessel drifts into view, sails tattered. Boarding reveals eerie clues and possible treasure or undead.', severity: 'dangerous' },
  { roll: 14, event: 'Waterspout',         description: 'A tornado forms over the water. DC 15 crew check to steer clear; failure deals 6d6 damage to the ship.', severity: 'deadly' },
  { roll: 15, event: 'Trade Vessel',       description: 'A friendly merchant ship hails you. Opportunity to buy supplies, trade goods, or exchange news.', severity: 'beneficial' },
  { roll: 16, event: 'Mysterious Island',  description: 'An uncharted island appears. It may hold treasure, dangers, or a stranded castaway.', severity: 'neutral' },
  { roll: 17, event: 'Electrical Storm',   description: 'Lightning dances across the mast. Each crew member on deck: DC 12 Dex save or take 2d10 lightning damage.', severity: 'dangerous' },
  { roll: 18, event: 'Strong Current',     description: 'A powerful ocean current carries the ship. Navigation DC 13 — success adds 1d4 × 10 miles, failure pushes off course.', severity: 'neutral' },
  { roll: 19, event: 'Naval Patrol',       description: 'A military ship approaches and demands to inspect your cargo. Contraband will be seized; warrants checked.', severity: 'neutral' },
  { roll: 20, event: 'Kraken Sighting',    description: 'Massive tentacles breach the surface. The beast tests the ship — will it attack or simply observe? Pray.', severity: 'deadly' },
];

// ---------------------------------------------------------------------------
// 4. CARAVAN RULES
// ---------------------------------------------------------------------------

export const CARAVAN_GUARD_TIERS = {
  militia: {
    label: 'Militia / Commoners',
    costPerDay: 0.2,
    cr: '0',
    notes: 'Untrained volunteers. Will flee from serious threats.',
  },
  hired: {
    label: 'Hired Guards',
    costPerDay: 2,
    cr: '1/2',
    notes: 'Basic mercenaries with leather armor and swords.',
  },
  veteran: {
    label: 'Veteran Soldiers',
    costPerDay: 5,
    cr: '3',
    notes: 'Experienced fighters. Reliable in most encounters.',
  },
  elite: {
    label: 'Elite Escorts',
    costPerDay: 15,
    cr: '5',
    notes: 'Knights or specialized mercenaries. Can handle dangerous routes.',
  },
  legendary: {
    label: 'Legendary Sellswords',
    costPerDay: 50,
    cr: '9+',
    notes: 'Named warriors or small adventuring parties. Almost nothing stops them.',
  },
};

export const CARGO_INSURANCE = {
  none: { label: 'No Insurance', premiumPercent: 0, coveragePercent: 0 },
  basic: { label: 'Basic Coverage', premiumPercent: 5, coveragePercent: 50, notes: 'Covers natural disasters and accidents only.' },
  standard: { label: 'Standard Coverage', premiumPercent: 10, coveragePercent: 80, notes: 'Covers theft, disasters, and monster attacks.' },
  full: { label: 'Full Coverage', premiumPercent: 20, coveragePercent: 100, notes: 'Covers all losses including acts of war. Rare; offered only by major guilds.' },
};

export const TRADE_GOODS_MARGINS = {
  short: { label: 'Short Route (< 50 mi)', profitMarginPercent: 5, riskLevel: 'low' },
  medium: { label: 'Medium Route (50–200 mi)', profitMarginPercent: 15, riskLevel: 'moderate' },
  long: { label: 'Long Route (200–500 mi)', profitMarginPercent: 30, riskLevel: 'high' },
  extreme: { label: 'Extreme Route (500+ mi)', profitMarginPercent: 50, riskLevel: 'very high' },
  exotic: { label: 'Exotic / Cross-Planar', profitMarginPercent: 100, riskLevel: 'extreme' },
};

export const CARAVAN_RULES = {
  guardTiers: CARAVAN_GUARD_TIERS,
  insurance: CARGO_INSURANCE,
  tradeMargins: TRADE_GOODS_MARGINS,
};

// ---------------------------------------------------------------------------
// 5. HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Look up a vehicle by key (e.g. 'wagon', 'sailingShip').
 * Returns the vehicle object or null.
 */
export function getVehicle(type) {
  return VEHICLES[type] || null;
}

/**
 * Look up a siege weapon by key (e.g. 'ballista', 'cannon').
 * Returns the weapon object or null.
 */
export function getSiegeWeapon(type) {
  return SIEGE_WEAPONS[type] || null;
}

/**
 * Roll a random sea travel event (simulates a d20).
 * Returns the matching event object.
 */
export function rollSeaEvent() {
  const roll = Math.floor(Math.random() * 20) + 1;
  return SEA_TRAVEL_EVENTS.find((e) => e.roll === roll) || SEA_TRAVEL_EVENTS[0];
}

/**
 * Calculate the total cost of running a caravan.
 *
 * @param {Object} options
 * @param {number} options.guardCount     — number of guards to hire
 * @param {string} options.guardTier      — key from CARAVAN_GUARD_TIERS (default 'hired')
 * @param {number} options.days           — travel duration in days
 * @param {number} options.cargoValueGp   — total value of cargo in gp (used for insurance calc)
 * @param {string} options.insuranceTier  — key from CARGO_INSURANCE (default 'none')
 * @returns {{ guardCost: number, insuranceCost: number, total: number, breakdown: object }}
 */
export function calculateCaravanCost({ guardCount = 1, guardTier = 'hired', days = 1, cargoValueGp = 0, insuranceTier = 'none' } = {}) {
  const guard = CARAVAN_GUARD_TIERS[guardTier] || CARAVAN_GUARD_TIERS.hired;
  const insurance = CARGO_INSURANCE[insuranceTier] || CARGO_INSURANCE.none;

  const guardCost = guardCount * guard.costPerDay * days;
  const insuranceCost = cargoValueGp * (insurance.premiumPercent / 100);
  const total = guardCost + insuranceCost;

  return {
    guardCost,
    insuranceCost,
    total,
    breakdown: {
      guards: `${guardCount} × ${guard.label} @ ${guard.costPerDay} gp/day × ${days} days`,
      insurance: insuranceTier === 'none' ? 'None' : `${insurance.label} (${insurance.premiumPercent}% of ${cargoValueGp} gp cargo)`,
    },
  };
}
