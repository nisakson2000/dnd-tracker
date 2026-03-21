/**
 * sideQuestGenerator.js
 *
 * Roadmap Items Covered:
 *   - #176: Side quest generator
 *
 * Provides data tables and helper functions for procedurally generating
 * D&D 5e side quests. No React dependencies — pure data and logic.
 *
 * Usage:
 *   import { generateSideQuest, generateQuestBundle } from './sideQuestGenerator';
 *   const quest = generateSideQuest(5, 'urban');
 *   const bundle = generateQuestBundle(3, 5, 'wilderness');
 */

// ---------------------------------------------------------------------------
// QUEST_HOOKS
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} QuestHook
 * @property {string} type - Unique identifier for the hook type
 * @property {string} name - Display name
 * @property {string} descriptionTemplate - Narrative template with {npc}, {location}, {item}, {creature} placeholders
 * @property {number} difficultyMin - Minimum difficulty on 1-4 scale
 * @property {number} difficultyMax - Maximum difficulty on 1-4 scale
 * @property {number} sessionsMin - Minimum estimated sessions
 * @property {number} sessionsMax - Maximum estimated sessions
 */

export const QUEST_HOOKS = [
  {
    type: 'missing_person',
    name: 'Missing Person',
    descriptionTemplate:
      '{npc} has vanished without a trace near {location}. Locals fear foul play, but no one dares investigate.',
    difficultyMin: 1,
    difficultyMax: 3,
    sessionsMin: 1,
    sessionsMax: 2,
  },
  {
    type: 'stolen_goods',
    name: 'Stolen Goods',
    descriptionTemplate:
      '{npc} claims their prized {item} was stolen and was last spotted heading toward {location}. They offer a handsome reward for its return.',
    difficultyMin: 1,
    difficultyMax: 2,
    sessionsMin: 1,
    sessionsMax: 1,
  },
  {
    type: 'monster_bounty',
    name: 'Monster Bounty',
    descriptionTemplate:
      'A {creature} has been terrorizing the roads near {location}. {npc} is posting a bounty for proof of its defeat.',
    difficultyMin: 1,
    difficultyMax: 4,
    sessionsMin: 1,
    sessionsMax: 2,
  },
  {
    type: 'haunted_location',
    name: 'Haunted Location',
    descriptionTemplate:
      '{location} is said to be cursed — strange sounds, disappearing livestock, and ghostly lights have driven {npc} to seek outside help.',
    difficultyMin: 2,
    difficultyMax: 4,
    sessionsMin: 1,
    sessionsMax: 2,
  },
  {
    type: 'escort_mission',
    name: 'Escort Mission',
    descriptionTemplate:
      '{npc} must reach {location} safely and is willing to pay well for capable escorts. The route is anything but safe.',
    difficultyMin: 1,
    difficultyMax: 3,
    sessionsMin: 1,
    sessionsMax: 2,
  },
  {
    type: 'delivery',
    name: 'Delivery',
    descriptionTemplate:
      '{npc} needs a sealed package — containing the mysterious {item} — delivered to {location} before the next full moon, no questions asked.',
    difficultyMin: 1,
    difficultyMax: 2,
    sessionsMin: 1,
    sessionsMax: 1,
  },
  {
    type: 'investigation',
    name: 'Investigation',
    descriptionTemplate:
      'A series of strange events at {location} has {npc} baffled. They need sharp minds to uncover what is really going on.',
    difficultyMin: 2,
    difficultyMax: 3,
    sessionsMin: 1,
    sessionsMax: 2,
  },
  {
    type: 'tournament',
    name: 'Tournament',
    descriptionTemplate:
      'A grand competition is being held at {location}. {npc} enters the party — willingly or otherwise — to compete for glory and the legendary {item}.',
    difficultyMin: 2,
    difficultyMax: 4,
    sessionsMin: 1,
    sessionsMax: 2,
  },
  {
    type: 'rescue',
    name: 'Rescue',
    descriptionTemplate:
      '{npc} has been taken captive and is being held somewhere within {location}. Their family begs the party to bring them home.',
    difficultyMin: 2,
    difficultyMax: 4,
    sessionsMin: 1,
    sessionsMax: 3,
  },
  {
    type: 'sabotage',
    name: 'Sabotage',
    descriptionTemplate:
      '{npc} needs the {item} at {location} destroyed or disabled before it falls into the wrong hands — discretion is essential.',
    difficultyMin: 2,
    difficultyMax: 4,
    sessionsMin: 1,
    sessionsMax: 2,
  },
  {
    type: 'diplomacy',
    name: 'Diplomacy',
    descriptionTemplate:
      'Tensions between factions at {location} are about to boil over. {npc} asks the party to broker peace before blood is shed.',
    difficultyMin: 2,
    difficultyMax: 3,
    sessionsMin: 1,
    sessionsMax: 2,
  },
  {
    type: 'exploration',
    name: 'Exploration',
    descriptionTemplate:
      '{npc} has a hand-drawn map pointing to something extraordinary hidden deep within {location}. The {item} awaits whoever is brave enough.',
    difficultyMin: 1,
    difficultyMax: 4,
    sessionsMin: 1,
    sessionsMax: 3,
  },
  {
    type: 'heist',
    name: 'Heist',
    descriptionTemplate:
      '{npc} needs the {item} stolen from a heavily guarded vault inside {location}. Getting caught is not an option.',
    difficultyMin: 3,
    difficultyMax: 4,
    sessionsMin: 1,
    sessionsMax: 2,
  },
  {
    type: 'protection',
    name: 'Protection',
    descriptionTemplate:
      '{npc} and the priceless {item} are in danger at {location}. The party must keep both safe from those who would take them by force.',
    difficultyMin: 1,
    difficultyMax: 3,
    sessionsMin: 1,
    sessionsMax: 2,
  },
  {
    type: 'revenge',
    name: 'Revenge',
    descriptionTemplate:
      '{npc} was wronged by someone who fled to {location}. They want justice — or vengeance — and are willing to pay to see it done.',
    difficultyMin: 2,
    difficultyMax: 4,
    sessionsMin: 1,
    sessionsMax: 2,
  },
];

