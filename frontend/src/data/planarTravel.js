/**
 * @file planarTravel.js
 * @description Data and helpers for the Plane of Existence Tracker
 *
 * Roadmap Items Covered:
 *   - #182: Plane of existence tracker
 *
 * Exports:
 *   PLANES_OF_EXISTENCE  - Full list of planes with metadata
 *   PLANAR_EFFECTS       - Environmental effect definitions
 *   PORTAL_TYPES         - Portal/gateway type definitions
 *   PLANAR_TRAVEL_METHODS - Methods for traveling between planes
 *
 * Helper Functions:
 *   getPlane(planeId)
 *   getPlaneEffects(planeId)
 *   getPortalTypes()
 *   getTravelMethods(destinationPlane)
 *   getAllPlanes()
 *   getPlanesByType(type)
 */

// ---------------------------------------------------------------------------
// PLANES_OF_EXISTENCE
// ---------------------------------------------------------------------------

export const PLANES_OF_EXISTENCE = [
  // ── MATERIAL ────────────────────────────────────────────────────────────
  {
    id: "material",
    name: "Material Plane",
    type: "material",
    alignment: null,
    description:
      "The nexus of most D&D adventures — a world of mortal life governed by the laws of physics, magic, and divine influence. All other planes reflect or oppose it in some way.",
    environmentalEffects: [
      "Standard gravity (down)",
      "Normal time flow (1:1 ratio with other planes)",
      "Magic functions normally",
      "Full spectrum of light and weather",
    ],
    survivalRules:
      "Standard survival rules apply. No special planar hazards unless magically induced.",
    notableInhabitants: ["Humans", "Elves", "Dwarves", "Dragons", "Giants", "Fiends (summoned)"],
  },

  // ── TRANSITIVE PLANES ───────────────────────────────────────────────────
  {
    id: "ethereal",
    name: "Ethereal Plane",
    type: "transitive",
    alignment: null,
    description:
      "A misty, ghost-like dimension that overlaps the Material Plane and the Inner Planes. Travelers in the Border Ethereal can observe the Material world but not interact with it. The Deep Ethereal is a foggy sea connecting all of the Inner Planes.",
    environmentalEffects: [
      "Gravity: Normal, but movement is omnidirectional in the Deep Ethereal",
      "Time: Normal (1:1 with Material Plane)",
      "Visibility: 60 ft. in the Border Ethereal; fog limits sight in the Deep Ethereal",
      "Magic: Spells that create solid effects do not cross into the Material Plane",
      "Incorporeal movement through solid Material objects (Border Ethereal only)",
    ],
    survivalRules:
      "Creatures do not need to eat, drink, or breathe in the Ethereal Plane. Ethereal creatures appear as faint, ghostly forms to those with true seeing on the Material Plane.",
    notableInhabitants: ["Ghosts", "Ethereal filchers", "Phase spiders", "Night hags"],
    subRegions: ["Border Ethereal", "Deep Ethereal"],
  },
  {
    id: "astral",
    name: "Astral Plane",
    type: "transitive",
    alignment: null,
    description:
      "A silvery void connecting the Material Plane to the Outer Planes. Time is meaningless here — travelers do not age or require sustenance. Thought shapes movement; silver cords tether astrally projected souls to their bodies.",
    environmentalEffects: [
      "Gravity: Subjective directional (you choose your 'down')",
      "Time: Timeless — creatures do not age, hunger, thirst, or sleep",
      "Psychic Wind: Disorienting storms; DC 15 Wisdom save or become lost / suffer psychic damage",
      "Silver Cord: Astrally projected creatures are tethered; severing the cord is lethal",
      "Color Pools: Shimmering ovals that serve as portals to the Outer Planes",
      "Magic: Functions normally, but time-affecting spells have no effect",
    ],
    survivalRules:
      "No food, water, or air needed. Movement is via thought (fly speed equal to Intelligence score × 3 ft.). Psychic Wind tables apply on a failed save (consult DMG Astral Plane section).",
    notableInhabitants: ["Githyanki", "Astral Dreadnoughts", "Death knights", "Spectral travelers"],
  },

  // ── INNER PLANES — ECHO ─────────────────────────────────────────────────
  {
    id: "feywild",
    name: "Feywild",
    type: "echo",
    alignment: null,
    description:
      "A bright, hyper-vivid echo of the Material Plane suffused with raw magical energy. Colors are impossibly saturated, forests are ancient and sentient, and time flows erratically. Emotions run high — joy becomes euphoria, sorrow becomes despair.",
    environmentalEffects: [
      "Time Distortion: 1 day in Feywild can equal 1 day to 1 year on the Material Plane (roll on the Feywild Time Warp table)",
      "Heightened Emotions: Charisma checks have advantage; creatures are susceptible to enchantment",
      "Enchanted Nature: Plants and animals may be sapient or hostile",
      "Magic Surge: Wild magic is more volatile; sorcerers may trigger surges more easily",
      "Bright and Vivid: Darkvision is less useful; everything radiates soft magical light",
    ],
    survivalRules:
      "Travelers who eat Feywild food may be magically bound to the plane. Speaking your true name risks giving fey creatures power over you. Time lost in the Feywild cannot easily be reclaimed.",
    notableInhabitants: ["Eladrin", "Pixies", "Sprites", "Satyrs", "Hags", "Archfey", "Unicorns"],
  },
  {
    id: "shadowfell",
    name: "Shadowfell",
    type: "echo",
    alignment: null,
    description:
      "A dark, colorless mirror of the Material Plane drained of warmth and hope. Shadows are thick, colors are muted grays and blacks, and an oppressive despair seeps into all who linger. The dead walk here as a matter of course.",
    environmentalEffects: [
      "Shadowfell Despair: After each long rest, DC 10 Wisdom save or gain a flaw from the Shadowfell Despair table (DMG p. 52)",
      "Muted Colors: Everything appears in shades of gray; bright light spells shed only dim light",
      "Darkness Dominance: Darkness spell cannot be dispelled here without remove curse",
      "Undead Empowerment: Undead creatures have advantage on saving throws",
      "Negative Energy Seepage: Extended stays cause emotional flatness and existential dread",
    ],
    survivalRules:
      "Shadowfell Despair table: roll d6 — 1–2 Apathy (disadvantage on death saves & Dex checks), 3–4 Dread (must succeed DC 10 Wis save to leave shelter), 5–6 Madness (gain short-term madness). A calm emotions spell or remove curse ends the flaw.",
    notableInhabitants: ["Shadar-kai", "Vampires", "Wraiths", "Liches", "Sorrowsworn", "Raven Queen servants"],
  },

  // ── INNER PLANES — ELEMENTAL ─────────────────────────────────────────────
  {
    id: "elemental_fire",
    name: "Elemental Plane of Fire",
    type: "inner",
    alignment: null,
    description:
      "An infinite sea of flame ranging from roiling magma fields to soaring towers of burning rock. The air shimmers with heat, and the sky — if it can be called that — is a blinding curtain of white-orange fire.",
    environmentalEffects: [
      "Ambient Fire Damage: 3d10 fire damage per minute without protection",
      "Gravity: Normal",
      "Breathable Air: Scarce — smoke and superheated gases require Constitution saves to breathe",
      "Light: Blinding brightness; creatures without fire resistance have disadvantage on Perception checks",
      "Flammable Materials: Unprotected wood and cloth ignite instantly",
    ],
    survivalRules:
      "Resistance or immunity to fire is strongly recommended. Spell: Protection from Energy (fire) is mandatory for most mortals. Water conjured here evaporates immediately. Ice spells are half effective.",
    notableInhabitants: ["Efreet", "Fire elementals", "Azer", "Salamanders", "Magmin"],
    city: "City of Brass (Efreet capital)",
  },
  {
    id: "elemental_water",
    name: "Elemental Plane of Water",
    type: "inner",
    alignment: null,
    description:
      "An endless ocean with no surface and no sea floor — just infinite water in every direction. Currents shift without warning, and islands of coral or ice drift through the dark depths.",
    environmentalEffects: [
      "Gravity: Normal (toward the nearest large mass) or none in open water",
      "Drowning Risk: Non-aquatic creatures must hold breath or begin suffocating",
      "Crushing Pressure: Deep regions inflict 4d6 bludgeoning damage per round",
      "Visibility: 60 ft. in clear zones, 10 ft. in turbid zones",
      "Cold Pockets: Near Ice Para-Elemental border, extreme cold deals 2d6 cold damage per round",
    ],
    survivalRules:
      "Water Breathing spell or item required. Freedom of Movement recommended. Creatures without a swim speed move at half speed.",
    notableInhabitants: ["Marids", "Water elementals", "Sea hags", "Merfolk (native variants)", "Krakens"],
    city: "The Citadel of Ten Thousand Pearls (Marid palace)",
  },
  {
    id: "elemental_earth",
    name: "Elemental Plane of Earth",
    type: "inner",
    alignment: null,
    description:
      "A vast labyrinth of tunnels, caverns, and solid rock stretching infinitely in all directions. Enormous gemstone veins and ore deposits line the walls. There is no sky — only stone above, below, and beside.",
    environmentalEffects: [
      "Gravity: Normal",
      "Suffocation: Solid rock areas suffocate creatures without earth glide or magic",
      "Crushing: Tunnels can collapse; falling rock deals 4d10 bludgeoning damage",
      "Darkness: Near-total darkness except near lava or bioluminescent mineral zones",
      "Slowed Movement: Difficult terrain in unworked stone passages",
    ],
    survivalRules:
      "Passwall or Earth Glide (via magic item/spell) required to navigate freely. Tremorsense is advantageous. Bring your own light sources.",
    notableInhabitants: ["Dao", "Earth elementals", "Xorn", "Galeb duhr", "Deep gnomes (travelers)"],
    city: "The Great Dismal Delve (Dao stronghold)",
  },
  {
    id: "elemental_air",
    name: "Elemental Plane of Air",
    type: "inner",
    alignment: null,
    description:
      "A boundless sky of swirling clouds, lightning storms, and roaring gale-force winds. There is no ground — only an endless blue-white expanse punctuated by floating earthmotes and cloud islands.",
    environmentalEffects: [
      "Gravity: Subjective directional — creatures fall toward the nearest island or earthmote",
      "Wind: Constant gale; ranged attacks at disadvantage without magic",
      "Lightning Storms: 2d10 lightning damage per minute in storm zones",
      "Visibility: Excellent in clear zones, zero in storm clouds",
      "Falling: Without flight, creatures fall indefinitely until striking an island",
    ],
    survivalRules:
      "Fly spell or item is essential. Feather Fall as insurance. Storm-resistant gear reduces lightning damage.",
    notableInhabitants: ["Djinn", "Air elementals", "Aarakocra", "Cloud giants (travelers)", "Invisible Stalkers"],
    city: "The City of Ice and Steel (Djinn stronghold atop a frozen earthmote)",
  },

  // ── INNER PLANES — PARA-ELEMENTAL ───────────────────────────────────────
  {
    id: "paraelemental_ice",
    name: "Para-Elemental Plane of Ice",
    type: "inner",
    alignment: null,
    description:
      "The border region between the Planes of Air and Water, manifesting as a frozen tundra of glaciers, blizzards, and absolute zero temperatures.",
    environmentalEffects: [
      "Extreme Cold: 4d6 cold damage per round without resistance",
      "Blizzard Visibility: 5 ft. in blizzard zones",
      "Frozen Terrain: All ground is difficult terrain",
      "Shattering Wind: Ranged attacks impossible in blizzard zones",
    ],
    survivalRules:
      "Cold resistance or immunity mandatory. Furs alone are insufficient — magical protection required for extended stays.",
    notableInhabitants: ["Ice mephits", "Frost giants (travelers)", "Cryonax (Prince of Evil Cold)"],
  },
  {
    id: "paraelemental_ooze",
    name: "Para-Elemental Plane of Ooze",
    type: "inner",
    alignment: null,
    description:
      "The border between Water and Earth — a suffocating expanse of thick, clinging mud and sludge that swallows travelers whole.",
    environmentalEffects: [
      "Suffocation: Non-ooze creatures must succeed DC 14 Str checks to move; failure means they sink",
      "Engulfment: Being pulled under deals 2d6 acid damage per round",
      "Exhaustion: Every hour of travel requires a DC 12 Con save or gain one level of exhaustion",
      "No Light: Near-total darkness",
    ],
    survivalRules:
      "Freedom of Movement spell eliminates movement penalties. Acid resistance helps. Navigation without a guide is nearly impossible.",
    notableInhabitants: ["Mud mephits", "Ooze mephits", "Juiblex (Demon Lord of Slimes — sometimes appears here)"],
  },
  {
    id: "paraelemental_magma",
    name: "Para-Elemental Plane of Magma",
    type: "inner",
    alignment: null,
    description:
      "The boiling border between Fire and Earth — rivers of lava wind through tunnels of superheated rock, and fountains of molten stone erupt without warning.",
    environmentalEffects: [
      "Ambient Fire/Heat: 2d10 fire damage per round without protection",
      "Lava Submersion: 20d6 fire damage per round while submerged",
      "Toxic Fumes: DC 13 Con save each minute or poisoned",
      "Unstable Ground: Lava crust may crack underfoot (DC 14 Dex save or sink)",
    ],
    survivalRules:
      "Fire immunity strongly preferred over resistance. Flying avoids lava crust collapse. Air supply via magic required.",
    notableInhabitants: ["Magma mephits", "Magmins", "Imix (Prince of Evil Fire — sometimes crosses here)"],
  },
  {
    id: "paraelemental_smoke",
    name: "Para-Elemental Plane of Smoke",
    type: "inner",
    alignment: null,
    description:
      "The choking border between Fire and Air — a sky of endless billowing smoke and cinders that makes breathing nearly impossible and navigation a nightmare.",
    environmentalEffects: [
      "Suffocation: DC 12 Con save each minute or begin suffocating",
      "Zero Visibility: Heavily obscured beyond 5 ft.",
      "Cinder Damage: 1d6 fire damage per round from burning ash",
      "Navigation: Impossible without tremorsense, blindsight, or a guide",
    ],
    survivalRules:
      "Magical air supply required. Blindsight or echolocation invaluable. Fire resistance reduces cinder damage.",
    notableInhabitants: ["Smoke mephits", "Belker demons", "Lost travelers"],
  },

  // ── INNER PLANES — ENERGY ────────────────────────────────────────────────
  {
    id: "positive_energy",
    name: "Positive Energy Plane",
    type: "inner",
    alignment: null,
    description:
      "The source of all life energy — a blinding white void of pure vitality. Too much life energy, however, is lethal; mortals who linger are overwhelmed and burst with excess life force.",
    environmentalEffects: [
      "Radiant Overcharge: Regain 10 HP per round (maximum HP can be exceeded as temporary HP, up to double max)",
      "Death by Life: At 2× max HP in temporary HP, must succeed DC 15 Con save each round or die from overcharge",
      "Blinding Light: Permanently bright light; creatures without Sunlight Sensitivity still have disadvantage on Perception checks",
      "Undead Destruction: Undead take 10d10 radiant damage per round",
      "No Darkness: Darkness spells instantly dispelled",
    ],
    survivalRules:
      "Visits must be extremely brief or protected by special magic (e.g., Negative Energy infusion to counterbalance). Undead cannot survive here without extreme protection.",
    notableInhabitants: ["Radiant idols", "Manifestations of life energy (no sentient native inhabitants)"],
  },
  {
    id: "negative_energy",
    name: "Negative Energy Plane",
    type: "inner",
    alignment: null,
    description:
      "The source of undeath and entropy — a freezing, lightless void that drains life from all living things. Undead feel at home here; the living are slowly consumed.",
    environmentalEffects: [
      "Life Drain: Lose 1d6 max HP per round (cannot be healed while on this plane)",
      "Necrotic Saturation: Healing spells have no effect; only magical items that restore HP still work",
      "Total Darkness: No light source functions beyond 5 ft. except magical sources of 3rd level or higher",
      "Undead Empowerment: Undead creatures gain 2d6 temp HP per round and advantage on all checks",
      "Death Ward Overwhelmed: If max HP reaches 0, creature dies and immediately rises as a wight",
    ],
    survivalRules:
      "Life Ward or Deathward spells slow the drain. Time on this plane must be minimized. No resting is possible — exhaustion accumulates rapidly.",
    notableInhabitants: ["Nightwalkers", "Liches (visiting)", "Undead of all types", "Bodak"],
  },

  // ── OUTER PLANES — LAWFUL EVIL ──────────────────────────────────────────
  {
    id: "nine_hells",
    name: "The Nine Hells of Baator",
    type: "outer",
    alignment: "lawful evil",
    description:
      "Nine layers of torment arranged in a strict hierarchy, each ruled by an archdevil. The Hells operate on iron law, contract, and corruption. Devils seek to claim mortal souls through bargains and temptation.",
    layers: [
      { name: "Avernus", ruler: "Zariel", description: "Blasted hellscape, river Styx, endless battle with demons" },
      { name: "Dis", ruler: "Dispater", description: "Iron city of surveillance and paranoia" },
      { name: "Minauros", ruler: "Mammon", description: "Fetid swamp of greed and sinking cities" },
      { name: "Phlegethos", ruler: "Fierna & Belial", description: "Lake of fire, torture capital of the Hells" },
      { name: "Stygia", ruler: "Levistus", description: "Frozen sea, lord trapped in ice" },
      { name: "Malbolge", ruler: "Glasya", description: "Tumbling boulders, ever-collapsing landscape" },
      { name: "Maladomini", ruler: "Baalzebul", description: "Ruined cities, flies everywhere, decay" },
      { name: "Cania", ruler: "Mephistopheles", description: "Arctic wasteland of deadly cold" },
      { name: "Nessus", ruler: "Asmodeus", description: "Deepest pit, Asmodeus's fortress Malsheem" },
    ],
    environmentalEffects: [
      "Oppressive Heat (Avernus, Phlegethos): 1d10 fire damage per hour without protection",
      "Extreme Cold (Stygia, Cania): 1d10 cold damage per hour without protection",
      "Lawful Compulsion: Creatures who break a sworn contract take 4d10 psychic damage",
      "Devil Observation: Archdevils are aware of unauthorized visitors in their layers",
      "River Styx (Avernus): Touching the water causes memory loss (DC 15 Int save or forget everything)",
    ],
    survivalRules:
      "Never sign a contract without reading every word. Iron flask can trap a devil. Holy water and silvered weapons recommended. Knowing the true name of an archdevil grants leverage.",
    notableInhabitants: ["Asmodeus", "Zariel", "Dispater", "Mephistopheles", "Imps", "Bearded devils", "Pit fiends", "Erinyes"],
  },

  // ── OUTER PLANES — CHAOTIC EVIL ─────────────────────────────────────────
  {
    id: "abyss",
    name: "The Abyss",
    type: "outer",
    alignment: "chaotic evil",
    description:
      "An infinite cascade of layers, each more horrific than the last, ruled by demon lords of unimaginable power. The Abyss embodies pure, mindless evil and chaos — it exists to destroy, consume, and corrupt.",
    environmentalEffects: [
      "Abyssal Corruption: After each long rest, DC 15 Wisdom save or gain a random form of short-term madness",
      "Demonic Influence: Chaotic evil fiends are automatically aware of non-evil intruders",
      "Variable Terrain: Each layer has its own bizarre and deadly terrain",
      "Corrupting Touch: Objects of good alignment slowly tarnish and lose properties (1 per week)",
      "Infinite Descent: Portals between layers are one-way unless you know the path",
    ],
    survivalRules:
      "Protection from Evil and Good is mandatory. Do not make deals with demons — unlike devils, they do not honor agreements. Every layer has unique hazards; research the specific layer before traveling.",
    notableInhabitants: ["Demogorgon (layers 88 & 89)", "Orcus (layer 113, Thanatos)", "Yeenoghu", "Baphomet", "Graz'zt", "Balors", "Mariliths", "Nalfeshnee"],
    knownLayers: [
      "Layer 1: Pazunia (Plain of Infinite Portals)",
      "Layer 88/89: The Gaping Maw (Demogorgon's realm)",
      "Layer 113: Thanatos (Orcus's realm, undead everywhere)",
      "Layer 422: Azzagrat (Graz'zt's triple realm)",
      "Layer 600: The Endless Maze (Baphomet's labyrinth)",
    ],
  },
  {
    id: "pandemonium",
    name: "Pandemonium",
    type: "outer",
    alignment: "chaotic evil",
    description:
      "A lightless rock riddled with tunnels through which howling winds scream without end. The noise is maddening — literally. Even the walls seem to weep with the cries of lost souls.",
    environmentalEffects: [
      "Maddening Winds: DC 15 Wisdom save each hour or gain one level of indefinite madness",
      "Total Darkness: No natural light; magical light sources work but are dimmed by howling interference",
      "Deafening: Creatures are deafened unless wearing ear protection (magical silence helps)",
      "Wind: Ranged attacks are impossible; flying creatures must make DC 15 Str saves or be thrown off course",
      "Navigation: Impossible without a guide; tunnels shift and loop unpredictably",
    ],
    survivalRules:
      "Silence spell creates a bubble of sanity. Sound-dampening magical items are essential for extended stays. Do not travel alone — it is too easy to become lost.",
    notableInhabitants: ["Howlers", "Gnolls (exiled)", "Demodands", "Trapped souls", "Fallen angels"],
    layers: ["Pandesmos (first layer)", "Cocytus (second layer, louder)", "Phlegethonos (third layer)", "Agathion (fourth layer, deepest)"],
  },
  {
    id: "carceri",
    name: "Carceri",
    type: "outer",
    alignment: "chaotic evil",
    description:
      "The prison plane — six layers of spheres floating within spheres, each a barren wasteland of swamp, ice, iron, or worse. Once trapped here, escape is nearly impossible. It is the realm of traitors, liars, and the betrayed.",
    environmentalEffects: [
      "Planar Imprisonment: Portals leaving Carceri require a DC 20 Charisma check (with Persuasion) or specific magical keys",
      "Despair Field: DC 13 Wisdom save each day or gain the Despairing flaw (cannot take the Help action)",
      "Layer Hazards: Vary by layer — acid rain (Othrys), crushing ice (Colothys), etc.",
      "No Escape: Dimension Door and Misty Step do not cross layer boundaries",
    ],
    survivalRules:
      "A way out must be arranged BEFORE arriving. Gate spell is the most reliable exit. Betrayal is culturally endemic; no alliances formed here can be trusted.",
    notableInhabitants: ["Yugoloths (guards)", "Demodands", "Rulers of dead empires", "Imprisoned gods (rumored)", "Rakshasas"],
    layers: ["Othrys (olive-green sky, giant spheres)", "Cathrys (crimson sphere, acid rain)", "Minethys (ochre, sandstorm)", "Colothys (iron spheres, deep ravines)", "Porphatys (black water, acidic)", "Agathys (ice and cold)"],
  },

  // ── OUTER PLANES — NEUTRAL EVIL ─────────────────────────────────────────
  {
    id: "gehenna",
    name: "Gehenna",
    type: "outer",
    alignment: "neutral evil",
    description:
      "Four volcanic mountain layers jutting from infinite void. There is no flat ground — only sheer volcanic slopes. The plane embodies cruelty, greed, and self-interest. Yugoloths call this home.",
    environmentalEffects: [
      "Steep Slopes: All ground is difficult terrain; DC 12 Dex (Acrobatics) save each minute or slide 1d10 × 5 ft.",
      "Volcanic Activity: Lava flows deal 3d10 fire damage; eruptions are common",
      "Gravity: Parallel to the slope surface, making movement disorienting",
      "Toxic Atmosphere: Sulfur fumes require DC 11 Con save each hour or be poisoned",
    ],
    survivalRules:
      "Fly spell or climbing gear essential. Yugoloths will offer 'assistance' at extreme cost — their contracts are binding but always leave the yugoloth an out.",
    notableInhabitants: ["Yugoloths (all types)", "Night hags", "Korvash the Merchant (mythical yugoloth broker)"],
    layers: ["Khalas", "Chamada", "Mungoth", "Krangath"],
  },
  {
    id: "hades",
    name: "Hades",
    type: "outer",
    alignment: "neutral evil",
    description:
      "Three layers of grey, colorless wasteland called the Three Glooms. Hades does not punish with fire or cold — it smothers with apathy and hopelessness. Even the most vibrant souls fade here.",
    environmentalEffects: [
      "Soul Withering: After each long rest, DC 10 Charisma save or lose 1 point of Charisma permanently (restored when leaving)",
      "Color Drain: All color gradually fades from clothing, equipment, and skin over 24 hours",
      "Apathy Aura: Creatures must succeed DC 12 Wisdom save to take motivated actions (Help, Inspire, etc.)",
      "Larval Transformation: Mortal souls who die here become larvae — worm-like husks sold to fiends",
      "No Healing: Natural healing is halved; magical healing requires a DC 10 spell check",
    ],
    survivalRules:
      "Do not rest here longer than necessary. A Bless spell partially counteracts the soul-withering effect. Return to a higher plane immediately after completing business.",
    notableInhabitants: ["Night hags", "Larvae", "Yugoloths (buyers of larvae)", "Undead of ancient civilizations"],
    layers: ["Oinos", "Niflheim", "Pluton"],
  },

  // ── OUTER PLANES — LAWFUL NEUTRAL ───────────────────────────────────────
  {
    id: "mechanus",
    name: "Mechanus",
    type: "outer",
    alignment: "lawful neutral",
    description:
      "An infinite plane of interlocking clockwork gears, each turning with mathematical precision. Every gear meshes perfectly with its neighbors, driven by forces beyond mortal comprehension. Law and order are absolute here.",
    environmentalEffects: [
      "Gravity: Normal, perpendicular to the nearest gear surface",
      "Time: Perfectly regular — no time distortion",
      "Mechanus Law: Chaotic behavior is instinctively suppressed; DC 12 Wisdom save to act chaotically",
      "Modron Observation: All activity is logged by the modron hierarchy",
      "Noise: Constant mechanical clicking and grinding; muffled at night-equivalent periods",
    ],
    survivalRules:
      "Follow the rules. Modrons are lawful to a fault — they will enforce regulations they cannot override. Bringing chaotic-aligned creatures here may trigger a modron response.",
    notableInhabitants: ["Modrons (Monodrone through Primus)", "Inevitables (Marut, Kolyarut, Quarut)", "Formians", "Harmonium faction travelers"],
    city: "Regulus (Primus's domain, center of the Great Wheel)",
  },

  // ── OUTER PLANES — CHAOTIC NEUTRAL ──────────────────────────────────────
  {
    id: "limbo",
    name: "Limbo",
    type: "outer",
    alignment: "chaotic neutral",
    description:
      "Pure elemental chaos — raw matter and energy churning in an endless storm of creation and destruction. Solid ground, fire, water, and void swap places at random. Only beings of strong will can impose any stability.",
    environmentalEffects: [
      "Chaos Surge: Every minute, roll d6: 1 — the terrain beneath you changes (lava, ice, void, stone, etc.), 2–5 — no change, 6 — a chaotic magical effect occurs (roll Wild Magic Surge table)",
      "Will Stability: DC 10 Wisdom check to stabilize a 10-ft.-radius area around you as a bonus action",
      "No Natural Gravity: Each creature generates its own gravity field",
      "Elemental Flux: Random elemental damage (1d4: 1 fire, 2 cold, 3 lightning, 4 acid) 1d6 damage per minute",
    ],
    survivalRules:
      "Githzerai monks impose mental discipline to create stable monasteries here. Spells with predictable effects may behave randomly (DM discretion). Psionics are more reliable than arcane magic.",
    notableInhabitants: ["Githzerai", "Slaadi (all colors)", "Proteans", "Chaos beasts"],
    city: "Shra'kt'lor (Githzerai fortress-city of 2 million)",
  },

  // ── OUTER PLANES — GOOD ─────────────────────────────────────────────────
  {
    id: "mount_celestia",
    name: "Mount Celestia",
    type: "outer",
    alignment: "lawful good",
    description:
      "A single, infinite mountain rising through seven heavenly layers, each more radiant and spiritually pure than the last. Law and good are perfectly balanced here. Celestial beings of divine power dwell on its slopes.",
    layers: [
      { name: "Lunia (Silver Heaven)", description: "Base of the mountain; great silver sea; realm of travelers" },
      { name: "Mercuria (Gold Heaven)", description: "Golden light, rolling hills, warrior angels" },
      { name: "Venya (Pearl Heaven)", description: "Halfling heavens; river Oceanus passes through" },
      { name: "Solania (Electrum Heaven)", description: "Holy monasteries, dwarven gods' realms" },
      { name: "Mertion (Platinum Heaven)", description: "Lawful good champions; paladins of Helm" },
      { name: "Jovar (Glittering Heaven)", description: "Gem-encrusted slopes, jeweled spires" },
      { name: "Chronias (The Illuminated Heaven)", description: "So holy that few mortals can survive it; merges beings with pure law and good" },
    ],
    environmentalEffects: [
      "Calming Aura: Hostile intentions require DC 15 Wisdom save to maintain",
      "Holy Ground: Evil-aligned creatures take 1d10 radiant damage per round",
      "Upward Pull: Gravity pulls toward the mountain slope, always 'up' toward the peak",
      "Healing: Hit point maximum increases by 1d6 per hour of rest here (max +3d6 bonus)",
    ],
    survivalRules:
      "Evil characters cannot willingly ascend. Chromatics (Chronias layer) merge the traveler's soul with the plane — only mortals of exceptional purity survive this. Weapons of chaos lose their properties after 1 week.",
    notableInhabitants: ["Archons (Lantern, Hound, Trumpet)", "Solars", "Planetars", "Devas", "Torm, Tyr, Bahamut (layers 4–5)"],
  },
  {
    id: "elysium",
    name: "Elysium",
    type: "outer",
    alignment: "neutral good",
    description:
      "The ultimate paradise — four layers of perfect natural beauty, warmth, and well-being. Good creatures feel completely at home here; even the most troubled soul finds peace. The River Oceanus runs through it.",
    environmentalEffects: [
      "Blissful Aura: Creatures must succeed DC 14 Wisdom save each day or become unwilling to leave",
      "Natural Healing: Regain maximum HP on each hit die spent during rests",
      "Peace Field: Ranged weapons used with hostile intent miss on rolls of 1–5 (1d20)",
      "River Oceanus: Touching its waters cures one disease or condition (once per day)",
    ],
    survivalRules:
      "The primary danger is not wanting to leave. Magic-users should preset a return trigger (e.g., a recurring alarm spell) before visiting. Evil creatures are instinctively uncomfortable.",
    notableInhabitants: ["Guardinals (Cervidal, Equinal, Leonals)", "Empyreans", "Couatls", "Good-aligned petitioners"],
    layers: ["Amoria", "Eronia", "Belierin", "Thalasia"],
  },
  {
    id: "arborea",
    name: "Arborea",
    type: "outer",
    alignment: "chaotic good",
    description:
      "Three layers of wild, overgrown beauty — vast primordial forests, wine-dark seas, and mountain ranges that touch the clouds. Arborea is passionate and free-spirited; its inhabitants are as likely to celebrate as to fight.",
    environmentalEffects: [
      "Emotional Intensity: All Charisma (Persuasion and Intimidation) checks have advantage",
      "Wild Magic: Spells that deal with nature or emotion have their damage dice maximized",
      "Free Spirit Aura: Creatures cannot be magically charmed while in Arborea",
      "River Oceanus: Flows through the first layer; banks are sites of feast and song",
    ],
    survivalRules:
      "Violence is frequent but rarely lethal between native inhabitants. Outsiders who disrespect nature risk drawing the wrath of the Seldarine (elven pantheon). Drink and revelry can distract travelers dangerously.",
    notableInhabitants: ["Corellon Larethian", "Eladrin (celestial)", "Titans", "Nymphs", "Bacchae", "Elf petitioners"],
    layers: ["Arvandor (Elf Heaven)", "Ossa", "Pelion"],
  },

  // ── OUTER PLANES — NEUTRAL ──────────────────────────────────────────────
  {
    id: "outlands",
    name: "The Outlands",
    type: "outer",
    alignment: "true neutral",
    description:
      "The plane of absolute neutrality — a vast disk at the center of the Outer Planes, with a great Spire at its center that reaches infinitely upward. The city of Sigil sits atop the Spire. Magic weakens the closer you get to the Spire.",
    environmentalEffects: [
      "Magic Suppression: Spell slots of 9th level unavailable within 900 miles of Spire; 8th within 800 miles; etc.",
      "Gate Towns: 16 gate towns on the outer ring, each reflecting the alignment of the plane it borders",
      "Balanced Environment: No elemental extremes; standard weather and terrain",
    ],
    survivalRules:
      "Sigil (City of Doors) is accessible only via portals — the Lady of Pain controls all access. Factions of Sigil have significant influence here. Neutrality in deed and thought is rewarded.",
    notableInhabitants: ["The Lady of Pain (Sigil)", "Dabus", "All factions of Sigil", "Modrons (pilgrimages)", "Rilmani"],
    city: "Sigil — The City of Doors",
  },
];

