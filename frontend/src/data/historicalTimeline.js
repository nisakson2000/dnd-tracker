/**
 * historicalTimeline.js
 *
 * Roadmap Items Covered:
 *   - #186: Historical timeline
 *
 * Provides era types, event categories, pre-built timeline templates, event templates,
 * and helper functions for constructing and manipulating world history timelines.
 *
 * No React dependencies — pure data and utility functions.
 */

// ---------------------------------------------------------------------------
// ERA_TYPES
// ---------------------------------------------------------------------------

/**
 * Canonical list of era categories that can be used to organize a world timeline.
 * Each era has a description, a typical duration range (in years, loosely defined),
 * and a list of events that commonly occur during that period.
 */
export const ERA_TYPES = [
  {
    id: "primordial",
    label: "Primordial",
    description:
      "The era before recorded history, when the world itself was being shaped. Raw elemental forces ruled and no sapient civilization existed.",
    typicalDurationRange: { min: 100000, max: null, unit: "years", label: "Untold ages" },
    typicalEvents: [
      "Formation of continents and oceans",
      "Emergence of elemental planes",
      "Creation of the first lifeforms",
      "Awakening of primordial entities",
      "Binding of chaotic forces",
    ],
  },
  {
    id: "age_of_creation",
    label: "Age of Creation",
    description:
      "The period when divine or cosmic forces actively shaped the world, forging its fundamental laws and populating it with life.",
    typicalDurationRange: { min: 10000, max: 100000, unit: "years", label: "Thousands to tens of thousands of years" },
    typicalEvents: [
      "Creation of mortal races",
      "Establishment of natural laws",
      "Seeding of the world with magic",
      "Birth of the first dragons and great beasts",
      "Shaping of sacred mountains and rivers",
    ],
  },
  {
    id: "age_of_gods",
    label: "Age of Gods",
    description:
      "An epoch when deities walked openly upon the mortal world, directly intervening in affairs and warring among themselves.",
    typicalDurationRange: { min: 5000, max: 50000, unit: "years", label: "Millennia" },
    typicalEvents: [
      "Divine wars that reshape geography",
      "Mortals chosen as divine champions",
      "Establishment of first holy sites",
      "Granting of divine magic to worshippers",
      "Banishment or imprisonment of fallen gods",
    ],
  },
  {
    id: "age_of_mortals",
    label: "Age of Mortals",
    description:
      "The era when gods withdrew from direct involvement and mortal civilizations began to rise, fall, and rise again under their own power.",
    typicalDurationRange: { min: 1000, max: 10000, unit: "years", label: "Centuries to millennia" },
    typicalEvents: [
      "Rise of the first great cities",
      "Development of written language",
      "Early wars between neighboring tribes",
      "Discovery of metallurgy and arcane arts",
      "Formation of the first ruling dynasties",
    ],
  },
  {
    id: "age_of_heroes",
    label: "Age of Heroes",
    description:
      "A legendary era when individuals of exceptional power rose to reshape kingdoms and confront threats of world-ending scale.",
    typicalDurationRange: { min: 200, max: 2000, unit: "years", label: "Centuries" },
    typicalEvents: [
      "Legendary quests and monster-slaying campaigns",
      "Founding of knightly orders",
      "Forging of legendary artifacts",
      "Defeat of ancient evils",
      "Heroic deaths that become cultural myths",
    ],
  },
  {
    id: "age_of_empires",
    label: "Age of Empires",
    description:
      "A period of large-scale conquest, diplomacy, and imperial expansion where great nations absorbed their neighbors and dominated vast territories.",
    typicalDurationRange: { min: 300, max: 3000, unit: "years", label: "Centuries to millennia" },
    typicalEvents: [
      "Conquest of neighboring kingdoms",
      "Construction of grand roads and fortifications",
      "Unification of disparate peoples under one banner",
      "Cultural and technological exchange through trade",
      "Slave economies and colonial exploitation",
    ],
  },
  {
    id: "dark_age",
    label: "Dark Age",
    description:
      "A period of collapse, decline, and fragmentation following a catastrophe or the fall of a dominant power. Knowledge is lost and survival becomes paramount.",
    typicalDurationRange: { min: 100, max: 1000, unit: "years", label: "Generations to centuries" },
    typicalEvents: [
      "Collapse of trade networks",
      "Burning of great libraries",
      "Rise of warlords and petty rulers",
      "Famine and mass displacement",
      "Resurgence of dangerous monsters as civilization retreats",
    ],
  },
  {
    id: "age_of_exploration",
    label: "Age of Exploration",
    description:
      "An era of discovery where civilizations push beyond known borders, mapping new lands, encountering unknown peoples, and establishing far-flung colonies.",
    typicalDurationRange: { min: 100, max: 500, unit: "years", label: "Generations" },
    typicalEvents: [
      "First contact with distant civilizations",
      "Discovery of new continents or islands",
      "Founding of colonial outposts",
      "Opening of major sea trade routes",
      "Documentation of exotic flora, fauna, and magic",
    ],
  },
  {
    id: "modern_age",
    label: "Modern Age",
    description:
      "The current era of the campaign world, defined by the political, cultural, and technological state of affairs the players inhabit.",
    typicalDurationRange: { min: 50, max: 500, unit: "years", label: "Living memory to a few centuries" },
    typicalEvents: [
      "Ongoing political conflicts and alliances",
      "Recent wars and their settlements",
      "Current ruling dynasties and their origins",
      "Active guilds, factions, and power structures",
      "Events the player characters may have witnessed",
    ],
  },
];