// ---------------------------------------------------------------------------
// QUEST_GOALS
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} QuestGoal
 * @property {string} id - Unique identifier
 * @property {string} label - Short goal label
 * @property {string} description - Full goal description
 */

/**
 * Per-hook goal variants (2-3 per hook type).
 * @type {Record<string, QuestGoal[]>}
 */
export const QUEST_GOALS = {
  missing_person: [
    {
      id: 'mp_find_alive',
      label: 'Find Alive',
      description: 'Locate the missing individual and return them unharmed.',
    },
    {
      id: 'mp_find_remains',
      label: 'Find Remains',
      description: 'Discover what happened to the person and recover their remains for a proper burial.',
    },
    {
      id: 'mp_left_voluntarily',
      label: 'Discover the Truth',
      description: 'Uncover that the missing person staged their disappearance — and decide what to do about it.',
    },
  ],
  stolen_goods: [
    {
      id: 'sg_retrieve_item',
      label: 'Retrieve the Item',
      description: 'Track down and return the stolen property to its rightful owner.',
    },
    {
      id: 'sg_catch_thief',
      label: 'Catch the Thief',
      description: 'Bring the thief to justice, with or without recovering the stolen goods.',
    },
    {
      id: 'sg_uncover_network',
      label: 'Uncover the Network',
      description: 'Follow the trail of the stolen item back to a larger smuggling or theft ring.',
    },
  ],
  monster_bounty: [
    {
      id: 'mb_kill_creature',
      label: 'Slay the Creature',
      description: 'Hunt down and kill the monster terrorizing the area.',
    },
    {
      id: 'mb_drive_off',
      label: 'Drive It Off',
      description: 'Scare or drive the creature away without necessarily killing it.',
    },
    {
      id: 'mb_capture_alive',
      label: 'Capture Alive',
      description: 'Subdue and capture the creature alive for a scholar, noble, or arena master.',
    },
  ],
  haunted_location: [
    {
      id: 'hl_exorcise_spirit',
      label: 'Exorcise the Spirit',
      description: 'Identify and permanently banish the haunting presence from the location.',
    },
    {
      id: 'hl_uncover_cause',
      label: 'Uncover the Cause',
      description: 'Investigate and reveal the tragic event or curse responsible for the haunting.',
    },
    {
      id: 'hl_recover_relic',
      label: 'Recover a Relic',
      description: 'Retrieve a cursed object from within the haunted site to end its influence.',
    },
  ],
  escort_mission: [
    {
      id: 'em_safe_delivery',
      label: 'Safe Delivery',
      description: 'Escort the client to their destination without incident.',
    },
    {
      id: 'em_survive_ambush',
      label: 'Survive the Ambush',
      description: 'Protect the client through a planned ambush by enemies who knew they were coming.',
    },
    {
      id: 'em_uncover_motive',
      label: 'Uncover the Motive',
      description: "Discover why the client's enemies want them dead before it is too late.",
    },
  ],
  delivery: [
    {
      id: 'dv_deliver_intact',
      label: 'Deliver Intact',
      description: 'Get the package to its destination without opening it.',
    },
    {
      id: 'dv_deliver_secretly',
      label: 'Deliver Secretly',
      description: 'Complete the delivery while evading parties who are tracking the package.',
    },
    {
      id: 'dv_discover_contents',
      label: 'Discover the Contents',
      description: 'Investigate what is really inside the package and decide whether to complete the delivery.',
    },
  ],
  investigation: [
    {
      id: 'iv_identify_culprit',
      label: 'Identify the Culprit',
      description: 'Gather evidence and name the person or entity responsible for the strange events.',
    },
    {
      id: 'iv_prevent_event',
      label: 'Prevent the Next Event',
      description: 'Act on gathered clues to stop whatever terrible event is about to unfold.',
    },
    {
      id: 'iv_expose_cover_up',
      label: 'Expose the Cover-Up',
      description: 'Reveal that local authorities already know the truth and are suppressing it.',
    },
  ],
  tournament: [
    {
      id: 'tn_win_competition',
      label: 'Win the Competition',
      description: 'Compete and claim victory in the tournament through skill and cunning.',
    },
    {
      id: 'tn_expose_cheating',
      label: 'Expose Cheating',
      description: 'Discover that the tournament is rigged and expose the scheme mid-event.',
    },
    {
      id: 'tn_protect_competitor',
      label: 'Protect a Competitor',
      description: "Keep a specific participant safe from threats aimed at removing them from the competition.",
    },
  ],
  rescue: [
    {
      id: 'rc_free_captive',
      label: 'Free the Captive',
      description: 'Infiltrate or storm the location and bring the captive home safely.',
    },
    {
      id: 'rc_negotiate_release',
      label: 'Negotiate Release',
      description: "Broker a deal with the captors to secure the prisoner's freedom without violence.",
    },
    {
      id: 'rc_discover_betrayal',
      label: 'Discover the Betrayal',
      description: "Uncover that the captive's own allies handed them over willingly.",
    },
  ],
  sabotage: [
    {
      id: 'sb_destroy_target',
      label: 'Destroy the Target',
      description: 'Obliterate the objective completely and escape without being identified.',
    },
    {
      id: 'sb_disable_quietly',
      label: 'Disable Quietly',
      description: 'Sabotage the target so it appears accidental, leaving no trace of interference.',
    },
    {
      id: 'sb_steal_instead',
      label: 'Steal Instead',
      description: 'Rather than destroy the target, bring it back — someone wants it for themselves.',
    },
  ],
  diplomacy: [
    {
      id: 'dp_broker_truce',
      label: 'Broker a Truce',
      description: 'Negotiate a ceasefire between two hostile factions before open conflict erupts.',
    },
    {
      id: 'dp_expose_instigator',
      label: 'Expose the Instigator',
      description: 'Discover that a third party is deliberately stoking tensions for their own gain.',
    },
    {
      id: 'dp_forge_alliance',
      label: 'Forge an Alliance',
      description: 'Go beyond a truce and unite the factions against a common external threat.',
    },
  ],
  exploration: [
    {
      id: 'ex_reach_destination',
      label: 'Reach the Destination',
      description: 'Navigate hazards and chart the way to the location marked on the map.',
    },
    {
      id: 'ex_recover_treasure',
      label: 'Recover the Treasure',
      description: 'Claim whatever prize — object, knowledge, or power — waits at the journey\'s end.',
    },
    {
      id: 'ex_map_the_region',
      label: 'Map the Region',
      description: 'Create a detailed map of the unexplored area for a guild, ruler, or scholar.',
    },
  ],
  heist: [
    {
      id: 'hs_steal_clean',
      label: 'Steal Clean',
      description: 'Extract the target without anyone knowing it is gone until long after the party has fled.',
    },
    {
      id: 'hs_plant_evidence',
      label: 'Plant Evidence',
      description: 'Steal the item and frame a rival in the process.',
    },
    {
      id: 'hs_expose_vault',
      label: 'Expose the Vault',
      description: 'Reveal the illegal contents of the vault to the public rather than stealing for personal gain.',
    },
  ],
  protection: [
    {
      id: 'pt_repel_attackers',
      label: 'Repel Attackers',
      description: 'Defend the person or object against a sustained assault.',
    },
    {
      id: 'pt_identify_threat',
      label: 'Identify the Threat',
      description: 'Figure out who is behind the attacks before the next wave arrives.',
    },
    {
      id: 'pt_relocate_safely',
      label: 'Relocate Safely',
      description: 'Move the protected person or object to a more secure location without being intercepted.',
    },
  ],
  revenge: [
    {
      id: 'rv_deliver_justice',
      label: 'Deliver Justice',
      description: 'Bring the wrongdoer before a legitimate authority to face consequences.',
    },
    {
      id: 'rv_exact_vengeance',
      label: 'Exact Vengeance',
      description: "Carry out the client's retribution directly, with no legal niceties.",
    },
    {
      id: 'rv_uncover_backstory',
      label: 'Uncover the Backstory',
      description: 'Discover the full context of the grudge — which may complicate who the real villain is.',
    },
  ],
};