// ---------------------------------------------------------------------------
// PLANAR_EFFECTS
// ---------------------------------------------------------------------------

export const PLANAR_EFFECTS = {
  gravity: {
    normal: "Standard downward gravity. Creatures and objects fall normally.",
    subjective_directional:
      "Each creature determines their own 'down' as a bonus action. Unattended objects stay put. Disorienting until adapted (DC 12 Wisdom save on arrival or disadvantage on attacks for 1 hour).",
    none: "Zero gravity. Movement is via push-off; max speed equals walking speed in any direction.",
    toward_mass:
      "Gravity pulls toward the nearest significant mass (planet, gear, island). Can shift suddenly.",
    parallel_slope:
      "Gravity runs parallel to the nearest surface rather than toward a center point (Gehenna).",
  },
  time: {
    normal: "Time passes at a 1:1 ratio with the Material Plane.",
    timeless:
      "Time does not pass. Creatures do not age, hunger, thirst, or tire. Spells with durations measured in real time do not expire (Astral Plane).",
    distorted_fast:
      "Time moves faster relative to the Material Plane. Days here may be hours there.",
    distorted_slow:
      "Time moves slower relative to the Material Plane. Hours here may be days there.",
    feywild_warp:
      "Roll d100: 01–50 = same time passes; 51–60 = 1d4 extra days; 61–72 = 1d10 extra days; 73–84 = 1d10 extra months; 85–96 = 1d10 extra years; 97–00 = 1d100 extra years.",
  },
  magic: {
    normal: "All spells and magical effects function as written.",
    suppressed_near_spire:
      "Within the Outlands near the Spire: spell level limitations apply based on proximity.",
    enhanced_nature:
      "Spells with the nature descriptor are enhanced (maximized damage, extended duration).",
    wild_chaos:
      "Spellcasting requires a DC 10 + spell level Arcana check or triggers a Wild Magic Surge.",
    no_healing:
      "Healing spells do not restore HP (Negative Energy Plane). Only temporary HP workarounds apply.",
    no_time_spells:
      "Time-affecting magic has no effect (Astral Plane — timelessness negates these).",
  },
  elemental_dominance: {
    fire: "Unprotected flammable materials ignite immediately. Water and ice effects halved.",
    water: "All terrain is aquatic. Non-aquatic creatures require water breathing.",
    earth: "Tunnels and solid rock everywhere. Earth Glide or Passwall required for navigation.",
    air: "No solid ground except islands/earthmotes. Flight mandatory.",
    positive: "Overchannel effect: regain HP per round but risk death by overcharge.",
    negative: "Life drain: max HP reduced per round; healing suppressed; undead empowered.",
  },
  psychic: {
    psychic_wind:
      "Astral Plane: DC 15 Wisdom save or roll on Psychic Wind table — disorientation, madness, memory loss, transportation to random location.",
    maddening_howl:
      "Pandemonium: DC 15 Wisdom save each hour or gain a level of indefinite madness.",
    abyssal_corruption:
      "Abyss: DC 15 Wisdom save each long rest or gain short-term madness.",
    shadowfell_despair:
      "Shadowfell: DC 10 Wisdom save each long rest or gain a Shadowfell Despair flaw (Apathy, Dread, or Madness).",
    blissful_compulsion:
      "Elysium: DC 14 Wisdom save each day or become unwilling to leave the plane.",
    soul_withering:
      "Hades: DC 10 Charisma save each long rest or lose 1 Charisma (restored upon leaving).",
  },
};

