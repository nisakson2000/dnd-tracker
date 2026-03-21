/**
 * Off-Screen World Simulation — Living World Engine
 *
 * Covers roadmap items 196-204 (Off-screen simulation, Faction goals, Villain plans,
 * Crisis escalation, Population mood, Resource scarcity, Seasonal effects, Migration).
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const d = (n) => Math.floor(Math.random() * n) + 1;

// ── Between-Session Event Types ──
export const WORLD_EVENT_TYPES = {
  faction: {
    label: 'Faction Activity',
    events: [
      { template: '{faction} expanded their territory into {region}', impact: 'territorial', severity: 'medium' },
      { template: '{faction} assassinated a rival leader in {region}', impact: 'political', severity: 'high' },
      { template: '{faction} formed an alliance with {otherFaction}', impact: 'diplomatic', severity: 'high' },
      { template: '{faction} suffered an internal power struggle', impact: 'political', severity: 'medium' },
      { template: '{faction} recruited heavily in {region}', impact: 'military', severity: 'low' },
      { template: '{faction} established a new outpost near {region}', impact: 'territorial', severity: 'low' },
      { template: '{faction} began stockpiling weapons and supplies', impact: 'military', severity: 'medium' },
      { template: '{faction} sent spies to infiltrate {otherFaction}', impact: 'espionage', severity: 'medium' },
    ],
  },
  villain: {
    label: 'Villain Progression',
    events: [
      { template: '{villain} acquired a powerful artifact', impact: 'power', severity: 'high' },
      { template: '{villain} corrupted a local official', impact: 'political', severity: 'medium' },
      { template: '{villain} raised an undead army in secret', impact: 'military', severity: 'high' },
      { template: '{villain} completed a dark ritual', impact: 'magical', severity: 'high' },
      { template: '{villain} sent agents to spy on the party', impact: 'espionage', severity: 'medium' },
      { template: '{villain} destroyed a village as a show of force', impact: 'destruction', severity: 'high' },
      { template: '{villain} recruited a new lieutenant', impact: 'power', severity: 'low' },
      { template: '{villain} forged an alliance with a monster group', impact: 'military', severity: 'medium' },
    ],
  },
  crisis: {
    label: 'Crisis Escalation',
    events: [
      { template: 'The {crisis} in {region} worsened — casualties are mounting', impact: 'humanitarian', severity: 'high' },
      { template: 'Refugees from {region} overwhelm neighboring towns', impact: 'social', severity: 'medium' },
      { template: 'The {crisis} attracted opportunistic bandits to {region}', impact: 'security', severity: 'medium' },
      { template: 'A hero attempted to stop the {crisis} but failed', impact: 'morale', severity: 'medium' },
      { template: 'The {crisis} spread to a neighboring region', impact: 'expansion', severity: 'high' },
      { template: 'Desperate citizens in {region} turned to dark magic for salvation', impact: 'magical', severity: 'high' },
    ],
  },
  natural: {
    label: 'Natural Events',
    events: [
      { template: 'Unseasonable storms battered {region}', impact: 'weather', severity: 'low' },
      { template: 'A new vein of precious ore was discovered near {region}', impact: 'economic', severity: 'medium' },
      { template: 'Wild animal attacks increased in {region}', impact: 'security', severity: 'low' },
      { template: 'A mysterious plague broke out in {region}', impact: 'health', severity: 'high' },
      { template: 'The harvest in {region} was exceptionally good this season', impact: 'economic', severity: 'low' },
      { template: 'An earthquake damaged structures in {region}', impact: 'destruction', severity: 'medium' },
      { template: 'A dragon was sighted flying over {region}', impact: 'threat', severity: 'high' },
    ],
  },
  social: {
    label: 'Social Changes',
    events: [
      { template: 'A popular festival drew crowds to {region}', impact: 'morale', severity: 'low' },
      { template: 'A prominent merchant in {region} went bankrupt', impact: 'economic', severity: 'medium' },
      { template: 'A new religion gained followers in {region}', impact: 'cultural', severity: 'low' },
      { template: 'Crime increased in {region} due to economic hardship', impact: 'security', severity: 'medium' },
      { template: 'A legendary hero returned to {region} after years away', impact: 'morale', severity: 'medium' },
      { template: 'A scandal rocked the noble house of {region}', impact: 'political', severity: 'medium' },
    ],
  },
};

// ── Population Mood System ──
export const POPULATION_MOODS = [
  { level: -5, label: 'Revolt', description: 'Open rebellion. Fires in the streets. Guards overwhelmed.', color: '#7f1d1d' },
  { level: -4, label: 'Furious', description: 'Riots and protests. Shops close. Guards patrol in force.', color: '#dc2626' },
  { level: -3, label: 'Angry', description: 'Public outrage. Graffiti, vandalism, refused taxes. Curfew imposed.', color: '#ef4444' },
  { level: -2, label: 'Discontent', description: 'Grumbling and complaints. Merchants charge more. Guards suspicious.', color: '#f97316' },
  { level: -1, label: 'Uneasy', description: 'Nervous population. Rumors spread fast. Strangers watched carefully.', color: '#eab308' },
  { level: 0,  label: 'Neutral', description: 'Normal life. People go about their business. Standard prices.', color: '#6b7280' },
  { level: 1,  label: 'Content', description: 'Generally happy. Markets busy. Friendly to visitors.', color: '#84cc16' },
  { level: 2,  label: 'Happy', description: 'Optimistic. Festivals planned. Prices fair. Generous to strangers.', color: '#22c55e' },
  { level: 3,  label: 'Jubilant', description: 'Celebrating. Free drinks. Parades. Everyone in high spirits.', color: '#10b981' },
  { level: 4,  label: 'Euphoric', description: 'Major victory or miracle. Streets filled with joy and gratitude.', color: '#06b6d4' },
];

// ── Mood Modifiers ──
export const MOOD_EVENTS = [
  { event: 'Victory in battle nearby', modifier: 2 },
  { event: 'Villain defeated', modifier: 3 },
  { event: 'Good harvest', modifier: 1 },
  { event: 'Festival or holiday', modifier: 1 },
  { event: 'Heroes saved the town', modifier: 2 },
  { event: 'War declared', modifier: -2 },
  { event: 'Town attacked', modifier: -3 },
  { event: 'Plague outbreak', modifier: -3 },
  { event: 'Taxes increased', modifier: -1 },
  { event: 'Famine', modifier: -2 },
  { event: 'Murder or crime wave', modifier: -1 },
  { event: 'Natural disaster', modifier: -2 },
  { event: 'Trade route opened', modifier: 1 },
  { event: 'Trade route disrupted', modifier: -1 },
  { event: 'Religious miracle', modifier: 2 },
  { event: 'Noble scandal', modifier: -1 },
  { event: 'Monster threat eliminated', modifier: 1 },
  { event: 'Refugees arriving', modifier: -1 },
];

// ── Resource Scarcity ──
export const RESOURCE_TYPES = {
  food: { label: 'Food', priceModifier: { surplus: 0.5, normal: 1, scarce: 2, crisis: 5 }, description: 'Grain, meat, produce' },
  water: { label: 'Clean Water', priceModifier: { surplus: 0.5, normal: 1, scarce: 3, crisis: 10 }, description: 'Drinkable water sources' },
  weapons: { label: 'Weapons & Armor', priceModifier: { surplus: 0.8, normal: 1, scarce: 1.5, crisis: 3 }, description: 'Military equipment' },
  lumber: { label: 'Lumber', priceModifier: { surplus: 0.7, normal: 1, scarce: 2, crisis: 4 }, description: 'Building materials' },
  iron: { label: 'Iron & Ore', priceModifier: { surplus: 0.8, normal: 1, scarce: 1.5, crisis: 3 }, description: 'Metals for smithing' },
  labor: { label: 'Labor', priceModifier: { surplus: 0.5, normal: 1, scarce: 2, crisis: 5 }, description: 'Workers and craftsmen' },
  medicine: { label: 'Medicine', priceModifier: { surplus: 0.7, normal: 1, scarce: 3, crisis: 8 }, description: 'Healing supplies and herbs' },
  magic: { label: 'Magical Components', priceModifier: { surplus: 0.9, normal: 1, scarce: 2, crisis: 5 }, description: 'Spell components, magic items' },
};

// ── Seasonal Effects ──
export const SEASONAL_EFFECTS = {
  spring: {
    label: 'Spring',
    worldEffects: ['Flooding in low areas', 'Roads muddy and slow', 'New growth in forests', 'Animals active and sometimes aggressive'],
    travelModifier: 0.9,
    encounterMod: 'Beasts more active, plant creatures awaken',
    economicEffect: 'Planting season — farm labor expensive',
  },
  summer: {
    label: 'Summer',
    worldEffects: ['Drought risk in dry regions', 'Heat exhaustion in deserts', 'Peak trade season', 'Long daylight hours'],
    travelModifier: 1.0,
    encounterMod: 'Standard encounters, more travelers on roads',
    economicEffect: 'Trade peaks — prices normalize or drop',
  },
  autumn: {
    label: 'Autumn',
    worldEffects: ['Harvest season', 'Shorter days', 'Animals preparing for winter', 'Fey activity increases around equinox'],
    travelModifier: 1.0,
    encounterMod: 'Animals aggressive before hibernation, harvest festivals',
    economicEffect: 'Harvest — food prices drop, surplus available',
  },
  winter: {
    label: 'Winter',
    worldEffects: ['Snow blocks mountain passes', 'Rivers freeze', 'Armies can\'t march effectively', 'Food supplies dwindle'],
    travelModifier: 0.5,
    encounterMod: 'Wolves desperate, bandits raid food stores, undead more active',
    economicEffect: 'Food prices increase 50-100%, trade slows significantly',
  },
};

/**
 * Generate between-session world events.
 */