// ---------------------------------------------------------------------------
// QUEST_TWISTS
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} QuestTwist
 * @property {string} id - Unique identifier
 * @property {string} label - Short twist label
 * @property {string} description - Full description of the twist
 */

/** @type {QuestTwist[]} */
export const QUEST_TWISTS = [
  {
    id: 'sympathetic_villain',
    label: 'The Villain Is Sympathetic',
    description:
      'The antagonist has understandable — even noble — reasons for their actions. Defeating them is not so clear-cut.',
  },
  {
    id: 'lying_quest_giver',
    label: 'The Quest Giver Is Lying',
    description:
      'The person who hired the party has withheld crucial information or has entirely fabricated key details to manipulate them.',
  },
  {
    id: 'its_a_trap',
    label: "It's a Trap",
    description:
      'The quest itself is bait — someone wanted the party in this specific place at this specific time.',
  },
  {
    id: 'time_limit',
    label: 'There Is a Time Limit',
    description:
      'The party discovers a hard deadline they were never told about. Failure to act fast enough means catastrophe.',
  },
  {
    id: 'real_threat',
    label: 'The Real Threat Is Something Else',
    description:
      'The apparent danger is a symptom. The true threat is lurking in the background, far more serious than originally presented.',
  },
  {
    id: 'two_factions',
    label: 'Two Factions Want Opposite Outcomes',
    description:
      'Competing groups each approach the party with conflicting demands, and satisfying one means betraying the other.',
  },
  {
    id: 'target_refuses',
    label: "The Target Doesn't Want to Be Saved",
    description:
      'The person the party is meant to rescue, protect, or recover actively refuses their help — and has reasons for it.',
  },
  {
    id: 'cursed_reward',
    label: 'The Reward Is Cursed',
    description:
      'The promised payment — gold, item, or title — carries a hidden curse or consequence that only manifests after it is accepted.',
  },
  {
    id: 'already_solved_badly',
    label: "It's Already Been Solved (Badly)",
    description:
      'Someone else attempted to resolve the quest before the party arrived. They succeeded, but the solution created worse problems.',
  },
  {
    id: 'ally_betrays',
    label: 'An Ally Betrays the Party',
    description:
      'A trusted companion, contact, or fellow traveler reveals they have been working against the party all along.',
  },
  {
    id: 'sacrifice_required',
    label: 'The Solution Requires Sacrifice',
    description:
      'The only way to truly resolve the quest demands a meaningful cost — something precious must be given up.',
  },
  {
    id: 'recurring_problem',
    label: 'The Problem Is Recurring',
    description:
      'Whatever the party solves will return. The root cause is cyclical — a curse, a prophecy, or a systemic issue — and this is just one iteration.',
  },
];

