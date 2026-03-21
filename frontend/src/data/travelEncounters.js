/**
 * @file travelEncounters.js
 * @description Random travel encounter tables, terrain-based encounter frequencies,
 *              and helper functions for generating road and wilderness events.
 *              Part of The Codex — D&D Companion travel system.
 * @module data/travelEncounters
 */

// ---------------------------------------------------------------------------
// ENCOUNTER FREQUENCY
// ---------------------------------------------------------------------------

/**
 * Base encounter chance per hex traveled, by terrain type.
 * nightModifier is added to the base chance when traveling at night (as a decimal).
 * @type {{ [terrain: string]: { baseChance: number, nightModifier: number, label: string } }}
 */
export const ENCOUNTER_FREQUENCY = {
  road: {
    label: "Road",
    baseChance: 0.10,
    nightModifier: 0.10,
    description: "Well-traveled paths — lower danger but not without risk.",
  },
  plains: {
    label: "Plains",
    baseChance: 0.15,
    nightModifier: 0.10,
    description: "Open grasslands offer little cover for predators or travelers.",
  },
  forest: {
    label: "Forest",
    baseChance: 0.20,
    nightModifier: 0.10,
    description: "Dense woodland teems with wildlife and hidden dangers.",
  },
  mountain: {
    label: "Mountain",
    baseChance: 0.20,
    nightModifier: 0.10,
    description: "Treacherous passes and high altitude bring unique hazards.",
  },
  swamp: {
    label: "Swamp",
    baseChance: 0.25,
    nightModifier: 0.10,
    description: "Fetid wetlands hide predators, disease, and ancient secrets.",
  },
  desert: {
    label: "Desert",
    baseChance: 0.15,
    nightModifier: 0.10,
    description: "Vast, sun-scorched wastes punish the unprepared.",
  },
  arctic: {
    label: "Arctic",
    baseChance: 0.15,
    nightModifier: 0.10,
    description: "Frozen tundra where cold itself is the greatest enemy.",
  },
  underdark: {
    label: "Underdark",
    baseChance: 0.30,
    nightModifier: 0.10,
    description: "Lightless tunnels filled with creatures of unfathomable danger.",
  },
};

// ---------------------------------------------------------------------------
// ENCOUNTER TYPES
// ---------------------------------------------------------------------------

/**
 * Broad encounter categories with global base weights and per-terrain overrides.
 * Weights are relative (not percentages) and are normalized at runtime.
 * @type {{ [type: string]: { label: string, baseWeight: number, description: string, terrainWeights: { [terrain: string]: number } } }}
 */
export const ENCOUNTER_TYPES = {
  combat: {
    label: "Combat",
    baseWeight: 40,
    description: "A hostile encounter requiring the party to fight or flee.",
    terrainWeights: {
      road: 30,
      plains: 35,
      forest: 45,
      mountain: 45,
      swamp: 50,
      desert: 40,
      arctic: 40,
      underdark: 55,
    },
  },
  social: {
    label: "Social",
    baseWeight: 25,
    description: "An NPC or creature interaction requiring diplomacy or roleplay.",
    terrainWeights: {
      road: 40,
      plains: 25,
      forest: 15,
      mountain: 20,
      swamp: 10,
      desert: 20,
      arctic: 10,
      underdark: 15,
    },
  },
  discovery: {
    label: "Discovery",
    baseWeight: 20,
    description: "The party finds something noteworthy — ruins, items, or lore.",
    terrainWeights: {
      road: 15,
      plains: 20,
      forest: 25,
      mountain: 20,
      swamp: 25,
      desert: 30,
      arctic: 25,
      underdark: 20,
    },
  },
  hazard: {
    label: "Hazard",
    baseWeight: 15,
    description: "An environmental or situational danger with no clear enemy.",
    terrainWeights: {
      road: 15,
      plains: 20,
      forest: 15,
      mountain: 15,
      swamp: 15,
      desert: 10,
      arctic: 25,
      underdark: 10,
    },
  },
};

// ---------------------------------------------------------------------------
// TRAVEL ENCOUNTERS BY TERRAIN
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} TravelEncounter
 * @property {string} id - Unique identifier for the encounter.
 * @property {string} name - Short display name.
 * @property {string} description - Narrative description of the encounter.
 * @property {string} type - Encounter type key (combat | social | discovery | hazard).
 * @property {{ min: number, max: number }} crRange - Suggested CR range for the encounter.
 * @property {boolean} hasLoot - Whether meaningful loot can be found.
 * @property {string[]} rpHooks - Roleplay and story hooks for the DM.
 */