// ---------------------------------------------------------------------------
// PORTAL_TYPES
// ---------------------------------------------------------------------------

export const PORTAL_TYPES = [
  {
    id: "permanent",
    name: "Permanent Portal",
    description:
      "A stable, fixed gateway between two specific points across planes. These exist for geological or divine reasons and have been open for centuries or millennia.",
    activation: "Walking through the visible shimmering gateway",
    reliability: "Always active",
    keyRequired: false,
    twoWay: true,
    examples: ["Ancient portals in Sigil", "Dwarven Underhalls gates to Elemental Earth", "Standing stone circles to the Feywild"],
  },
  {
    id: "temporary",
    name: "Temporary Portal",
    description:
      "A portal that opens for a limited time — often tied to celestial events, rituals, or spell effects. Once it closes, the connection is severed until the triggering condition recurs.",
    activation: "Trigger condition met (time of year, moon phase, ritual performed)",
    reliability: "Conditional — expires after duration",
    keyRequired: false,
    twoWay: true,
    duration: "Usually 1 minute to 1 hour, sometimes once per year (e.g., solstice alignments)",
    examples: ["Moonlit fey crossings on midsummer", "Ritual-opened demonic rifts", "Solstice gates to Mount Celestia"],
  },
  {
    id: "one_way",
    name: "One-Way Portal",
    description:
      "A portal that only allows passage in one direction. Travelers arrive but cannot return by the same means. Common in prison planes (Carceri) and deep in the Abyss.",
    activation: "Walking through the visible side",
    reliability: "Active but directional",
    keyRequired: false,
    twoWay: false,
    warning: "Travelers must arrange separate return transport before entering.",
    examples: ["Descent portals in the Abyss", "Carceri entry portals", "Divine banishment gates"],
  },
  {
    id: "two_way",
    name: "Two-Way Portal",
    description:
      "A standard bidirectional portal allowing passage in both directions. Most permanent portals are two-way unless deliberately constructed otherwise.",
    activation: "Walking through from either side",
    reliability: "Active in both directions",
    keyRequired: false,
    twoWay: true,
    examples: ["Most Sigil door portals", "Established trade gates between planes", "Wizard tower demiplanes"],
  },
  {
    id: "keyed",
    name: "Keyed Portal",
    description:
      "A portal that remains inert until a specific key is presented. The key may be a physical object, a spoken password, a specific spell, or even an emotional state.",
    activation: "Presenting the correct key while adjacent to the portal",
    reliability: "Active only when keyed",
    keyRequired: true,
    twoWay: true,
    keyTypes: [
      "Physical object (a specific coin, gem, or artifact)",
      "Spoken password or name (often in Celestial, Infernal, or Primordial)",
      "Cast spell of specific school or level",
      "Emotional state (must be genuinely in love, afraid, at peace, etc.)",
      "Time-sensitive action (knocking three times at midnight)",
      "Blood of specific creature type",
    ],
    examples: ["Hag covens' secret crossings", "Archmage tower entry portals", "Divine temple inner sanctum gates"],
  },
  {
    id: "random",
    name: "Random Portal",
    description:
      "An unstable portal that activates unpredictably and sends travelers to a random destination each time, or sends each traveler to a different plane.",
    activation: "Unpredictable — proximity, magic, or random chance",
    reliability: "Unreliable — may not activate, may change destination",
    keyRequired: false,
    twoWay: false,
    warning: "No guarantees on destination. Travelers may be separated. Return trip requires different means.",
    rollTable: "Roll d20: 1–2 Material Plane (random location), 3–4 Feywild, 5–6 Shadowfell, 7–8 Astral, 9–10 Ethereal, 11 Nine Hells, 12 Abyss, 13 Mount Celestia, 14 Mechanus, 15 Limbo, 16–17 Elemental Plane (random), 18 Outlands, 19 Carceri, 20 DM's choice",
    examples: ["Wild magic zones", "Malfunctioning cubic gates", "Rift tears from planar warfare"],
  },
  {
    id: "color_pool",
    name: "Color Pool (Astral Plane)",
    description:
      "Shimmering oval portals visible only from one side, drifting through the Astral Plane. Each color corresponds to a specific Outer Plane. Stepping through transports the traveler to that plane.",
    activation: "Swimming through the pool from the Astral side",
    reliability: "Stable but must be located (Perception DC 15 to find a specific one)",
    keyRequired: false,
    twoWay: false,
    colorChart: [
      { color: "Jet black", destination: "Negative Energy Plane" },
      { color: "Amethyst", destination: "Abyss" },
      { color: "Indigo", destination: "Carceri" },
      { color: "Magenta", destination: "Gehenna" },
      { color: "Red", destination: "Hades" },
      { color: "Orange", destination: "Pandemonium" },
      { color: "Maroon", destination: "Nine Hells" },
      { color: "Royal blue", destination: "Mechanus" },
      { color: "Rust", destination: "Limbo" },
      { color: "Olive", destination: "Outlands" },
      { color: "Emerald green", destination: "Mount Celestia" },
      { color: "Gold", destination: "Bytopia" },
      { color: "Yellow", destination: "Elysium" },
      { color: "Peach", destination: "Beastlands" },
      { color: "Violet", destination: "Arborea" },
      { color: "Pale blue", destination: "Positive Energy Plane" },
    ],
    examples: ["Astral Plane navigation", "Githyanki raider routes", "Astral Projection exit points"],
  },
];