// ---------------------------------------------------------------------------
// QUEST_REWARDS
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} RewardEntry
 * @property {string} id
 * @property {string} label
 * @property {string} goldRange
 * @property {number} goldMin
 * @property {number} goldMax
 * @property {string} itemRarity - Common | Uncommon | Rare | Very Rare
 * @property {number} xpSuggestion
 * @property {string[]} exampleLoot
 */

/**
 * Reward tables organized by difficulty tier (1-4).
 * @type {Record<number, RewardEntry[]>}
 */
export const QUEST_REWARDS = {
  1: [
    {
      id: 't1_coin_pouch',
      label: 'Coin Pouch',
      goldRange: '10–50 gp',
      goldMin: 10,
      goldMax: 50,
      itemRarity: 'Common',
      xpSuggestion: 100,
      exampleLoot: ['Potion of Healing', 'Torch bundle', 'Simple weapon', 'Rations (1 week)'],
    },
    {
      id: 't1_small_bounty',
      label: 'Small Bounty',
      goldRange: '50–100 gp',
      goldMin: 50,
      goldMax: 100,
      itemRarity: 'Common',
      xpSuggestion: 200,
      exampleLoot: ['Common magic trinket', 'Healer\'s kit', 'Fine clothing', 'Riding horse'],
    },
  ],
  2: [
    {
      id: 't2_guild_payment',
      label: 'Guild Payment',
      goldRange: '100–250 gp',
      goldMin: 100,
      goldMax: 250,
      itemRarity: 'Uncommon',
      xpSuggestion: 450,
      exampleLoot: ['Bag of Holding', 'Cloak of Protection', 'Sending Stones', '+1 Ammunition (20)'],
    },
    {
      id: 't2_noble_reward',
      label: 'Noble Reward',
      goldRange: '250–500 gp',
      goldMin: 250,
      goldMax: 500,
      itemRarity: 'Uncommon',
      xpSuggestion: 900,
      exampleLoot: ['+1 Weapon', 'Boots of Elvenkind', 'Wand of Magic Missiles', 'Pearl of Power'],
    },
  ],
  3: [
    {
      id: 't3_treasure_haul',
      label: 'Treasure Haul',
      goldRange: '500–2000 gp',
      goldMin: 500,
      goldMax: 2000,
      itemRarity: 'Rare',
      xpSuggestion: 2300,
      exampleLoot: ['+2 Weapon', 'Ring of Protection', 'Necklace of Fireballs', 'Staff of the Woodlands'],
    },
    {
      id: 't3_ancient_vault',
      label: 'Ancient Vault Share',
      goldRange: '2000–5000 gp',
      goldMin: 2000,
      goldMax: 5000,
      itemRarity: 'Rare',
      xpSuggestion: 5900,
      exampleLoot: ['Flame Tongue', 'Belt of Giant Strength', 'Cloak of Displacement', 'Ioun Stone'],
    },
  ],
  4: [
    {
      id: 't4_legendary_bounty',
      label: 'Legendary Bounty',
      goldRange: '5000–15000 gp',
      goldMin: 5000,
      goldMax: 15000,
      itemRarity: 'Very Rare',
      xpSuggestion: 11500,
      exampleLoot: ['Vorpal Sword', 'Rod of Lordly Might', 'Carpet of Flying', 'Manual of Quickness of Action'],
    },
    {
      id: 't4_epic_spoils',
      label: 'Epic Spoils',
      goldRange: '15000+ gp',
      goldMin: 15000,
      goldMax: 50000,
      itemRarity: 'Very Rare',
      xpSuggestion: 20000,
      exampleLoot: ['Defender', 'Holy Avenger', 'Staff of the Magi', 'Sphere of Annihilation'],
    },
  ],
};