export function generateWorldEvents(count = 3, context = {}) {
  const { factions = ['The Guild'], villains = ['The Dark Lord'], regions = ['the borderlands'], crises = ['the drought'] } = context;
  const events = [];
  const categories = Object.keys(WORLD_EVENT_TYPES);

  for (let i = 0; i < count; i++) {
    const category = pick(categories);
    const eventType = WORLD_EVENT_TYPES[category];
    const event = pick(eventType.events);

    let text = event.template
      .replace('{faction}', pick(factions))
      .replace('{otherFaction}', pick(factions))
      .replace('{villain}', pick(villains))
      .replace('{region}', pick(regions))
      .replace('{crisis}', pick(crises));

    events.push({
      category: eventType.label,
      text,
      impact: event.impact,
      severity: event.severity,
      approved: false,
    });
  }

  return events;
}

/**
 * Get population mood by level.
 */
export function getPopulationMood(level) {
  const clamped = Math.max(-5, Math.min(4, level));
  return POPULATION_MOODS.find(m => m.level === clamped) || POPULATION_MOODS[5];
}

/**
 * Calculate mood after events.
 */
export function calculateMoodShift(currentMood, eventNames) {
  let shift = 0;
  for (const eventName of eventNames) {
    const event = MOOD_EVENTS.find(e => e.event.toLowerCase() === eventName.toLowerCase());
    if (event) shift += event.modifier;
  }
  const newMood = Math.max(-5, Math.min(4, currentMood + shift));
  return { previousMood: currentMood, shift, newMood, newMoodInfo: getPopulationMood(newMood) };
}