// ---------------------------------------------------------------------------
// PLANAR_TRAVEL_METHODS
// ---------------------------------------------------------------------------

export const PLANAR_TRAVEL_METHODS = [
  // ── SPELLS ────────────────────────────────────────────────────────────────
  {
    id: "spell_plane_shift",
    category: "spell",
    name: "Plane Shift",
    spellLevel: 7,
    castingTime: "1 action",
    components: "V, S, M (a forked metal rod attuned to a specific plane, worth at least 250 gp)",
    description:
      "Transports up to 8 willing creatures (or forces one unwilling creature on a failed Charisma save) to a specific plane. Arrival location is imprecise — typically 1d10 × 100 miles from the intended destination.",
    limitations: [
      "Requires plane-specific material component (forked rod) — different rod for each plane",
      "Cannot specify exact arrival point",
      "Unwilling target gets a Charisma saving throw (DC = spell save DC)",
      "Cannot target a specific location — only a plane",
    ],
    availableTo: ["Cleric", "Druid", "Sorcerer", "Warlock", "Wizard"],
    compatibleDestinations: "Any plane (with correct tuning fork)",
  },
  {
    id: "spell_gate",
    category: "spell",
    name: "Gate",
    spellLevel: 9,
    castingTime: "1 action",
    components: "V, S, M (a diamond worth at least 5,000 gp)",
    description:
      "Opens a circular portal 5–20 ft. in diameter to a specific location on any plane, or calls a named creature of CR 21 or lower from another plane. The portal remains open for up to 1 minute (concentration).",
    limitations: [
      "9th-level spell — very high resource cost",
      "Requires a diamond worth 5,000 gp",
      "Portal is two-way — things can come through from the other side",
      "When calling a creature, the creature is not obligated to aid you",
      "Requires concentration for the duration",
    ],
    availableTo: ["Cleric", "Sorcerer", "Wizard"],
    compatibleDestinations: "Any plane (specific location can be named)",
  },
  {
    id: "spell_astral_projection",
    category: "spell",
    name: "Astral Projection",
    spellLevel: 9,
    castingTime: "1 hour",
    components: "V, S, M (a jacinth worth 1,000+ gp and a bar of silver worth 100+ gp per creature)",
    description:
      "Projects up to 9 willing creatures into the Astral Plane as silver-corded spiritual forms. From the Astral, color pools lead to Outer Planes. Physical bodies remain behind in a comatose state.",
    limitations: [
      "Only reaches Astral Plane directly; must use color pools to go further",
      "Silver cord: if severed, the projecting creature dies immediately",
      "Bodies left behind are vulnerable",
      "Requires 1 hour casting time",
      "Very expensive material components per creature",
    ],
    availableTo: ["Cleric", "Wizard"],
    compatibleDestinations: "Astral Plane (and Outer Planes via color pools)",
  },
  {
    id: "spell_etherealness",
    category: "spell",
    name: "Etherealness",
    spellLevel: 7,
    castingTime: "1 action",
    components: "V, S",
    description:
      "Transports the caster into the Border Ethereal, where they can observe the Material Plane without interacting with it. Can move through solid objects in the Material. Lasts up to 8 hours.",
    limitations: [
      "Only reaches Border Ethereal, not the Deep Ethereal",
      "Cannot interact with Material Plane while ethereal",
      "Creatures with true seeing can see ethereal forms",
      "Does not reach any Outer or Inner Planes",
    ],
    availableTo: ["Bard", "Cleric", "Sorcerer", "Warlock", "Wizard"],
    compatibleDestinations: "Ethereal Plane (Border only)",
  },
  {
    id: "spell_misty_step",
    category: "spell",
    name: "Misty Step",
    spellLevel: 2,
    castingTime: "1 bonus action",
    components: "V",
    description:
      "Short-range teleport through the Border Ethereal — 30 ft. of unobstructed movement. Not true planar travel, but uses the Ethereal Plane as a conduit.",
    limitations: [
      "Only 30 ft. range",
      "Not true planar travel — cannot leave the Material Plane",
      "Does not function in Carceri (no exit)",
    ],
    availableTo: ["Sorcerer", "Warlock", "Wizard", "many others via subclass"],
    compatibleDestinations: "Material Plane only (short range)",
  },
  {
    id: "spell_word_of_recall",
    category: "spell",
    name: "Word of Recall",
    spellLevel: 6,
    castingTime: "1 action",
    components: "V",
    description:
      "Teleports the caster and up to 5 willing creatures to a designated sanctuary on the same plane. Must be pre-designated in a sacred space. Useful for emergency extraction.",
    limitations: [
      "Only teleports within the same plane",
      "Requires a pre-designated sanctuary",
      "Cleric only",
    ],
    availableTo: ["Cleric"],
    compatibleDestinations: "Same plane only (teleportation, not planar travel)",
  },

  // ── MAGIC ITEMS ──────────────────────────────────────────────────────────
  {
    id: "item_cubic_gate",
    category: "magic_item",
    name: "Cubic Gate",
    rarity: "legendary",
    description:
      "A 3-inch metal cube with six sides, each attuned to a different plane of existence. Pressing a side once opens a 10-ft. diameter portal to that plane; pressing it a second time sends one creature through.",
    charges: 6,
    recharge: "Rolls d6 on dawn; on a 1, the cube loses that side's function",
    limitations: [
      "Each side attuned at creation — cannot be changed",
      "Random chance of permanent function loss on recharge",
      "Portal can be used from either side",
      "Malfunction: On roll of 1 (side pressed), may send all creatures within 5 ft. through involuntarily",
    ],
    compatibleDestinations: "Six pre-attuned planes (set at item creation)",
    source: "DMG",
  },
  {
    id: "item_amulet_of_planes",
    category: "magic_item",
    name: "Amulet of the Planes",
    rarity: "very rare",
    requiresAttunement: true,
    description:
      "While attuned, the wearer can use an action to name a destination on another plane. Roll d20: on a 1–5, the amulet transports everyone within 15 ft. to a random plane. On 6+, the intended destination is reached.",
    limitations: [
      "1-in-4 chance of catastrophic failure (random plane destination)",
      "DC 15 Intelligence check required if the wearer doesn't know the destination plane",
      "Can affect unwilling creatures within 15 ft. on critical failures",
    ],
    compatibleDestinations: "Any named plane (with risk)",
    source: "DMG",
  },
  {
    id: "item_well_of_many_worlds",
    category: "magic_item",
    name: "Well of Many Worlds",
    rarity: "legendary",
    description:
      "A circular black cloth 6 ft. in diameter that, when spread on the ground, creates a two-way portal to a random plane or a DM-designated plane. Stays open until folded up or until a specific trigger closes it.",
    limitations: [
      "Destination may be random or DM-controlled",
      "Cannot choose specific location on destination plane",
      "Anyone can use the portal while it's open — including enemies",
      "Must be carried (cloth form)",
    ],
    compatibleDestinations: "Random or DM-chosen plane",
    source: "DMG",
  },
  {
    id: "item_portable_hole",
    category: "magic_item",
    name: "Portable Hole",
    rarity: "rare",
    description:
      "Technically not planar travel, but placing a portable hole inside a bag of holding (or vice versa) destroys both items and opens a gate to the Astral Plane, sucking everyone within 10 ft. through. One-way only.",
    limitations: [
      "Destroys both items",
      "One-way trip — no return portal",
      "Arrival point in Astral Plane is random",
      "Not a recommended travel method",
    ],
    compatibleDestinations: "Astral Plane only (uncontrolled)",
    source: "DMG",
    warning: "Emergency use / accidental planar travel only.",
  },
  {
    id: "item_iron_flask",
    category: "magic_item",
    name: "Iron Flask",
    rarity: "legendary",
    description:
      "Used to trap extraplanar creatures rather than travel. However, it is essential equipment for dealing with fiends, elementals, and other planar beings encountered during planar travel.",
    limitations: [
      "Only traps — does not transport the user",
      "Target must fail a DC 17 Wisdom save",
      "Can only hold one creature at a time",
    ],
    compatibleDestinations: "N/A — trapping tool, not travel",
    source: "DMG",
  },
  {
    id: "item_planar_compass",
    category: "magic_item",
    name: "Planar Compass (Rare Variant)",
    rarity: "rare",
    requiresAttunement: true,
    description:
      "An ornate compass with a needle that spins to point toward the nearest active portal on the current plane. Does not create portals but is invaluable for finding natural crossings.",
    limitations: [
      "Points to nearest portal — cannot select destination",
      "May point to a dangerous or unwanted portal",
      "Does not function in planar dead zones",
    ],
    compatibleDestinations: "Locates portals to any plane",
    source: "Setting-specific / Homebrew variant (DMG inspired)",
  },

  // ── NATURAL PORTALS ──────────────────────────────────────────────────────
  {
    id: "natural_portal",
    category: "natural",
    name: "Natural Portal",
    description:
      "Locations where the boundary between planes is permanently thin. These are physical places — doorways, standing stones, mountain peaks, cave mouths — that happen to sit at planar nexus points.",
    examples: [
      "Old stone archways in ancient forests (Feywild)",
      "Lava tube exits into volcanic mountains (Elemental Fire)",
      "Bottomless lake reflecting a moonless sky (Shadowfell)",
      "The eye of a permanent storm (Elemental Air)",
      "Seams of raw ore exposed by earthquake (Elemental Earth)",
    ],
    findingMethod: "Arcana DC 15 to detect; Nature DC 12 near natural portals; History DC 18 to recall from lore",
    stability: "Permanent but may have environmental triggers to activate",
    twoWay: true,
  },
  {
    id: "fey_crossing",
    category: "natural",
    name: "Fey Crossing",
    description:
      "Specific locations in the natural world where the barrier to the Feywild is so thin that walking through a particular spot, tree, stream, or stone circle transports the traveler. Often only visible under specific conditions.",
    examples: [
      "A ring of mushrooms at midnight",
      "A mossy doorway in an ancient oak",
      "A stream ford during a rainbow",
      "The center of a stone circle during a solstice",
      "A cave mouth wreathed in will-o'-wisps",
    ],
    activationConditions: [
      "Time of day (dawn, midnight)",
      "Moon phase (full moon most common)",
      "Seasonal alignment (equinox, solstice)",
      "Emotional state (genuine wonder or joy)",
      "Spoken phrase in Sylvan",
    ],
    findingMethod: "Perception DC 14 to notice the shimmer; Nature DC 10 to recognize it as a fey crossing",
    stability: "Semi-permanent; may close if the natural feature is disturbed",
    twoWay: true,
    compatibleDestinations: ["Feywild"],
  },
  {
    id: "shadow_crossing",
    category: "natural",
    name: "Shadow Crossing",
    description:
      "Points where the Shadowfell bleeds through into the Material Plane, usually in blighted lands, beneath cursed sites, in dungeons of great tragedy, or in locations touched by powerful necromancy.",
    examples: [
      "Beneath a battlefield where thousands died",
      "In the basement of a haunted manor",
      "Within a graveyard on Samhain",
      "The site of a shattered phylactery",
      "A cave that never sees sunlight",
    ],
    activationConditions: [
      "Night hours (especially midnight)",
      "Areas of magical darkness",
      "Locations saturated with necrotic energy",
      "Near undead concentrations",
    ],
    findingMethod: "Perception DC 14 (shadow crossing visible as an area of unnatural darkness); Arcana DC 12 to identify",
    stability: "Varies — strong crossings are permanent, weak ones only open during ideal conditions",
    twoWay: true,
    warning: "Shadow crossings attract undead. Finding one means undead likely patrol nearby.",
    compatibleDestinations: ["Shadowfell"],
  },
  {
    id: "planar_rift",
    category: "natural",
    name: "Planar Rift",
    description:
      "An uncontrolled tear in the fabric of reality, usually caused by cataclysmic magic, divine battles, or prolonged demonic/infernal incursion. Rifts are dangerous and unstable — they may expand, collapse, or shift destination.",
    examples: [
      "A scar in space left by a god's battle",
      "A tear caused by sustained Gate spam",
      "A demon lord's invasion entry point",
      "A failed archmage's planar binding",
    ],
    stability: "Unstable — may expand or collapse within hours to days",
    warning: "Things can and do come through from the other side. Rifts should be closed, not used for travel.",
    twoWay: true,
    compatibleDestinations: ["Varies — typically the plane being torn from"],
  },
];

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get a single plane by its ID.
 * @param {string} planeId - The plane's id field (e.g., "feywild", "nine_hells")
 * @returns {Object|undefined} The plane object, or undefined if not found
 */