// ---------------------------------------------------------------------------
// LOCATION_MODIFIERS
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} LocationModifier
 * @property {string} type - Unique location type identifier
 * @property {string} name - Display name
 * @property {string} flavorDescription - How this location type changes quest flavor
 * @property {string[]} descriptionModifiers - Short phrases that add atmosphere
 * @property {string[]} uniqueComplications - Location-specific complications to weave in
 */

/** @type {LocationModifier[]} */
export const LOCATION_MODIFIERS = [
  {
    type: 'urban',
    name: 'Urban',
    flavorDescription: 'The quest unfolds in a city or town, full of politics, crowds, and narrow alleys.',
    descriptionModifiers: [
      'cobblestone streets',
      'crowded market districts',
      'city guard patrols',
      'guild rivalries',
      'rooftop chases',
    ],
    uniqueComplications: [
      'City guards interfere at the worst moment',
      'Witnesses must be kept quiet',
      'Criminal guilds have jurisdiction here',
      'Collateral damage draws public attention',
      'Corrupt officials are on the wrong side',
    ],
  },
  {
    type: 'rural',
    name: 'Rural',
    flavorDescription: 'Rolling farmland and small villages set the stage, where everyone knows everyone.',
    descriptionModifiers: [
      'muddy country roads',
      'isolated farmsteads',
      'tight-knit villagers',
      'seasonal harvests',
      'local superstitions',
    ],
    uniqueComplications: [
      'The community refuses to talk to outsiders',
      'Nearest help is days away',
      'Local customs complicate direct action',
      'Seasonal weather makes travel treacherous',
      'Feuding families muddy the truth',
    ],
  },
  {
    type: 'wilderness',
    name: 'Wilderness',
    flavorDescription: 'Untamed forests, mountains, or plains where civilization\'s reach fades.',
    descriptionModifiers: [
      'dense ancient forest',
      'treacherous mountain passes',
      'hidden game trails',
      'predator territories',
      'unpredictable weather',
    ],
    uniqueComplications: [
      'Navigation is difficult without a guide',
      'Supply lines are cut off',
      'Wild creatures complicate the mission',
      'No shelter from the elements',
      'The terrain itself is the enemy',
    ],
  },
  {
    type: 'dungeon',
    name: 'Dungeon',
    flavorDescription: 'Ancient ruins, caverns, or vaults beneath the earth where danger lurks around every corner.',
    descriptionModifiers: [
      'crumbling stone corridors',
      'ancient trap mechanisms',
      'flickering torchlight',
      'echoing chambers',
      'forgotten inscriptions',
    ],
    uniqueComplications: [
      'The dungeon is actively shifting or collapsing',
      'Another group of adventurers is already inside',
      'The traps have been recently re-armed',
      'Resources are limited — no resupply',
      'Retreat routes keep getting cut off',
    ],
  },
  {
    type: 'maritime',
    name: 'Maritime',
    flavorDescription: 'Open seas, coastal ports, and island chains define this aquatic adventure.',
    descriptionModifiers: [
      'salt-crusted docks',
      'hidden sea caves',
      'rival pirate flags',
      'shifting tides',
      'fog-shrouded waters',
    ],
    uniqueComplications: [
      'The ship is damaged or stolen',
      'A sea monster has claimed the area',
      'Storms make navigation nearly impossible',
      'Rival pirates are working the same waters',
      'An island community has hostile customs toward mainlanders',
    ],
  },
  {
    type: 'planar',
    name: 'Planar',
    flavorDescription: 'The quest spills into another plane of existence — the Feywild, Shadowfell, or beyond.',
    descriptionModifiers: [
      'reality bending at the edges',
      'alien geometry',
      'planar natives with unknown motives',
      'time flowing strangely',
      'mortal rules not applying',
    ],
    uniqueComplications: [
      'The party\'s magic behaves unpredictably',
      'Planar denizens have their own agenda',
      'Returning home requires a ritual or portal',
      'Time dilation distorts the mission deadline',
      'Local laws of nature are simply different here',
    ],
  },
  {
    type: 'underground',
    name: 'Underground',
    flavorDescription: 'The Underdark or deep cavern networks, full of alien civilizations and absolute darkness.',
    descriptionModifiers: [
      'phosphorescent fungi',
      'subterranean rivers',
      'Drow patrol routes',
      'oppressive silence',
      'vast underground cities',
    ],
    uniqueComplications: [
      'Surface spells and abilities are diminished',
      'Local Underdark factions demand tribute',
      'Light sources attract unwanted attention',
      'Maps are useless — everything has shifted',
      'Friendly fire is a constant threat in narrow tunnels',
    ],
  },
  {
    type: 'aerial',
    name: 'Aerial',
    flavorDescription: 'Floating islands, skyship routes, or mountaintop eyries where altitude is everything.',
    descriptionModifiers: [
      'howling wind currents',
      'cloud-hidden platforms',
      'skyship rigging',
      'dizzying drops',
      'aerial predator thermals',
    ],
    uniqueComplications: [
      'Falling is an ever-present lethal threat',
      'The wind interferes with ranged attacks',
      'The only route is across a crumbling sky bridge',
      'Aerial mounts are spooked or unavailable',
      'Weather changes suddenly and catastrophically',
    ],
  },
];

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Returns a random integer between min and max inclusive. */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Picks a random element from an array. Returns undefined for empty arrays. */
function pickRandom(arr) {
  if (!arr || arr.length === 0) return undefined;
  return arr[randInt(0, arr.length - 1)];
}