// ---------------------------------------------------------------------------
// EVENT_CATEGORIES
// ---------------------------------------------------------------------------

/**
 * Categories that classify the nature of a historical event.
 * Used for filtering, display, and random generation.
 */
export const EVENT_CATEGORIES = [
  {
    id: "war",
    label: "War",
    iconHint: "crossed-swords",
    description: "Armed conflicts between nations, factions, or peoples, ranging from skirmishes to world-altering campaigns.",
  },
  {
    id: "founding",
    label: "Founding",
    iconHint: "castle",
    description: "Establishment of a city, kingdom, organization, religion, or other enduring institution.",
  },
  {
    id: "discovery",
    label: "Discovery",
    iconHint: "magnifying-glass",
    description: "A significant find — new lands, lost knowledge, powerful artifacts, or breakthrough understanding.",
  },
  {
    id: "cataclysm",
    label: "Cataclysm",
    iconHint: "explosion",
    description: "A world-altering disaster of natural, magical, or divine origin that permanently changes geography or civilization.",
  },
  {
    id: "divine_intervention",
    label: "Divine Intervention",
    iconHint: "sun",
    description: "Direct or notable indirect action by a deity or divine entity that shapes mortal affairs.",
  },
  {
    id: "political",
    label: "Political",
    iconHint: "crown",
    description: "Changes in governance, succession crises, coups, elections, or shifts in ruling power.",
  },
  {
    id: "cultural",
    label: "Cultural",
    iconHint: "lute",
    description: "Shifts in art, religion, language, customs, or the collective identity of a people.",
  },
  {
    id: "magical",
    label: "Magical",
    iconHint: "wand",
    description: "Events driven by or resulting in significant magical phenomena, including the rise of new schools of magic.",
  },
  {
    id: "natural_disaster",
    label: "Natural Disaster",
    iconHint: "mountain",
    description: "Earthquakes, floods, volcanic eruptions, and other non-magical geological or meteorological catastrophes.",
  },
  {
    id: "technological",
    label: "Technological",
    iconHint: "gear",
    description: "Invention or widespread adoption of new tools, techniques, or engineering that changes how society functions.",
  },
  {
    id: "treaty",
    label: "Treaty",
    iconHint: "scroll",
    description: "Formal agreements between powers that end conflicts, establish borders, or define relations for generations.",
  },
  {
    id: "extinction",
    label: "Extinction",
    iconHint: "skull",
    description: "The end of a species, civilization, language, or tradition — an irrevocable loss from the world.",
  },
  {
    id: "migration",
    label: "Migration",
    iconHint: "boot",
    description: "Large-scale movement of peoples, whether voluntary or forced, that reshapes the demographic map.",
  },
  {
    id: "plague",
    label: "Plague",
    iconHint: "flask",
    description: "Disease outbreaks, magical contagions, or curses that devastate populations and destabilize societies.",
  },
  {
    id: "prophecy",
    label: "Prophecy",
    iconHint: "eye",
    description: "The utterance, fulfillment, or deliberate circumvention of a foretelling that shapes the actions of nations.",
  },
];

// ---------------------------------------------------------------------------
// TIMELINE_TEMPLATES
// ---------------------------------------------------------------------------

/**
 * Pre-built timeline structures providing a narrative scaffold for a campaign world.
 * Each template includes ordered eras and sample events to inspire customization.
 */