export function getPlane(planeId) {
  return PLANES_OF_EXISTENCE.find((p) => p.id === planeId);
}

/**
 * Get the environmental effects for a specific plane, merged with
 * the PLANAR_EFFECTS categorical data.
 * @param {string} planeId - The plane's id field
 * @returns {{ plane: Object, effects: string[], categorized: Object }|null}
 */
export function getPlaneEffects(planeId) {
  const plane = getPlane(planeId);
  if (!plane) return null;

  // Build a categorized summary from PLANAR_EFFECTS based on the plane's known traits
  const categorized = {};

  // Gravity
  if (planeId === "astral" || planeId === "limbo") {
    categorized.gravity = PLANAR_EFFECTS.gravity.subjective_directional;
  } else if (planeId === "elemental_air") {
    categorized.gravity = PLANAR_EFFECTS.gravity.toward_mass;
  } else if (planeId === "gehenna") {
    categorized.gravity = PLANAR_EFFECTS.gravity.parallel_slope;
  } else {
    categorized.gravity = PLANAR_EFFECTS.gravity.normal;
  }

  // Time
  if (planeId === "astral") {
    categorized.time = PLANAR_EFFECTS.time.timeless;
  } else if (planeId === "feywild") {
    categorized.time = PLANAR_EFFECTS.time.feywild_warp;
  } else {
    categorized.time = PLANAR_EFFECTS.time.normal;
  }

  // Elemental dominance
  if (planeId === "positive_energy") {
    categorized.elemental = PLANAR_EFFECTS.elemental_dominance.positive;
  } else if (planeId === "negative_energy") {
    categorized.elemental = PLANAR_EFFECTS.elemental_dominance.negative;
  } else if (planeId === "elemental_fire") {
    categorized.elemental = PLANAR_EFFECTS.elemental_dominance.fire;
  } else if (planeId === "elemental_water") {
    categorized.elemental = PLANAR_EFFECTS.elemental_dominance.water;
  } else if (planeId === "elemental_earth") {
    categorized.elemental = PLANAR_EFFECTS.elemental_dominance.earth;
  } else if (planeId === "elemental_air") {
    categorized.elemental = PLANAR_EFFECTS.elemental_dominance.air;
  }

  // Psychic effects
  if (planeId === "astral") {
    categorized.psychic = PLANAR_EFFECTS.psychic.psychic_wind;
  } else if (planeId === "pandemonium") {
    categorized.psychic = PLANAR_EFFECTS.psychic.maddening_howl;
  } else if (planeId === "abyss") {
    categorized.psychic = PLANAR_EFFECTS.psychic.abyssal_corruption;
  } else if (planeId === "shadowfell") {
    categorized.psychic = PLANAR_EFFECTS.psychic.shadowfell_despair;
  } else if (planeId === "elysium") {
    categorized.psychic = PLANAR_EFFECTS.psychic.blissful_compulsion;
  } else if (planeId === "hades") {
    categorized.psychic = PLANAR_EFFECTS.psychic.soul_withering;
  }

  // Magic alterations
  if (planeId === "outlands") {
    categorized.magic = PLANAR_EFFECTS.magic.suppressed_near_spire;
  } else if (planeId === "arborea") {
    categorized.magic = PLANAR_EFFECTS.magic.enhanced_nature;
  } else if (planeId === "limbo") {
    categorized.magic = PLANAR_EFFECTS.magic.wild_chaos;
  } else if (planeId === "negative_energy") {
    categorized.magic = PLANAR_EFFECTS.magic.no_healing;
  } else if (planeId === "astral") {
    categorized.magic = PLANAR_EFFECTS.magic.no_time_spells;
  } else {
    categorized.magic = PLANAR_EFFECTS.magic.normal;
  }

  return {
    plane,
    effects: plane.environmentalEffects,
    survivalRules: plane.survivalRules,
    categorized,
  };
}