/** NPC name fragments for placeholder generation. */
const NPC_NAMES = [
  'Aldric the Merchant',
  'Sister Maren',
  'Captain Voss',
  'Elder Thalia',
  'Barkeep Gorra',
  'Lord Fayne',
  'The Widow Orin',
  'Sergeant Brek',
  'Scholar Iven',
  'Traveler Sune',
  'Priest Holdan',
  'Herbalist Nym',
  'Thief-Catcher Rys',
  'The Masked Courier',
  'Duke Aldrath',
];

const LOCATION_NAMES = [
  'the Thornwood',
  'Ashgate Keep',
  'the Sunken Market',
  'Mirewood Village',
  'the Shattered Spire',
  'Blackwater Docks',
  'the Old Temple',
  'Frostpeak Pass',
  'the Amber Caves',
  'Verun\'s Crossing',
  'the Flooded Ruins',
  'Ironwatch Tower',
  'the Whispering Glen',
  'Saltmere Bay',
  'the Grand Coliseum',
];

const ITEM_NAMES = [
  'a stolen signet ring',
  'an ancient tome',
  'a locked iron chest',
  'a cursed medallion',
  'the Crimson Chalice',
  'a forged land deed',
  'a singing sword',
  'a bag of rare spores',
  'a shattered amulet',
  'the Sunstone Fragment',
  'a vial of dragon blood',
  'an enchanted compass',
  'a sealed letter',
  'the Blackwood Idol',
  'a clockwork messenger',
];

