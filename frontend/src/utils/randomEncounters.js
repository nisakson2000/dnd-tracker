/**
 * Random Encounter Generator — Terrain-based encounters tied to world state.
 *
 * Generates encounters appropriate to the party's current location, level,
 * and world state (faction activity, crisis severity, villain phase).
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const d = (n) => Math.floor(Math.random() * n) + 1;

// ── Encounter Tables by Terrain ──
const ENCOUNTER_TABLES = {
  road: {
    label: 'Road / Highway',
    encounters: [
      { name: 'Merchant Caravan', type: 'social', cr: '0', description: 'A merchant caravan heading to the next town. They might have goods to trade or information to share.' },
      { name: 'Bandit Ambush', type: 'combat', cr: '1-3', description: 'Bandits have set up a roadblock. They demand a toll — or else.' },
      { name: 'Broken Wagon', type: 'exploration', cr: '0', description: 'An overturned wagon blocks the path. Is the driver injured, or is this a trap?' },
      { name: 'Patrol', type: 'social', cr: '1', description: 'A patrol of guards or soldiers questions travelers. Are they looking for someone?' },
      { name: 'Pilgrim Group', type: 'social', cr: '0', description: 'A group of pilgrims traveling to a holy site. They share food and rumors.' },
      { name: 'Refugee Column', type: 'social', cr: '0', description: 'Refugees flee a nearby conflict or disaster. They beg for food and protection.' },
      { name: 'Mounted Courier', type: 'social', cr: '0', description: 'A messenger riding hard with urgent news. What are they carrying?' },
    ],
  },
  forest: {
    label: 'Forest / Woodland',
    encounters: [
      { name: 'Wolf Pack', type: 'combat', cr: '1-2', description: 'A pack of wolves, hungry and bold. They circle the party, testing for weakness.' },
      { name: 'Dryad Grove', type: 'social', cr: '1', description: 'A dryad emerges from an ancient tree. She has a request — or a warning.' },
      { name: 'Owlbear', type: 'combat', cr: '3', description: 'An owlbear crashes through the underbrush, territorial and aggressive.' },
      { name: 'Abandoned Camp', type: 'exploration', cr: '0', description: 'A recently abandoned campsite. The fire is still warm. Who was here, and why did they leave in a hurry?' },
      { name: 'Fey Crossing', type: 'exploration', cr: 'varies', description: 'The boundary between planes is thin here. Strange lights dance between the trees.' },
      { name: 'Poacher\'s Trap', type: 'exploration', cr: '1', description: 'Hidden snare traps and pit traps dot the area. A poacher watches from hiding.' },
      { name: 'Treant', type: 'social', cr: '9', description: 'An ancient treant blocks the path. It speaks slowly and demands to know your purpose in its forest.' },
    ],
  },
  mountain: {
    label: 'Mountain / Hills',
    encounters: [
      { name: 'Rockslide', type: 'hazard', cr: '2', description: 'The ground trembles and rocks cascade down the slope. DEX saves to avoid.' },
      { name: 'Giant Eagle', type: 'social', cr: '1', description: 'A giant eagle circles overhead. It could be a potential ally — or just hungry.' },
      { name: 'Orc Raiding Party', type: 'combat', cr: '2-4', description: 'Orcs descend from a mountain stronghold, looking for loot and glory.' },
      { name: 'Mountain Hermit', type: 'social', cr: '0', description: 'A hermit living in a cave. They\'ve seen things from up here — and know secrets.' },
      { name: 'Wyvern', type: 'combat', cr: '6', description: 'A wyvern nests on the cliff above. It swoops down to defend its territory.' },
      { name: 'Ancient Shrine', type: 'exploration', cr: '0', description: 'A crumbling shrine to a forgotten deity. Offerings still sit on the altar.' },
    ],
  },
  swamp: {
    label: 'Swamp / Marsh',
    encounters: [
      { name: 'Will-o\'-Wisps', type: 'combat', cr: '2', description: 'Dancing lights lure travelers off the safe path and into quicksand.' },
      { name: 'Lizardfolk Hunters', type: 'social', cr: '1-2', description: 'Lizardfolk emerge from the reeds. They\'re not hostile — yet. They want to trade.' },
      { name: 'Shambling Mound', type: 'combat', cr: '5', description: 'What looked like a pile of vegetation rises and attacks.' },
      { name: 'Quicksand', type: 'hazard', cr: '1', description: 'The ground gives way. STR save or be pulled under.' },
      { name: 'Hag\'s Hut', type: 'social', cr: '3-5', description: 'A hag\'s dwelling sits on stilts over the muck. She offers a deal — at a price.' },
      { name: 'Corpse Flower', type: 'combat', cr: '8', description: 'The sickeningly sweet smell of flowers leads to a horrifying plant creature.' },
    ],
  },
  urban: {
    label: 'City / Town',
    encounters: [
      { name: 'Pickpocket', type: 'social', cr: '0', description: 'A street urchin attempts to lift a purse. Perception check to notice.' },
      { name: 'Bar Fight', type: 'combat', cr: '0-1', description: 'A tavern brawl spills into the street. Getting involved is optional — but tempting.' },
      { name: 'Street Performer', type: 'social', cr: '0', description: 'A performer draws a crowd. Among the watchers, someone is watching the party.' },
      { name: 'Guard Shakedown', type: 'social', cr: '1', description: 'Corrupt guards demand a "fee" for passage through their district.' },
      { name: 'Mysterious Stranger', type: 'social', cr: 'varies', description: 'A cloaked figure approaches with a job — or a warning.' },
      { name: 'Sewer Monster', type: 'combat', cr: '2-4', description: 'Something is emerging from the sewers at night. The locals are terrified.' },
      { name: 'Festival', type: 'social', cr: '0', description: 'The town is celebrating a festival. Games, food, and opportunities for chaos.' },
    ],
  },
  desert: {
    label: 'Desert / Wasteland',
    encounters: [
      { name: 'Sandstorm', type: 'hazard', cr: '2', description: 'A wall of sand approaches. Find shelter or suffer blinding and exhaustion.' },
      { name: 'Giant Scorpion', type: 'combat', cr: '3', description: 'A giant scorpion bursts from beneath the sand, claws snapping.' },
      { name: 'Oasis', type: 'exploration', cr: '0', description: 'An oasis shimmers ahead. Is it real, or a mirage? If real, who else knows about it?' },
      { name: 'Nomad Traders', type: 'social', cr: '0', description: 'Desert nomads offer water, supplies, and tales of what lies ahead.' },
      { name: 'Ancient Ruins', type: 'exploration', cr: 'varies', description: 'Half-buried ruins protrude from the dunes. Something glints in the sand.' },
      { name: 'Blue Dragon', type: 'combat', cr: '9-16', description: 'Lightning arcs across the sand. A blue dragon hunts across its territory.' },
    ],
  },
  underdark: {
    label: 'Underdark / Deep',
    encounters: [
      { name: 'Drow Patrol', type: 'combat', cr: '3-5', description: 'A drow patrol moves silently through the tunnels. They shoot first.' },
      { name: 'Myconid Colony', type: 'social', cr: '1', description: 'Mushroom folk communicate through spores. They\'re peaceful — and lonely.' },
      { name: 'Gelatinous Cube', type: 'combat', cr: '2', description: 'The corridor ahead looks clean — suspiciously clean. A gelatinous cube fills it.' },
      { name: 'Underground River', type: 'exploration', cr: '1', description: 'A fast-moving underground river blocks the path. Swimming is dangerous.' },
      { name: 'Mind Flayer', type: 'combat', cr: '7', description: 'A mind flayer and its thralls emerge from the darkness, hunting for brains.' },
      { name: 'Bioluminescent Cavern', type: 'exploration', cr: '0', description: 'A massive cavern glows with phosphorescent fungi. It\'s beautiful — and something lives here.' },
    ],
  },
  coastal: {
    label: 'Coastal / Beach',
    encounters: [
      { name: 'Shipwreck', type: 'exploration', cr: '0', description: 'A recent shipwreck washes ashore. Survivors? Cargo? Both?' },
      { name: 'Sahuagin Raiders', type: 'combat', cr: '2-4', description: 'Sea devils emerge from the waves at dusk, raiding the shoreline.' },
      { name: 'Merfolk Envoy', type: 'social', cr: '0', description: 'A merfolk surfaces near shore with a message — or a plea for help.' },
      { name: 'Sea Hag', type: 'combat', cr: '2', description: 'A sea hag lurks in a coastal cave, preying on fishermen.' },
      { name: 'Pirate Landing', type: 'combat', cr: '2-5', description: 'A pirate crew rows ashore to bury treasure — or dig some up.' },
      { name: 'Tidal Cave', type: 'exploration', cr: '1', description: 'A cave revealed by low tide. In a few hours, the sea will reclaim it.' },
    ],
  },
};

/**
 * Generate a random encounter for the given terrain.
 * @param {string} terrain — key from ENCOUNTER_TABLES
 * @param {Object} options
 * @param {number} options.partyLevel — average party level (for filtering)
 * @param {string} options.tension — 'low' | 'medium' | 'high' (affects encounter type weighting)
 * @returns {Object} { name, type, cr, description, terrain, rollResult }
 */
export function generateRandomEncounter(terrain = 'road', options = {}) {
  const table = ENCOUNTER_TABLES[terrain] || ENCOUNTER_TABLES.road;
  const { tension = 'medium' } = options;

  // Weight by tension level
  let eligible = [...table.encounters];
  if (tension === 'low') {
    // Prefer social/exploration
    eligible = eligible.filter(e => e.type !== 'combat' || Math.random() < 0.3);
  } else if (tension === 'high') {
    // Prefer combat/hazard
    eligible = eligible.filter(e => e.type === 'combat' || e.type === 'hazard' || Math.random() < 0.3);
  }

  if (eligible.length === 0) eligible = table.encounters;
  const encounter = pick(eligible);
  const rollResult = d(100);

  return {
    ...encounter,
    terrain: table.label,
    rollResult,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Get all terrain types for UI selection.
 */
export function getTerrainTypes() {
  return Object.entries(ENCOUNTER_TABLES).map(([key, table]) => ({
    id: key,
    label: table.label,
    count: table.encounters.length,
  }));
}

export { ENCOUNTER_TABLES };