export const TIMELINE_TEMPLATES = [
  {
    id: "classic_fantasy",
    label: "Classic Fantasy",
    description:
      "A traditional high-fantasy arc moving from divine creation through mortal civilization to the present age of heroes.",
    eras: [
      {
        eraId: "primordial",
        label: "The Before-Time",
        startYear: -100000,
        endYear: -50000,
        notes: "Raw elemental chaos before the gods shaped the world.",
        sampleEvents: [
          {
            year: -100000,
            title: "The First Silence",
            category: "cataclysm",
            description: "Nothing yet exists but roiling chaos and potential.",
          },
          {
            year: -75000,
            title: "Awakening of the Elder Things",
            category: "divine_intervention",
            description: "Primordial entities stir in the void between worlds.",
          },
        ],
      },
      {
        eraId: "age_of_creation",
        label: "The Shaping",
        startYear: -50000,
        endYear: -20000,
        notes: "The gods forge the world and populate it with life.",
        sampleEvents: [
          {
            year: -50000,
            title: "The World is Spoken Into Being",
            category: "divine_intervention",
            description: "The pantheon speaks the Words of Making and the world coheres from chaos.",
          },
          {
            year: -35000,
            title: "First Men Walk the Land",
            category: "founding",
            description: "The gods craft the first mortal races from earth, fire, and starlight.",
          },
          {
            year: -22000,
            title: "The Dragon Clutches Hatch",
            category: "founding",
            description: "Ancient dragons emerge from volcanic mountains, claiming dominion over sky and hoard.",
          },
        ],
      },
      {
        eraId: "age_of_gods",
        label: "The Divine Wars",
        startYear: -20000,
        endYear: -5000,
        notes: "Gods war openly, mortal races are caught in the crossfire.",
        sampleEvents: [
          {
            year: -18000,
            title: "The Sundering War",
            category: "war",
            description: "Two rival gods clash, splitting a continent and creating an inland sea.",
          },
          {
            year: -12000,
            title: "The Compact of Silence",
            category: "treaty",
            description: "The gods agree to withdraw from direct mortal intervention, communicating only through omens and champions.",
          },
          {
            year: -5500,
            title: "The Last God-Walk",
            category: "divine_intervention",
            description: "The death goddess walks openly among mortals one final time before retreating to her realm.",
          },
        ],
      },
      {
        eraId: "age_of_mortals",
        label: "The First Kingdoms",
        startYear: -5000,
        endYear: -1000,
        notes: "Mortal civilizations rise without divine guidance.",
        sampleEvents: [
          {
            year: -4800,
            title: "Founding of the River Cities",
            category: "founding",
            description: "The first permanent settlements arise along the Great River delta.",
          },
          {
            year: -3200,
            title: "Discovery of Arcane Script",
            category: "discovery",
            description: "Scholars develop a written system for encoding spell formulae.",
          },
          {
            year: -1500,
            title: "The Plague of Gray Dust",
            category: "plague",
            description: "A magical contagion wipes out three of the five great river-city kingdoms.",
          },
        ],
      },
      {
        eraId: "age_of_heroes",
        label: "The Heroic Age",
        startYear: -1000,
        endYear: -200,
        notes: "Legendary figures reshape the world through deed and sacrifice.",
        sampleEvents: [
          {
            year: -950,
            title: "Arathos the Undying Slain",
            category: "war",
            description: "A coalition of heroes defeats the lich-king Arathos and scatters his phylactery.",
          },
          {
            year: -600,
            title: "The Blade of Dawn is Forged",
            category: "magical",
            description: "The legendary sword Dawnbreaker is forged by a dwarven smith blessed by the sun god.",
          },
          {
            year: -250,
            title: "The Last Giant-King Exiled",
            category: "political",
            description: "A band of mortal heroes drives the final giant lord from the northern highlands.",
          },
        ],
      },
      {
        eraId: "age_of_empires",
        label: "The Imperial Century",
        startYear: -200,
        endYear: -50,
        notes: "The Auric Empire rises and consumes its neighbors.",
        sampleEvents: [
          {
            year: -200,
            title: "Founding of the Auric Empire",
            category: "founding",
            description: "King Auros the Conqueror unifies seven kingdoms under a single banner.",
          },
          {
            year: -120,
            title: "The Trade Roads Completed",
            category: "technological",
            description: "Imperial engineers finish a network of stone roads spanning the continent.",
          },
          {
            year: -60,
            title: "Auric Collapse",
            category: "cataclysm",
            description: "A succession crisis, famine, and magical plague dissolve the empire within a decade.",
          },
        ],
      },
      {
        eraId: "modern_age",
        label: "The Present Age",
        startYear: -50,
        endYear: 0,
        notes: "The current era. The players live here.",
        sampleEvents: [
          {
            year: -40,
            title: "The Fractured Kingdoms Emerge",
            category: "political",
            description: "Former imperial provinces declare independence and begin jostling for dominance.",
          },
          {
            year: -10,
            title: "The Adventurers' Guild Founded",
            category: "founding",
            description: "A neutral organization charters itself to regulate and deploy independent heroes.",
          },
          {
            year: 0,
            title: "Present Day",
            category: "political",
            description: "The current campaign begins.",
          },
        ],
      },
    ],
  },

  {
    id: "post_apocalyptic",
    label: "Post-Apocalyptic",
    description:
      "A world that once knew great prosperity, was shattered by catastrophe, and is now slowly rebuilding from the ruins.",
    eras: [
      {
        eraId: "age_of_empires",
        label: "The Golden Age",
        startYear: -500,
        endYear: -200,
        notes: "A civilization of unprecedented power and sophistication.",
        sampleEvents: [
          {
            year: -500,
            title: "The Magocracy Established",
            category: "founding",
            description: "A council of archmages founds a nation governed entirely by magical expertise.",
          },
          {
            year: -400,
            title: "The Sky Engines Completed",
            category: "technological",
            description: "Flying cities are constructed, lifting the elite above the mundane world.",
          },
          {
            year: -250,
            title: "The Cure for the Wasting Sickness",
            category: "discovery",
            description: "Alchemists eradicate a centuries-old plague, extending average lifespans by decades.",
          },
          {
            year: -210,
            title: "The Accord of Nations",
            category: "treaty",
            description: "All known nations sign a peace treaty enforced by magical surveillance.",
          },
        ],
      },
      {
        eraId: "cataclysm",
        label: "The Shattering",
        startYear: -200,
        endYear: -180,
        notes: "A rapid sequence of catastrophic events that ended the Golden Age.",
        sampleEvents: [
          {
            year: -200,
            title: "The Ritual Goes Wrong",
            category: "cataclysm",
            description: "An attempt to ascend a mortal to godhood tears a hole in the fabric of reality.",
          },
          {
            year: -198,
            title: "The Sky Cities Fall",
            category: "cataclysm",
            description: "The magical engines sustaining the flying cities fail simultaneously; they crash into the earth.",
          },
          {
            year: -195,
            title: "The Death Plague",
            category: "plague",
            description: "Necrotic energy pouring from the reality tear animates the dead across three continents.",
          },
          {
            year: -182,
            title: "The Final Silence",
            category: "extinction",
            description: "The Magocracy ceases to exist; its last records are sealed in a vault no one can locate.",
          },
        ],
      },
      {
        eraId: "dark_age",
        label: "The Long Night",
        startYear: -180,
        endYear: -50,
        notes: "Generations of survival, superstition, and forgotten knowledge.",
        sampleEvents: [
          {
            year: -175,
            title: "The Burning of the Archives",
            category: "cataclysm",
            description: "Desperate survivors burn the last great library to deny it to the undead.",
          },
          {
            year: -140,
            title: "The Prophet of the Ash",
            category: "prophecy",
            description: "A wandering seer foretells that the world will be reborn from the ruins if mortals endure.",
          },
          {
            year: -100,
            title: "The Undead Tide Recedes",
            category: "natural_disaster",
            description: "For unknown reasons, the undead hordes begin to thin and retreat to the Shattered Zones.",
          },
          {
            year: -60,
            title: "First Ruin-Delvers",
            category: "discovery",
            description: "Brave explorers begin entering the ruins of Golden Age cities, recovering technology and lore.",
          },
        ],
      },
      {
        eraId: "age_of_exploration",
        label: "The Rebuilding",
        startYear: -50,
        endYear: -10,
        notes: "New communities form and the world is slowly remapped.",
        sampleEvents: [
          {
            year: -50,
            title: "The Concord of Survivors",
            category: "founding",
            description: "Seven survivor communities sign a mutual defense pact that evolves into a new government.",
          },
          {
            year: -35,
            title: "Rediscovery of Arcane Script",
            category: "discovery",
            description: "A recovered tome teaches scholars the old written magical language.",
          },
          {
            year: -20,
            title: "The Road North Cleared",
            category: "technological",
            description: "A militia clears the undead from the northern trade road, restoring commerce.",
          },
        ],
      },
      {
        eraId: "modern_age",
        label: "The Fragile Present",
        startYear: -10,
        endYear: 0,
        notes: "New civilization blooms on ancient bones. Old dangers stir.",
        sampleEvents: [
          {
            year: -8,
            title: "The Vault is Found",
            category: "discovery",
            description: "Explorers locate the sealed Magocracy archives. What is inside could change everything.",
          },
          {
            year: -3,
            title: "The Tear Widens",
            category: "cataclysm",
            description: "Scholars report the reality tear has begun expanding again.",
          },
          {
            year: 0,
            title: "Present Day",
            category: "political",
            description: "The current campaign begins.",
          },
        ],
      },
    ],
  },

  {
    id: "political_intrigue",
    label: "Political Intrigue",
    description:
      "A history shaped by statecraft, betrayal, civil conflict, and the slow reformation of institutions — ideal for court-intrigue campaigns.",
    eras: [
      {
        eraId: "age_of_mortals",
        label: "The Founding",
        startYear: -400,
        endYear: -300,
        notes: "A kingdom is born from the unification of warring clans.",
        sampleEvents: [
          {
            year: -400,
            title: "The Battle of Three Rivers",
            category: "war",
            description: "Warlord Cassian defeats the last rival clan lord and claims dominion over the united lands.",
          },
          {
            year: -395,
            title: "The Charter of Rights",
            category: "founding",
            description: "To secure noble loyalty, Cassian codifies the rights and responsibilities of the noble houses.",
          },
          {
            year: -380,
            title: "The Royal Academy Founded",
            category: "founding",
            description: "A school of governance, law, and arcane study is established to train the ruling class.",
          },
          {
            year: -350,
            title: "The First Census",
            category: "cultural",
            description: "The crown conducts the first systematic survey of population and resources.",
          },
        ],
      },
      {
        eraId: "age_of_empires",
        label: "The Expansion",
        startYear: -300,
        endYear: -150,
        notes: "The kingdom grows through conquest, marriage, and diplomacy.",
        sampleEvents: [
          {
            year: -290,
            title: "The Eastern Annexation",
            category: "political",
            description: "The eastern city-states are absorbed through a combination of military threat and dynastic marriage.",
          },
          {
            year: -240,
            title: "The Merchant Guild Chartered",
            category: "founding",
            description: "The crown grants a monopoly charter to a new merchant guild in exchange for tax revenue.",
          },
          {
            year: -200,
            title: "The Northern Crusade",
            category: "war",
            description: "Religious authorities convince the crown to launch a holy war against the northern tribes.",
          },
          {
            year: -160,
            title: "The Peace of Amber Hills",
            category: "treaty",
            description: "After costly stalemate, the crown signs a treaty recognizing northern tribal sovereignty.",
          },
        ],
      },
      {
        eraId: "dark_age",
        label: "The Civil War",
        startYear: -150,
        endYear: -80,
        notes: "A disputed succession tears the kingdom into warring factions.",
        sampleEvents: [
          {
            year: -150,
            title: "The Heirless King Dies",
            category: "political",
            description: "King Aldric III dies without a named heir, triggering competing claims from four noble houses.",
          },
          {
            year: -145,
            title: "The War of Four Banners Begins",
            category: "war",
            description: "Open warfare erupts between the claimant factions.",
          },
          {
            year: -130,
            title: "The Burning of the Capital",
            category: "cataclysm",
            description: "Two rival armies clash in the capital city, and the resulting fires destroy a third of it.",
          },
          {
            year: -110,
            title: "The Plague of Soldiers",
            category: "plague",
            description: "A disease spread by military encampments kills more soldiers than the war itself.",
          },
          {
            year: -90,
            title: "The Regency Council Forms",
            category: "political",
            description: "Exhausted noble houses agree to joint rule by council while a suitable monarch is found.",
          },
          {
            year: -82,
            title: "House Valdris Elevated",
            category: "political",
            description: "The council selects a minor noble house as the new royal line, owing debts to all major factions.",
          },
        ],
      },
      {
        eraId: "age_of_exploration",
        label: "The Reformation",
        startYear: -80,
        endYear: -20,
        notes: "A weakened but wiser kingdom reforms its institutions.",
        sampleEvents: [
          {
            year: -75,
            title: "The New Charter",
            category: "founding",
            description: "The reconstituted monarchy drafts a new charter balancing crown, noble, and merchant authority.",
          },
          {
            year: -55,
            title: "The Inquisition Disbanded",
            category: "cultural",
            description: "The religious inquisition that persecuted dissidents during the civil war is formally dissolved.",
          },
          {
            year: -40,
            title: "The First Elected Council",
            category: "political",
            description: "Guild masters and senior merchants are granted seats in an advisory council to the crown.",
          },
          {
            year: -25,
            title: "Discovery of the Southern Sea Route",
            category: "discovery",
            description: "A royal explorer maps a sea route to distant spice-producing islands, funding the treasury.",
          },
        ],
      },
      {
        eraId: "modern_age",
        label: "The Tense Present",
        startYear: -20,
        endYear: 0,
        notes: "Old wounds fester beneath a veneer of stability.",
        sampleEvents: [
          {
            year: -18,
            title: "The Assassination Attempt",
            category: "political",
            description: "An unknown party makes an attempt on the young queen's life. Accusations fly between noble houses.",
          },
          {
            year: -10,
            title: "The Merchant Rebellion",
            category: "war",
            description: "Southern trading cities withhold taxes and raise militias, demanding charter reforms.",
          },
          {
            year: -5,
            title: "The Compact of Guilds",
            category: "treaty",
            description: "The queen grants expanded merchant council rights in exchange for restored tax flow.",
          },
          {
            year: 0,
            title: "Present Day",
            category: "political",
            description: "The current campaign begins. Tensions between old noble houses and the new merchant class simmer.",
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// EVENT_TEMPLATES
// ---------------------------------------------------------------------------

/**
 * Fifteen reusable event templates with placeholder tokens.
 * Tokens use {curly_brace} syntax and should be replaced with campaign-specific names.
 *
 * Available placeholder types: {faction}, {location}, {hero}, {threat}, {artifact},
 * {ruler}, {enemy_nation}, {deity}, {resource}, {disaster_type}
 */
export const EVENT_TEMPLATES = [
  {
    id: "evt_conquest",
    title: "{faction} Conquers {location}",
    category: "war",
    descriptionTemplate:
      "After a {duration}-long campaign, {faction} defeats the defenders of {location} and absorbs it into their territory. The old rulers are {fate}.",
    placeholders: ["faction", "location", "duration", "fate"],
    suggestedEras: ["age_of_empires", "age_of_heroes", "age_of_mortals"],
  },
  {
    id: "evt_hero_defeats_threat",
    title: "{hero} Defeats {threat}",
    category: "war",
    descriptionTemplate:
      "{hero} confronts {threat} at {location} and, through {method}, brings an end to the terror that has plagued {region} for {duration}.",
    placeholders: ["hero", "threat", "location", "method", "region", "duration"],
    suggestedEras: ["age_of_heroes", "age_of_gods"],
  },
  {
    id: "evt_artifact_forged",
    title: "{artifact} is Forged",
    category: "magical",
    descriptionTemplate:
      "The legendary {artifact} is forged by {creator} at {location}, imbued with {power}. It is gifted to {recipient} to serve as a symbol of {purpose}.",
    placeholders: ["artifact", "creator", "location", "power", "recipient", "purpose"],
    suggestedEras: ["age_of_gods", "age_of_heroes", "age_of_creation"],
  },
  {
    id: "evt_artifact_discovered",
    title: "{artifact} is Discovered",
    category: "discovery",
    descriptionTemplate:
      "Explorers from {faction} unearth {artifact} in the ruins of {location}. Its true nature is not immediately understood, but its power quickly draws dangerous attention.",
    placeholders: ["faction", "artifact", "location"],
    suggestedEras: ["age_of_exploration", "modern_age", "age_of_mortals"],
  },
  {
    id: "evt_artifact_lost",
    title: "{artifact} is Lost",
    category: "discovery",
    descriptionTemplate:
      "{artifact} vanishes during {event_context}. Some believe it was destroyed; others insist it lies waiting in {rumored_location}.",
    placeholders: ["artifact", "event_context", "rumored_location"],
    suggestedEras: ["dark_age", "age_of_heroes", "modern_age"],
  },
  {
    id: "evt_kingdom_founded",
    title: "{faction} is Founded",
    category: "founding",
    descriptionTemplate:
      "{ruler} unites the peoples of {region} under a single banner, proclaiming the founding of {faction} at {location}. The founding principles are {principles}.",
    placeholders: ["faction", "ruler", "region", "location", "principles"],
    suggestedEras: ["age_of_mortals", "age_of_heroes", "age_of_empires"],
  },
  {
    id: "evt_great_plague",
    title: "The {plague_name} Sweeps {region}",
    category: "plague",
    descriptionTemplate:
      "A devastating sickness known as {plague_name} spreads through {region}, killing an estimated {death_toll} of the population. Its origin is traced to {origin}, and no cure is found for {duration}.",
    placeholders: ["plague_name", "region", "death_toll", "origin", "duration"],
    suggestedEras: ["dark_age", "age_of_mortals", "modern_age"],
  },
  {
    id: "evt_divine_war",
    title: "{deity} Wars Against {enemy_deity}",
    category: "divine_intervention",
    descriptionTemplate:
      "{deity} and {enemy_deity} clash in open conflict, using mortal armies as proxies. The war ends when {resolution}, forever altering the balance of divine power.",
    placeholders: ["deity", "enemy_deity", "resolution"],
    suggestedEras: ["age_of_gods", "age_of_creation"],
  },
  {
    id: "evt_cataclysm",
    title: "The {disaster_type} of {location}",
    category: "cataclysm",
    descriptionTemplate:
      "A catastrophic {disaster_type} destroys {location}, killing thousands and rendering the land {aftermath} for {duration}. Survivors scatter to {destination}.",
    placeholders: ["disaster_type", "location", "aftermath", "duration", "destination"],
    suggestedEras: ["primordial", "age_of_gods", "dark_age"],
  },
  {
    id: "evt_great_migration",
    title: "{faction} Migrates to {location}",
    category: "migration",
    descriptionTemplate:
      "Driven from their homeland by {cause}, the people of {faction} undertake a {duration} migration, eventually settling in {location} and displacing or assimilating the peoples already there.",
    placeholders: ["faction", "location", "cause", "duration"],
    suggestedEras: ["dark_age", "age_of_mortals", "age_of_exploration"],
  },
  {
    id: "evt_prophecy_spoken",
    title: "The Prophecy of {subject}",
    category: "prophecy",
    descriptionTemplate:
      "The oracle {prophet} speaks a prophecy regarding {subject}: \"{prophecy_text}\". Debate immediately erupts over its true meaning, and {faction} uses it to justify {action}.",
    placeholders: ["subject", "prophet", "prophecy_text", "faction", "action"],
    suggestedEras: ["age_of_gods", "age_of_heroes", "modern_age"],
  },
  {
    id: "evt_peace_treaty",
    title: "The Treaty of {location}",
    category: "treaty",
    descriptionTemplate:
      "{faction} and {enemy_nation} sign the Treaty of {location}, ending {conflict_name}. Key terms include {terms}. The treaty holds for {duration} before {breach_event}.",
    placeholders: ["location", "faction", "enemy_nation", "conflict_name", "terms", "duration", "breach_event"],
    suggestedEras: ["age_of_empires", "modern_age", "age_of_mortals"],
  },
  {
    id: "evt_resource_discovered",
    title: "Discovery of {resource} at {location}",
    category: "discovery",
    descriptionTemplate:
      "Prospectors from {faction} discover vast deposits of {resource} beneath {location}. Within {duration}, the discovery transforms the regional economy and draws the covetous attention of {rival_faction}.",
    placeholders: ["resource", "location", "faction", "duration", "rival_faction"],
    suggestedEras: ["age_of_exploration", "age_of_mortals", "modern_age"],
  },
  {
    id: "evt_ruler_rises",
    title: "{ruler} Takes the Throne",
    category: "political",
    descriptionTemplate:
      "{ruler} seizes power in {faction} by {method}. Their reign begins with {early_action}, signaling a dramatic departure from previous rule. Supporters and enemies alike scramble to adapt.",
    placeholders: ["ruler", "faction", "method", "early_action"],
    suggestedEras: ["age_of_empires", "modern_age", "dark_age"],
  },
  {
    id: "evt_species_extinction",
    title: "The Last {species}",
    category: "extinction",
    descriptionTemplate:
      "The {species}, once widespread across {region}, are confirmed extinct following {cause}. Their loss leaves {ecological_or_cultural_gap} that other peoples struggle to fill.",
    placeholders: ["species", "region", "cause", "ecological_or_cultural_gap"],
    suggestedEras: ["primordial", "dark_age", "age_of_gods"],
  },
];

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Creates a new timeline event object with required fields and optional metadata.
 *
 * @param {string} eraId - The ID of the era this event belongs to (matches ERA_TYPES[].id)
 * @param {string} categoryId - The event category ID (matches EVENT_CATEGORIES[].id)
 * @param {Object} data - Event data fields
 * @param {string} data.title - Display title for the event
 * @param {string} [data.description] - Narrative description of the event
 * @param {number} [data.year] - In-world year the event occurred (negative = before present)
 * @param {string} [data.significance] - "minor" | "moderate" | "major" | "world_altering"
 * @param {string[]} [data.tags] - Free-form tags for additional filtering
 * @param {string} [data.id] - Optional custom ID; auto-generated if omitted
 * @returns {Object} A structured timeline event object
 */
export function createTimelineEvent(eraId, categoryId, data = {}) {
  const {
    title = "Unnamed Event",
    description = "",
    year = null,
    significance = "moderate",
    tags = [],
    id = null,
  } = data;

  const validSignificances = ["minor", "moderate", "major", "world_altering"];
  const normalizedSignificance = validSignificances.includes(significance) ? significance : "moderate";

  return {
    id: id || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    eraId,
    categoryId,
    title,
    description,
    year,
    significance: normalizedSignificance,
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date().toISOString(),
  };
}

/**
 * Retrieves an era type definition by its ID.
 *
 * @param {string} eraId - The era ID to look up (e.g., "primordial", "modern_age")
 * @returns {Object|null} The matching ERA_TYPES entry, or null if not found
 */
export function getEraType(eraId) {
  if (!eraId) return null;
  return ERA_TYPES.find((era) => era.id === eraId) || null;
}

/**
 * Retrieves a full timeline template by its ID.
 *
 * @param {string} templateId - The template ID (e.g., "classic_fantasy", "post_apocalyptic")
 * @returns {Object|null} The matching TIMELINE_TEMPLATES entry, or null if not found
 */
export function getTimelineTemplate(templateId) {
  if (!templateId) return null;
  return TIMELINE_TEMPLATES.find((template) => template.id === templateId) || null;
}

/**
 * Sorts an array of timeline events chronologically.
 * Events without a year are placed at the end.
 *
 * @param {Object[]} events - Array of timeline event objects
 * @param {"asc"|"desc"} [order="asc"] - Sort direction: "asc" = oldest first, "desc" = newest first
 * @returns {Object[]} A new sorted array (does not mutate the original)
 */
export function sortTimeline(events, order = "asc") {
  if (!Array.isArray(events)) return [];

  return [...events].sort((a, b) => {
    const yearA = a.year !== null && a.year !== undefined ? a.year : Infinity;
    const yearB = b.year !== null && b.year !== undefined ? b.year : Infinity;

    return order === "desc" ? yearB - yearA : yearA - yearB;
  });
}

/**
 * Filters an array of timeline events to only those matching a given category ID.
 *
 * @param {Object[]} events - Array of timeline event objects
 * @param {string} categoryId - Category ID to filter by (matches EVENT_CATEGORIES[].id)
 * @returns {Object[]} A new array containing only events of the specified category
 */
export function filterByCategory(events, categoryId) {
  if (!Array.isArray(events)) return [];
  if (!categoryId) return [...events];
  return events.filter((evt) => evt.categoryId === categoryId);
}

/**
 * Generates a random event loosely appropriate for the given era, optionally influenced
 * by a narrative context string. Returns a partially-filled event object whose
 * description may contain unfilled {placeholder} tokens for the user to complete.
 *
 * @param {string} eraId - The era ID to generate an event for
 * @param {Object} [context={}] - Optional context hints
 * @param {string} [context.tone] - Narrative tone hint: "heroic" | "tragic" | "political" | "mysterious"
 * @param {string} [context.region] - Name of the region where the event should occur
 * @param {string} [context.faction] - Primary faction involved in the event
 * @returns {Object} A partially-filled timeline event object
 */
export function generateRandomEvent(eraId, context = {}) {
  const { tone = "heroic", region = "{region}", faction = "{faction}" } = context;

  const era = getEraType(eraId);
  const eraLabel = era ? era.label : "Unknown Era";

  // Select candidate templates based on suggested eras, falling back to all templates
  const candidates = EVENT_TEMPLATES.filter(
    (t) => !t.suggestedEras || t.suggestedEras.includes(eraId)
  );
  const pool = candidates.length > 0 ? candidates : EVENT_TEMPLATES;
  const template = pool[Math.floor(Math.random() * pool.length)];

  // Apply context substitutions where possible; leave other tokens as-is
  let filledTitle = template.title
    .replace(/{faction}/g, faction)
    .replace(/{location}/g, region);

  let filledDescription = template.descriptionTemplate
    .replace(/{faction}/g, faction)
    .replace(/{location}/g, region)
    .replace(/{region}/g, region);

  // Tone-based significance mapping
  const significanceByTone = {
    heroic: "major",
    tragic: "major",
    political: "moderate",
    mysterious: "moderate",
  };
  const significance = significanceByTone[tone] || "moderate";

  return createTimelineEvent(eraId, template.category, {
    title: filledTitle,
    description: `[Generated from template "${template.id}" — fill in remaining {placeholders}]\n\n${filledDescription}`,
    year: null,
    significance,
    tags: ["generated", eraLabel.toLowerCase().replace(/\s+/g, "_"), tone],
  });
}