const CREATURE_NAMES = [
  'giant spider',
  'werewolf',
  'basilisk',
  'harpy',
  'owlbear',
  'troll',
  'banshee',
  'wyvern',
  'manticore',
  'phase spider',
  'ettin',
  'hydra',
  'green hag',
  'revenant',
  'bandit warlord',
];

/**
 * Fills a description template with random or provided placeholder values.
 * @param {string} template
 * @param {{ npc?: string, location?: string, item?: string, creature?: string }} [overrides]
 * @returns {string}
 */
function fillTemplate(template, overrides = {}) {
  const npc = overrides.npc || pickRandom(NPC_NAMES);
  const location = overrides.location || pickRandom(LOCATION_NAMES);
  const item = overrides.item || pickRandom(ITEM_NAMES);
  const creature = overrides.creature || pickRandom(CREATURE_NAMES);

  return template
    .replace(/\{npc\}/g, npc)
    .replace(/\{location\}/g, location)
    .replace(/\{item\}/g, item)
    .replace(/\{creature\}/g, creature);
}

/**
 * Derives a difficulty tier (1-4) from a D&D party level (1-20).
 * @param {number} partyLevel
 * @returns {number}
 */
function levelToTier(partyLevel) {
  if (partyLevel <= 4) return 1;
  if (partyLevel <= 10) return 2;
  if (partyLevel <= 16) return 3;
  return 4;
}

// ---------------------------------------------------------------------------
// Exported functions
// ---------------------------------------------------------------------------

/**
 * Returns the full hook definition for a given hook type.
 * @param {string} hookType - One of the hook `type` strings from QUEST_HOOKS
 * @returns {QuestHook | undefined}
 */
export function getQuestHook(hookType) {
  return QUEST_HOOKS.find((h) => h.type === hookType);
}

/**
 * Returns the location modifier definition for a given location type.
 * @param {string} locationType - One of the location `type` strings from LOCATION_MODIFIERS
 * @returns {LocationModifier | undefined}
 */
export function getLocationModifier(locationType) {
  return LOCATION_MODIFIERS.find((l) => l.type === locationType);
}

/**
 * Calculates a reward package appropriate for the given difficulty and party level.
 * @param {number} difficulty - 1-4
 * @param {number} partyLevel - 1-20
 * @returns {{ tier: number, gold: number, itemRarity: string, xp: number, exampleLoot: string[], entry: RewardEntry }}
 */