/**
 * Get resource price modifier.
 */
export function getResourcePriceModifier(resourceType, scarcityLevel) {
  const resource = RESOURCE_TYPES[resourceType];
  if (!resource) return 1;
  return resource.priceModifier[scarcityLevel] || 1;
}

/**
 * Get seasonal effects.
 */
export function getSeasonEffects(season) {
  return SEASONAL_EFFECTS[season] || SEASONAL_EFFECTS.summer;
}

/**
 * Simulate migration based on events.
 */
export function simulateMigration(sourceRegion, destRegion, cause) {
  const causes = {
    war: { refugees: '2d100', speed: 'fast', problems: ['overcrowding', 'disease', 'crime', 'food shortage'] },
    famine: { refugees: '1d100', speed: 'slow', problems: ['starvation', 'begging', 'theft'] },
    plague: { refugees: '3d100', speed: 'fast', problems: ['disease spread', 'quarantine needed', 'panic'] },
    disaster: { refugees: '1d100 × 10', speed: 'medium', problems: ['shelter needed', 'food shortage', 'rebuilding'] },
    invasion: { refugees: '4d100', speed: 'fast', problems: ['military intel', 'spy risk', 'resource strain'] },
  };

  const migration = causes[cause] || causes.war;
  return {
    source: sourceRegion,
    destination: destRegion,
    cause,
    estimatedRefugees: migration.refugees,
    arrivalSpeed: migration.speed,
    problems: migration.problems,
    moodImpactAtDestination: -1,
  };
}