/**
 * Per-terrain encounter tables. Each terrain contains 10 encounters.
 * @type {{ [terrain: string]: TravelEncounter[] }}
 */
export const TRAVEL_ENCOUNTERS_BY_TERRAIN = {
  road: [
    {
      id: "road_01",
      name: "Merchant Caravan",
      description:
        "A slow-moving line of covered wagons guarded by tired sellswords. The head merchant waves a cautious greeting and eyes the party's weapons.",
      type: "social",
      crRange: { min: 0, max: 2 },
      hasLoot: true,
      rpHooks: [
        "The merchant carries a sealed crate addressed to a notorious crime lord.",
        "One of the guards is a deserter the party may have heard about.",
        "The caravan is one wagon short — a wheel broke three miles back and a driver is still there alone.",
      ],
    },
    {
      id: "road_02",
      name: "Bandits",
      description:
        "Rough-looking figures step from the treeline, weapons drawn. Their leader calls out: 'Stand and deliver — your coin or your lives.'",
      type: "combat",
      crRange: { min: 1, max: 4 },
      hasLoot: true,
      rpHooks: [
        "The bandits are desperate villagers whose crops failed; their leader is ashamed.",
        "A wanted poster in the last town matches the bandit captain's description.",
        "The bandits are actually working for the local lord to 'tax' travelers covertly.",
      ],
    },
    {
      id: "road_03",
      name: "Patrol",
      description:
        "A detachment of soldiers in livery marches toward the party. They halt and demand to see travel papers or proof of identity.",
      type: "social",
      crRange: { min: 1, max: 3 },
      hasLoot: false,
      rpHooks: [
        "The patrol is hunting someone matching one party member's description.",
        "The patrol leader is corrupt and expects a 'toll' to pass unmolested.",
        "The soldiers are lost and their map is clearly outdated; they won't admit it.",
      ],
    },
    {
      id: "road_04",
      name: "Broken Wagon",
      description:
        "A cart sits at a precarious angle across the road, one wheel shattered. The driver curses and kicks the spokes in frustration.",
      type: "social",
      crRange: { min: 0, max: 0 },
      hasLoot: false,
      rpHooks: [
        "The cargo shifted and broke the wheel — it is heavy, valuable, and unattended.",
        "The driver is racing to deliver medicine to a dying lord before nightfall.",
        "The 'broken wagon' is a classic highwayman lure; archers hide in the ditch.",
      ],
    },
    {
      id: "road_05",
      name: "Pilgrim Group",
      description:
        "A cluster of devout travelers walks barefoot, singing a slow hymn. They carry candles that somehow stay lit despite the wind.",
      type: "social",
      crRange: { min: 0, max: 1 },
      hasLoot: false,
      rpHooks: [
        "The pilgrims are bound for a temple that was destroyed years ago — no one told them.",
        "One pilgrim is secretly a cleric of an opposing faith trying to steal a relic.",
        "The group asks the party to escort them through a 'cursed stretch' of road ahead.",
      ],
    },
    {
      id: "road_06",
      name: "Messenger",
      description:
        "A rider on a lathered horse nearly tramples the party, hauling back on the reins at the last moment. A sealed document pouch hangs at their side.",
      type: "social",
      crRange: { min: 0, max: 1 },
      hasLoot: false,
      rpHooks: [
        "The messenger is wounded and begs the party to deliver a letter to the nearest keep.",
        "The message pouch has been tampered with — the seal is a forgery.",
        "The rider is fleeing armed pursuers who appear on the road seconds later.",
      ],
    },
    {
      id: "road_07",
      name: "Escaped Prisoner",
      description:
        "A ragged figure stumbles from the bushes, manacles still attached to one wrist, eyes wide with fear or exhaustion.",
      type: "social",
      crRange: { min: 0, max: 1 },
      hasLoot: false,
      rpHooks: [
        "The prisoner claims to be innocent — their conviction was politically motivated.",
        "The prisoner is a dangerous murderer who spins a convincing sob story.",
        "A bounty hunter arrives moments later demanding the party hand the fugitive over.",
      ],
    },
    {
      id: "road_08",
      name: "Traveling Entertainer",
      description:
        "A colorful wagon draws near, bells jingling on the harness. A cheerful figure on the driver's bench juggles three knives without looking at them.",
      type: "social",
      crRange: { min: 0, max: 0 },
      hasLoot: false,
      rpHooks: [
        "The entertainer is a retired spy who trades gossip for coin.",
        "An illusion covers a wagon full of stolen goods the entertainer is fencing.",
        "The entertainer knows a bard's tale about a dungeon the party is headed toward.",
      ],
    },
    {
      id: "road_09",
      name: "Roadside Shrine",
      description:
        "A weathered stone shrine stands at a crossroads, draped in faded ribbons and dried flowers. Fresh offerings suggest recent visitors.",
      type: "discovery",
      crRange: { min: 0, max: 0 },
      hasLoot: true,
      rpHooks: [
        "The deity depicted has been defaced — the locals are afraid to say by whom.",
        "A small prayer scrawled on parchment describes a nearby hidden treasure.",
        "Touching the shrine grants a minor blessing — or awakens a guardian spirit.",
      ],
    },
    {
      id: "road_10",
      name: "Lost Child",
      description:
        "A small child sits on a milestone weeping, clutching a stuffed toy. They look up with tear-streaked cheeks as the party approaches.",
      type: "social",
      crRange: { min: 0, max: 0 },
      hasLoot: false,
      rpHooks: [
        "The child is a polymorphed hag testing the party's compassion.",
        "The child's parents were attacked by bandits a mile back and may still be alive.",
        "The child belongs to a noble family — returning them safely yields a reward.",
      ],
    },
  ],

  forest: [
    {
      id: "forest_01",
      name: "Wolves",
      description:
        "Low growls emerge from the undergrowth. Yellow eyes blink in the shadows as a pack circles the party, testing their nerve.",
      type: "combat",
      crRange: { min: 1, max: 3 },
      hasLoot: false,
      rpHooks: [
        "The wolves are unnaturally coordinated — a druid or ranger may be directing them.",
        "The pack is starving due to a disease killing game in the area.",
        "A wounded wolf pup trails behind the pack; it could become a companion.",
      ],
    },
    {
      id: "forest_02",
      name: "Goblin Ambush",
      description:
        "Ropes snap taut and crude nets drop from the canopy. Goblin laughter erupts from a dozen hiding spots above and around the trail.",
      type: "combat",
      crRange: { min: 1, max: 4 },
      hasLoot: true,
      rpHooks: [
        "The goblins are defending a nearby warren where their chief is being held prisoner by a hobgoblin.",
        "One goblin speaks Common and claims they were 'hired' to slow the party down.",
        "The ambush site contains loot from previous victims, including a map fragment.",
      ],
    },
    {
      id: "forest_03",
      name: "Fey Crossing",
      description:
        "A ring of perfect mushrooms glows faintly in a clearing. Music that shouldn't exist drifts through the trees, and the air smells of honey.",
      type: "discovery",
      crRange: { min: 3, max: 8 },
      hasLoot: true,
      rpHooks: [
        "Stepping inside the ring transports one party member to the Feywild temporarily.",
        "A pixie emerges demanding a gift in exchange for safe passage.",
        "The crossing is unstable and draws monsters from the Feywild each dawn.",
      ],
    },
    {
      id: "forest_04",
      name: "Abandoned Camp",
      description:
        "A cold campfire and scattered bedrolls — a camp recently evacuated in haste. A pot of stew still hangs over the ash.",
      type: "discovery",
      crRange: { min: 0, max: 2 },
      hasLoot: true,
      rpHooks: [
        "Tracks lead away in a panic toward a dark ravine nearby.",
        "A journal among the gear describes a treasure location, the last entry mid-sentence.",
        "The camp belongs to a rival adventuring party who may return angry.",
      ],
    },
    {
      id: "forest_05",
      name: "Ancient Tree",
      description:
        "A single tree of impossible age towers above the canopy. Its bark is carved with thousands of tiny faces, all wearing different expressions.",
      type: "discovery",
      crRange: { min: 0, max: 5 },
      hasLoot: false,
      rpHooks: [
        "The tree is a sleeping treant who wakes if someone carves their name in the bark.",
        "The carved faces are the souls of those who died in the forest and haven't moved on.",
        "Sap collected from the tree functions as a healing potion — once per visit.",
      ],
    },
    {
      id: "forest_06",
      name: "Hidden Cave",
      description:
        "Vines conceal a dark opening in a rocky hillside. Cool air breathes from within, carrying a faint metallic scent.",
      type: "discovery",
      crRange: { min: 2, max: 6 },
      hasLoot: true,
      rpHooks: [
        "The cave is a smuggler's cache currently being used to store stolen goods.",
        "Deep inside, drawings on the walls depict a battle that occurred centuries before the kingdom existed.",
        "A wounded creature has retreated inside to heal and will not attack unless cornered.",
      ],
    },
    {
      id: "forest_07",
      name: "Poacher's Trap",
      description:
        "A sharp snap — one party member triggers a hidden snare, or a great iron leg-trap nearly closes on a foot.",
      type: "hazard",
      crRange: { min: 0, max: 1 },
      hasLoot: false,
      rpHooks: [
        "The trap is set in a protected forest — the ranger warden will be furious if they find out.",
        "The trapped area conceals a dozen similar snares; careful searching reveals a pattern.",
        "The poacher watches from hiding and only approaches if the party seems nonthreatening.",
      ],
    },
    {
      id: "forest_08",
      name: "Druid Grove",
      description:
        "Standing stones form a perfect circle around a moss-covered altar. A robed figure kneels in quiet prayer and slowly turns as the party approaches.",
      type: "social",
      crRange: { min: 3, max: 7 },
      hasLoot: false,
      rpHooks: [
        "The druid is performing a ritual to hold back a spreading blight and needs assistance.",
        "The grove is on the edge of territory disputed between two factions; the druid wants it neutral.",
        "The druid offers to scry for the party in exchange for a favor involving a corrupted spring.",
      ],
    },
    {
      id: "forest_09",
      name: "Will-o'-Wisp",
      description:
        "Pale blue lights drift between the trunks, beckoning. A feeling of peaceful curiosity makes following them seem like a good idea.",
      type: "combat",
      crRange: { min: 2, max: 5 },
      hasLoot: false,
      rpHooks: [
        "The wisps are luring travelers to a bog where they feed on the dying.",
        "One wisp is the remnant of a murdered merchant who only wants its killer named.",
        "Following the wisps leads to a beautiful glade — but also directly into an enemy camp.",
      ],
    },
    {
      id: "forest_10",
      name: "Spider Web",
      description:
        "Thick white webbing stretches between the trees ahead, forming a near-invisible barrier. Cocooned shapes hang from the upper branches.",
      type: "combat",
      crRange: { min: 1, max: 5 },
      hasLoot: true,
      rpHooks: [
        "One of the cocooned shapes is still alive and conscious — it is a local dignitary.",
        "The webbing is a territorial marker for a giant spider whose young are nearby.",
        "Burning the web triggers a swarm attack, but also reveals a spider-guarded cache of loot.",
      ],
    },
  ],

  mountain: [
    {
      id: "mountain_01",
      name: "Rockslide",
      description:
        "A crack echoes above. Loose stones begin to rattle down the slope, followed by boulders gathering speed.",
      type: "hazard",
      crRange: { min: 0, max: 0 },
      hasLoot: false,
      rpHooks: [
        "The slide was deliberately triggered by someone watching from the ridge above.",
        "Debris blocks the only pass — it will take hours to clear without the right tools.",
        "A creature was buried by the slide and claws weakly from beneath the rubble.",
      ],
    },
    {
      id: "mountain_02",
      name: "Giant Eagle Nest",
      description:
        "Massive talon-marks scar the ledge, and an enormous nest of twisted timber perches on an outcrop above the trail.",
      type: "social",
      crRange: { min: 3, max: 6 },
      hasLoot: true,
      rpHooks: [
        "The eagles are intelligent and observe the party — they will speak if shown respect.",
        "Poachers have taken eggs from the nest; the parent eagles blame whoever passes.",
        "Shiny objects collected from dead travelers fill the nest — including a magical item.",
      ],
    },
    {
      id: "mountain_03",
      name: "Dwarf Miners",
      description:
        "The rhythmic clang of pickaxes carries from a fissure in the cliffside. A foreman emerges squinting into the daylight, wiping stone dust from her face.",
      type: "social",
      crRange: { min: 1, max: 3 },
      hasLoot: true,
      rpHooks: [
        "The miners broke into a sealed vault three days ago — something got out.",
        "The foreman needs a courier to carry assay results to their guild before a rival claim is filed.",
        "The mine breaches the territory of a creature that has been letting them work… until now.",
      ],
    },
    {
      id: "mountain_04",
      name: "Mountain Pass Blocked",
      description:
        "The path ahead is sealed — a combination of snowfall, fallen timber, and what appears to be deliberately placed boulders.",
      type: "hazard",
      crRange: { min: 0, max: 2 },
      hasLoot: false,
      rpHooks: [
        "A toll collector demands payment for knowledge of the alternate route.",
        "The blockage is new — whoever caused it may still be nearby.",
        "Clearing the pass disturbs a nest of creatures sheltering beneath the debris.",
      ],
    },
    {
      id: "mountain_05",
      name: "Yeti Tracks",
      description:
        "Enormous bipedal footprints in the snow, each as long as a forearm. Steam still rises from the deepest impressions.",
      type: "discovery",
      crRange: { min: 4, max: 9 },
      hasLoot: false,
      rpHooks: [
        "The tracks lead to a cave where something very large — and possibly sleeping — lives.",
        "The tracks circle the campsite the party plans to use, visiting it every night.",
        "A dead mountain goat lies nearby, its neck broken cleanly — not eaten.",
      ],
    },
    {
      id: "mountain_06",
      name: "Abandoned Mine",
      description:
        "Rotted timber framing a dark tunnel entrance, a collapsed ore cart visible just inside. A sign once hung above the opening — only one word remains legible: 'DANGER'.",
      type: "discovery",
      crRange: { min: 2, max: 7 },
      hasLoot: true,
      rpHooks: [
        "The mine was sealed after an 'incident' involving cultists in the lower levels.",
        "Cave-in risk is real; without proper equipment the tunnels may collapse on the party.",
        "A former miner's ghost haunts the entrance and will only let the party pass if they hear their story.",
      ],
    },
    {
      id: "mountain_07",
      name: "Wind Shrine",
      description:
        "Stone chimes hang in an elaborate frame at the peak of a ridge, singing in harmonics no natural wind should produce.",
      type: "discovery",
      crRange: { min: 0, max: 4 },
      hasLoot: false,
      rpHooks: [
        "The chimes form a code; deciphering it reveals the location of a nearby cache.",
        "An air elemental is bound to the shrine and grants a boon to those who listen without disturbing it.",
        "The shrine marks the burial site of a wind mage; disturbing it releases a curse.",
      ],
    },
    {
      id: "mountain_08",
      name: "Cliff Bridge",
      description:
        "A rope-and-plank bridge spans a yawning chasm — most planks intact, some clearly new, others missing entirely.",
      type: "hazard",
      crRange: { min: 0, max: 3 },
      hasLoot: false,
      rpHooks: [
        "A bridge toll keeper lives in a tiny hut on the far side and controls a release mechanism.",
        "Someone is cutting the ropes from the other end while the party crosses.",
        "A creature nests beneath the bridge and views crossings as trespass.",
      ],
    },
    {
      id: "mountain_09",
      name: "Cave Entrance",
      description:
        "A broad, dark opening in the mountainside breathes cold air in rhythmic pulses, as if the mountain itself is alive.",
      type: "discovery",
      crRange: { min: 3, max: 10 },
      hasLoot: true,
      rpHooks: [
        "The cave is listed on no map the party carries — it may be a newly revealed dragon lair.",
        "Faded chalk marks near the entrance indicate an adventuring party entered recently.",
        "The rhythmic breathing is caused by a pressure system — but a creature uses the noise as cover.",
      ],
    },
    {
      id: "mountain_10",
      name: "Mountain Spring",
      description:
        "Crystal-clear water bubbles from a crack in the stone, pooling in a natural basin ringed with unexpected greenery.",
      type: "discovery",
      crRange: { min: 0, max: 2 },
      hasLoot: false,
      rpHooks: [
        "The water has minor healing properties — and something has been contaminating it upstream.",
        "A territorial creature considers the spring its territory and is hidden, watching.",
        "Pilgrims believe the spring is sacred; interfering with it could have political consequences.",
      ],
    },
  ],

  desert: [
    {
      id: "desert_01",
      name: "Sandstorm",
      description:
        "A wall of amber and brown rises on the horizon, moving faster than any natural wind should allow. Within minutes, visibility drops to nothing.",
      type: "hazard",
      crRange: { min: 0, max: 0 },
      hasLoot: false,
      rpHooks: [
        "Within the storm, a figure walks calmly — immune to the sand and seemingly surprised to see others.",
        "Something is sheltering in the only large rock formation nearby and won't share willingly.",
        "The storm reveals a previously buried structure as it scours the dunes clean.",
      ],
    },
    {
      id: "desert_02",
      name: "Oasis",
      description:
        "Palm trees and a glittering pool appear ahead — either the most welcome sight imaginable or a hallucination born of heat and thirst.",
      type: "discovery",
      crRange: { min: 1, max: 6 },
      hasLoot: false,
      rpHooks: [
        "The oasis is real but controlled by a mercenary company that charges for use.",
        "The oasis is a convincing mirage — a lure created by a creature that feeds on hope.",
        "The water is real but the trees are awakened plants protecting a buried vault.",
      ],
    },
    {
      id: "desert_03",
      name: "Buried Ruins",
      description:
        "A recent windstorm has scoured sand from the tops of stone columns, revealing the crown of a buried city below.",
      type: "discovery",
      crRange: { min: 2, max: 8 },
      hasLoot: true,
      rpHooks: [
        "The ruins are partially accessible through a collapsed roof — and something still lives inside.",
        "Scholars from a distant city are already excavating the site and are not pleased to see competition.",
        "Inscriptions on the columns hint this city was destroyed not by war but by its own magic.",
      ],
    },
    {
      id: "desert_04",
      name: "Scorpion Swarm",
      description:
        "The sand suddenly moves — hundreds of scorpions boil from the ground around the party's feet, agitated by the vibration of footsteps.",
      type: "combat",
      crRange: { min: 1, max: 4 },
      hasLoot: false,
      rpHooks: [
        "The swarm was driven out of a nest by something larger that now approaches from below.",
        "A druid is nearby who can call off the swarm — for a price.",
        "Among the scorpions is one enormous specimen that appears to be directing the others.",
      ],
    },
    {
      id: "desert_05",
      name: "Nomad Traders",
      description:
        "A line of laden camels materializes from the heat shimmer. Robed riders sit upright, utterly at ease in the merciless heat.",
      type: "social",
      crRange: { min: 1, max: 3 },
      hasLoot: true,
      rpHooks: [
        "The traders carry an item they don't know is extraordinarily valuable or dangerous.",
        "They are fleeing something and will trade nearly anything for an escort.",
        "The nomads know the desert intimately and will share directions — if the party earns their trust.",
      ],
    },
    {
      id: "desert_06",
      name: "Ancient Monument",
      description:
        "A colossal stone face half-buried in the dunes stares skyward, its expression ambiguous — triumph or anguish, depending on the light.",
      type: "discovery",
      crRange: { min: 0, max: 5 },
      hasLoot: true,
      rpHooks: [
        "The monument is a marker for a pharaoh's tomb directly beneath it.",
        "At specific times of day, shadows cast by the face form a map.",
        "A cult uses the monument for regular rituals — members are due to arrive soon.",
      ],
    },
    {
      id: "desert_07",
      name: "Quicksand",
      description:
        "What appears to be a firm sandy floor gives way without warning. One moment solid, the next — sinking.",
      type: "hazard",
      crRange: { min: 0, max: 0 },
      hasLoot: false,
      rpHooks: [
        "A previous victim is partially visible, still gripping a satchel full of documents.",
        "The quicksand conceals the entrance to an underground tunnel system.",
        "Locals know exactly where every quicksand pit is — and someone removed the warning markers.",
      ],
    },
    {
      id: "desert_08",
      name: "Desert Predator",
      description:
        "A ripple in the sand tracks the party's movement from a distance — something large moves just below the surface.",
      type: "combat",
      crRange: { min: 3, max: 9 },
      hasLoot: false,
      rpHooks: [
        "The creature is protecting young nearby and will withdraw if the party moves away.",
        "A bounty on the creature exists — the hide alone is worth significant gold.",
        "The predator is trained; its handler waits at a distance to see if the party is worth robbing.",
      ],
    },
    {
      id: "desert_09",
      name: "Heat Shimmer",
      description:
        "The horizon bends and ripples. Shapes form in the distortion — buildings, people, water — then dissolve. One shape does not dissolve.",
      type: "discovery",
      crRange: { min: 2, max: 6 },
      hasLoot: false,
      rpHooks: [
        "The persistent shape is a ghost bound to this stretch of desert, confused and seeking release.",
        "It is a mirage of a possible future — a vision with cryptic relevance to a current quest.",
        "The shimmer conceals a planar thin spot; with the right spell it could become a shortcut.",
      ],
    },
    {
      id: "desert_10",
      name: "Caravan Wreckage",
      description:
        "Smashed wagons and scattered cargo litter the sand. Buzzards circle overhead. Whatever happened was recent — the wood still splinters under pressure.",
      type: "discovery",
      crRange: { min: 2, max: 7 },
      hasLoot: true,
      rpHooks: [
        "Survivors are hiding beneath a wagon, too frightened to call out.",
        "The cargo manifest describes items that should not exist and have not been taken.",
        "Tracks indicate the attackers came from below, not across the desert.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// TIME OF DAY
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} TimeOfDayEntry
 * @property {string} id - Unique key for this time period.
 * @property {string} label - Display name.
 * @property {string} description - Atmospheric description of the time period.
 * @property {"full"|"good"|"moderate"|"poor"|"dim"|"none"} visibility - Visibility quality.
 * @property {number} encounterModifier - Added to base encounter chance (as a decimal).
 * @property {boolean} isNight - Whether the night modifier from ENCOUNTER_FREQUENCY applies.
 */

/**
 * Time-of-day periods with visibility and encounter impact.
 * @type {{ [id: string]: TimeOfDayEntry }}
 */
export const TIME_OF_DAY = {
  dawn: {
    id: "dawn",
    label: "Dawn",
    description:
      "The sky pales at the horizon, birds wake, and mist clings to low ground. Creatures of the night retreat while day hunters stir.",
    visibility: "moderate",
    encounterModifier: 0.05,
    isNight: false,
  },
  morning: {
    id: "morning",
    label: "Morning",
    description:
      "Full daylight brings warmth and activity. The safest hours for travel on most roads.",
    visibility: "full",
    encounterModifier: 0,
    isNight: false,
  },
  midday: {
    id: "midday",
    label: "Midday",
    description:
      "The sun stands high and shadows shrink. Heat can be a hazard in open terrain; most ambush predators rest.",
    visibility: "full",
    encounterModifier: -0.05,
    isNight: false,
  },
  afternoon: {
    id: "afternoon",
    label: "Afternoon",
    description:
      "The day cools and activity resumes. A good time to push for the next waypoint before darkness falls.",
    visibility: "good",
    encounterModifier: 0,
    isNight: false,
  },
  dusk: {
    id: "dusk",
    label: "Dusk",
    description:
      "The light fails quickly. Shapes become uncertain, nocturnal creatures begin to move, and sound carries strangely in the cooling air.",
    visibility: "dim",
    encounterModifier: 0.05,
    isNight: false,
  },
  night: {
    id: "night",
    label: "Night",
    description:
      "Stars and moon light the way, or do not. Most civilized travelers are camped; those on the road are desperate or dangerous.",
    visibility: "poor",
    encounterModifier: 0.10,
    isNight: true,
  },
  midnight: {
    id: "midnight",
    label: "Midnight",
    description:
      "The deepest dark. Predators are at their most active. Sound is magnified. The rules of the day do not apply here.",
    visibility: "none",
    encounterModifier: 0.15,
    isNight: true,
  },
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Calculates the encounter chance for a given terrain and time of day.
 * Returns a value between 0 and 1 representing the probability of an encounter
 * occurring when traveling through one hex.
 *
 * @param {string} terrain - Terrain key from ENCOUNTER_FREQUENCY.
 * @param {string} timeOfDay - Time-of-day key from TIME_OF_DAY.
 * @returns {number} Encounter probability (0–1), clamped to a minimum of 0.
 */
export function rollEncounterChance(terrain, timeOfDay) {
  const terrainData = ENCOUNTER_FREQUENCY[terrain];
  if (!terrainData) {
    console.warn(`rollEncounterChance: unknown terrain "${terrain}". Defaulting to plains.`);
  }
  const freq = terrainData ?? ENCOUNTER_FREQUENCY.plains;

  const timeData = TIME_OF_DAY[timeOfDay];
  if (!timeData) {
    console.warn(`rollEncounterChance: unknown timeOfDay "${timeOfDay}". Defaulting to morning.`);
  }
  const tod = timeData ?? TIME_OF_DAY.morning;

  let chance = freq.baseChance + tod.encounterModifier;
  if (tod.isNight) {
    chance += freq.nightModifier;
  }

  return Math.max(0, Math.min(1, chance));
}

/**
 * Returns all encounters for a given terrain, or an empty array if the terrain
 * has no entries defined.
 *
 * @param {string} terrain - Terrain key from TRAVEL_ENCOUNTERS_BY_TERRAIN.
 * @returns {TravelEncounter[]}
 */
export function getEncountersByTerrain(terrain) {
  return TRAVEL_ENCOUNTERS_BY_TERRAIN[terrain] ?? [];
}

/**
 * Selects a weighted random encounter type for the given terrain.
 * Uses terrainWeights from ENCOUNTER_TYPES, falling back to baseWeight.
 *
 * @param {string} terrain - Terrain key.
 * @returns {string} Encounter type key (e.g. "combat", "social").
 */
function _weightedEncounterType(terrain) {
  const entries = Object.entries(ENCOUNTER_TYPES);
  const weights = entries.map(([key, val]) => ({
    key,
    weight: val.terrainWeights[terrain] ?? val.baseWeight,
  }));

  const total = weights.reduce((sum, w) => sum + w.weight, 0);
  let roll = Math.random() * total;

  for (const { key, weight } of weights) {
    roll -= weight;
    if (roll <= 0) return key;
  }
  return weights[weights.length - 1].key;
}

/**
 * Generates a single travel encounter appropriate for the terrain, party level,
 * and time of day.
 *
 * - First checks whether an encounter occurs at all using rollEncounterChance.
 * - If an encounter occurs, filters the terrain table by CR suitability and
 *   preferred encounter type, then selects randomly from viable candidates.
 * - Falls back to the full terrain table if no filtered match exists.
 *
 * @param {string} terrain - Terrain key.
 * @param {number} partyLevel - Average party level (1–20), used to filter by CR.
 * @param {string} timeOfDay - Time-of-day key.
 * @returns {{ encountered: boolean, encounter: TravelEncounter|null, encounterChance: number }}
 */
export function generateTravelEncounter(terrain, partyLevel, timeOfDay) {
  const encounterChance = rollEncounterChance(terrain, timeOfDay);
  const roll = Math.random();

  if (roll > encounterChance) {
    return { encountered: false, encounter: null, encounterChance };
  }

  const allEncounters = getEncountersByTerrain(terrain);
  if (allEncounters.length === 0) {
    return { encountered: true, encounter: null, encounterChance };
  }

  // Determine preferred encounter type weighted by terrain
  const preferredType = _weightedEncounterType(terrain);

  // Build a CR-appropriate pool (party level ±3, minimum CR 0)
  const minCR = Math.max(0, partyLevel - 3);
  const maxCR = partyLevel + 3;

  const crFiltered = allEncounters.filter(
    (e) => e.crRange.min <= maxCR && e.crRange.max >= minCR
  );

  const pool = crFiltered.length > 0 ? crFiltered : allEncounters;

  // Prefer encounters matching the weighted type
  const typeFiltered = pool.filter((e) => e.type === preferredType);
  const finalPool = typeFiltered.length > 0 ? typeFiltered : pool;

  const encounter = finalPool[Math.floor(Math.random() * finalPool.length)];

  return { encountered: true, encounter, encounterChance };
}

/**
 * Rolls a random time of day, weighted toward daytime periods.
 * dawn:10%, morning:20%, midday:15%, afternoon:20%, dusk:15%, night:12%, midnight:8%
 *
 * @returns {TimeOfDayEntry}
 */
export function rollTimeOfDay() {
  const table = [
    { id: "dawn", weight: 10 },
    { id: "morning", weight: 20 },
    { id: "midday", weight: 15 },
    { id: "afternoon", weight: 20 },
    { id: "dusk", weight: 15 },
    { id: "night", weight: 12 },
    { id: "midnight", weight: 8 },
  ];

  const total = table.reduce((s, t) => s + t.weight, 0);
  let roll = Math.random() * total;

  for (const entry of table) {
    roll -= entry.weight;
    if (roll <= 0) return TIME_OF_DAY[entry.id];
  }
  return TIME_OF_DAY.morning;
}

/**
 * Simulates a full day of travel through a single terrain type, producing a
 * summary of encounter rolls across multiple hexes and time periods.
 *
 * Assumes 4 hexes of travel per day across morning, midday, afternoon, and dusk.
 *
 * @param {string} terrain - Terrain key.
 * @param {number} partyLevel - Average party level (1–20).
 * @returns {{
 *   terrain: string,
 *   terrainLabel: string,
 *   partyLevel: number,
 *   hexes: Array<{
 *     hex: number,
 *     timeOfDay: string,
 *     timeLabel: string,
 *     encounterChance: number,
 *     encountered: boolean,
 *     encounter: TravelEncounter|null
 *   }>,
 *   totalEncounters: number,
 *   summary: string
 * }}
 */
export function generateDayOfTravel(terrain, partyLevel) {
  const daySegments = ["morning", "midday", "afternoon", "dusk"];
  const terrainData = ENCOUNTER_FREQUENCY[terrain] ?? ENCOUNTER_FREQUENCY.plains;

  const hexes = daySegments.map((tod, index) => {
    const result = generateTravelEncounter(terrain, partyLevel, tod);
    return {
      hex: index + 1,
      timeOfDay: tod,
      timeLabel: TIME_OF_DAY[tod]?.label ?? tod,
      encounterChance: result.encounterChance,
      encountered: result.encountered,
      encounter: result.encounter,
    };
  });

  const totalEncounters = hexes.filter((h) => h.encountered).length;

  const summary =
    totalEncounters === 0
      ? `A quiet day through ${terrainData.label} terrain — no encounters.`
      : `${totalEncounters} encounter${totalEncounters > 1 ? "s" : ""} across ${hexes.length} hexes of ${terrainData.label} terrain.`;

  return {
    terrain,
    terrainLabel: terrainData.label,
    partyLevel,
    hexes,
    totalEncounters,
    summary,
  };
}