export function calculateReward(difficulty, partyLevel) {
  const tier = Math.min(4, Math.max(1, Math.round((difficulty + levelToTier(partyLevel)) / 2)));
  const options = QUEST_REWARDS[tier];
  const entry = pickRandom(options);
  const gold = randInt(entry.goldMin, entry.goldMax);

  return {
    tier,
    gold,
    itemRarity: entry.itemRarity,
    xp: entry.xpSuggestion,
    exampleLoot: entry.exampleLoot,
    entry,
  };
}

/**
 * Adds a random twist to an existing quest object (non-mutating).
 * @param {Object} quest - A quest object (e.g. from generateSideQuest)
 * @returns {Object} A new quest object with a `twist` field added
 */
export function addTwist(quest) {
  const twist = pickRandom(QUEST_TWISTS);
  return { ...quest, twist };
}

/**
 * Generates a single side quest.
 * @param {number} [partyLevel=5] - Party level (1-20), used to calibrate difficulty and rewards
 * @param {string} [locationType] - Optional location type key from LOCATION_MODIFIERS; random if omitted
 * @param {Object} [options={}]
 * @param {string} [options.hookType] - Force a specific hook type; random if omitted
 * @param {boolean} [options.includeTwist=true] - Whether to include a random twist
 * @param {{ npc?: string, location?: string, item?: string, creature?: string }} [options.placeholders] - Override template placeholders
 * @returns {Object} A fully assembled side quest object
 */
export function generateSideQuest(partyLevel = 5, locationType, options = {}) {
  const { hookType, includeTwist = true, placeholders = {} } = options;

  // Resolve hook
  const hook = hookType ? getQuestHook(hookType) : pickRandom(QUEST_HOOKS);
  if (!hook) {
    throw new Error(`Unknown hookType: "${hookType}"`);
  }

  // Resolve location
  const resolvedLocationType = locationType || pickRandom(LOCATION_MODIFIERS).type;
  const locationMod = getLocationModifier(resolvedLocationType);

  // Determine difficulty within hook's range, skewed by party tier
  const tier = levelToTier(partyLevel);
  const clampedMin = Math.max(hook.difficultyMin, Math.min(tier, hook.difficultyMax));
  const difficulty = randInt(clampedMin, hook.difficultyMax);

  // Build description
  const description = fillTemplate(hook.descriptionTemplate, placeholders);

  // Select goal
  const goals = QUEST_GOALS[hook.type] || [];
  const goal = pickRandom(goals);

  // Complication from location
  const complication = locationMod ? pickRandom(locationMod.uniqueComplications) : null;

  // Reward
  const reward = calculateReward(difficulty, partyLevel);

  // Sessions
  const sessions = randInt(hook.sessionsMin, hook.sessionsMax);

  const quest = {
    id: `quest_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    hookType: hook.type,
    hookName: hook.name,
    description,
    goal: goal || null,
    locationType: resolvedLocationType,
    locationName: locationMod ? locationMod.name : resolvedLocationType,
    locationFlavor: locationMod ? locationMod.flavorDescription : null,
    complication,
    difficulty,
    estimatedSessions: sessions,
    reward,
    twist: null,
  };

  return includeTwist ? addTwist(quest) : quest;
}

/**
 * Generates multiple side quests at once.
 * @param {number} [count=3] - Number of quests to generate (1-10)
 * @param {number} [partyLevel=5] - Party level (1-20)
 * @param {string} [locationType] - Optional location type; if omitted each quest gets a random location
 * @returns {Object[]} Array of generated quest objects
 */
export function generateQuestBundle(count = 3, partyLevel = 5, locationType) {
  const safeCount = Math.min(10, Math.max(1, count));
  const quests = [];
  const usedHooks = new Set();

  for (let i = 0; i < safeCount; i++) {
    // Prefer variety — avoid repeating hook types when possible
    let hook;
    const attempts = QUEST_HOOKS.length;
    for (let a = 0; a < attempts; a++) {
      const candidate = pickRandom(QUEST_HOOKS);
      if (!usedHooks.has(candidate.type) || usedHooks.size >= QUEST_HOOKS.length) {
        hook = candidate;
        break;
      }
    }
    if (!hook) hook = pickRandom(QUEST_HOOKS);
    usedHooks.add(hook.type);

    quests.push(
      generateSideQuest(partyLevel, locationType, { hookType: hook.type })
    );
  }

  return quests;
}