/**
 * Get all portal type definitions.
 * @returns {Object[]} Array of all PORTAL_TYPES
 */
export function getPortalTypes() {
  return PORTAL_TYPES;
}

/**
 * Get recommended travel methods for reaching a given destination plane.
 * Returns all methods, sorted so that ones with specific compatibility
 * for the destination appear first.
 * @param {string} destinationPlane - The id of the target plane
 * @returns {Object[]} Array of travel methods, most relevant first
 */
export function getTravelMethods(destinationPlane) {
  const plane = getPlane(destinationPlane);
  const planeType = plane ? plane.type : null;

  // Categorize methods by relevance to destination
  const scored = PLANAR_TRAVEL_METHODS.map((method) => {
    let score = 0;

    // Spells that go anywhere score high for all planes
    if (method.id === "spell_plane_shift") score += 10;
    if (method.id === "spell_gate") score += 9;

    // Astral Projection is only useful for Outer Planes (via color pools)
    if (method.id === "spell_astral_projection") {
      if (planeType === "outer") score += 8;
      else score += 2;
    }

    // Etherealness only goes to Ethereal
    if (method.id === "spell_etherealness") {
      if (destinationPlane === "ethereal") score += 10;
      else score += 0;
    }

    // Fey crossings only go to Feywild
    if (method.id === "fey_crossing") {
      if (destinationPlane === "feywild") score += 10;
      else score += 0;
    }

    // Shadow crossings only go to Shadowfell
    if (method.id === "shadow_crossing") {
      if (destinationPlane === "shadowfell") score += 10;
      else score += 0;
    }

    // Items are generally applicable
    if (method.category === "magic_item" && method.id !== "item_portable_hole") {
      score += 5;
    }

    // Natural portals and rifts are universal
    if (method.id === "natural_portal" || method.id === "planar_rift") score += 4;

    return { ...method, _relevanceScore: score };
  });

  return scored
    .filter((m) => m._relevanceScore > 0)
    .sort((a, b) => b._relevanceScore - a._relevanceScore)
    .map(({ _relevanceScore, ...method }) => method);
}

/**
 * Get all planes.
 * @returns {Object[]} Full PLANES_OF_EXISTENCE array
 */
export function getAllPlanes() {
  return PLANES_OF_EXISTENCE;
}

/**
 * Get all planes matching a given type.
 * @param {string} type - One of: "material", "echo", "transitive", "inner", "outer"
 * @returns {Object[]} Filtered array of plane objects
 */
export function getPlanesByType(type) {
  return PLANES_OF_EXISTENCE.filter((p) => p.type === type);
}
