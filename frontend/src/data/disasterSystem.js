/**
 * disasterSystem.js
 * Natural and magical disaster system for The Codex — D&D Companion
 *
 * Roadmap items covered:
 * - Natural disaster types with severity levels, area of effect, damage,
 *   save DCs, aftermath effects, and recovery times
 * - Magical disaster types with causes, effects, containment methods,
 *   and durations
 * - Disaster phases: warning signs, onset, peak, aftermath
 * - Population impact on settlements: casualties, displacement, infrastructure,
 *   economic and morale effects, and generated quest hooks
 * - Recovery mechanics: costs, timelines, workforce, PC bonuses, reputation
 */

// ---------------------------------------------------------------------------
// NATURAL_DISASTERS
// 10 types with severity levels: minor / moderate / major / catastrophic
// ---------------------------------------------------------------------------

export const NATURAL_DISASTERS = {
  earthquake: {
    id: "earthquake",
    label: "Earthquake",
    description:
      "The ground shakes violently, cracking earth, toppling structures, and triggering secondary hazards such as fires and landslides.",
    terrain: ["plains", "mountains", "urban", "dungeon", "underground"],
    severity: {
      minor: {
        areaOfEffect: "1-mile radius",
        duration: "1 minute",
        damage: "2d6 bludgeoning (falling debris)",
        saveDC: 12,
        saveType: "DEX",
        saveEffect: "half damage and not knocked prone",
        aftermathEffects: ["Cracked roads (difficult terrain)", "Minor structural damage", "Frightened animals"],
        recoveryTime: "1 week",
      },
      moderate: {
        areaOfEffect: "5-mile radius",
        duration: "3 minutes",
        damage: "4d6 bludgeoning",
        saveDC: 14,
        saveType: "DEX",
        saveEffect: "half damage",
        aftermathEffects: ["Collapsed buildings (10%)", "Ruptured wells", "Roads impassable", "Landslides possible"],
        recoveryTime: "1 month",
      },
      major: {
        areaOfEffect: "20-mile radius",
        duration: "5 minutes",
        damage: "6d8 bludgeoning",
        saveDC: 16,
        saveType: "DEX",
        saveEffect: "half damage",
        aftermathEffects: ["Widespread building collapse (40%)", "Fissures open (10-ft drops)", "Fires break out", "Flooding from broken dams"],
        recoveryTime: "6 months",
      },
      catastrophic: {
        areaOfEffect: "50-mile radius",
        duration: "10 minutes",
        damage: "8d10 bludgeoning",
        saveDC: 19,
        saveType: "DEX",
        saveEffect: "half damage",
        aftermathEffects: ["Total urban destruction (80%+)", "Massive fissures", "Tsunami if coastal", "Region-wide fires", "Planar instability possible"],
        recoveryTime: "2 years",
      },
    },
  },

  flood: {
    id: "flood",
    label: "Flood",
    description:
      "Rising waters submerge lowlands, threatening drowning and sweeping away structures and crops.",
    terrain: ["plains", "coastal", "river valley", "urban", "wetlands"],
    severity: {
      minor: {
        areaOfEffect: "1-mile radius",
        duration: "1d4 days",
        damage: "Drowning rules (CON DC 10 per round submerged)",
        saveDC: 10,
        saveType: "STR",
        saveEffect: "not swept away",
        aftermathEffects: ["Muddy difficult terrain", "Crop damage", "Minor structural damage"],
        recoveryTime: "2 weeks",
      },
      moderate: {
        areaOfEffect: "5-mile radius",
        duration: "1d6 days",
        damage: "2d6 bludgeoning (debris) + drowning",
        saveDC: 13,
        saveType: "STR",
        saveEffect: "not swept 30 ft downstream",
        aftermathEffects: ["Roads washed out", "Structures undermined", "Disease risk rises", "Harvest ruined"],
        recoveryTime: "2 months",
      },
      major: {
        areaOfEffect: "20-mile radius",
        duration: "1d10 days",
        damage: "4d6 bludgeoning + drowning",
        saveDC: 16,
        saveType: "STR",
        saveEffect: "not swept 60 ft and not submerged",
        aftermathEffects: ["Mass evacuation required", "Bridges destroyed", "Widespread disease", "Livestock lost"],
        recoveryTime: "8 months",
      },
      catastrophic: {
        areaOfEffect: "100-mile radius",
        duration: "2d6 weeks",
        damage: "6d8 bludgeoning + drowning",
        saveDC: 19,
        saveType: "STR",
        saveEffect: "not swept 120 ft and not submerged",
        aftermathEffects: ["Entire region submerged", "Permanent terrain change", "Famine follows", "Plague epidemic"],
        recoveryTime: "3 years",
      },
    },
  },

  wildfire: {
    id: "wildfire",
    label: "Wildfire",
    description:
      "Uncontrolled fire sweeps through forests, grasslands, or settlements, consuming everything in its path.",
    terrain: ["forest", "grassland", "hills", "urban outskirts"],
    severity: {
      minor: {
        areaOfEffect: "Half-mile radius",
        duration: "1d4 hours",
        damage: "2d6 fire per round in fire area",
        saveDC: 12,
        saveType: "DEX",
        saveEffect: "half fire damage that round",
        aftermathEffects: ["Scorched terrain (difficult terrain for 1 month)", "Smoke (lightly obscured 1 mile)"],
        recoveryTime: "3 months",
      },
      moderate: {
        areaOfEffect: "3-mile radius",
        duration: "1d6 hours",
        damage: "4d6 fire per round",
        saveDC: 14,
        saveType: "DEX",
        saveEffect: "half fire damage",
        aftermathEffects: ["Forest destroyed", "Ash fields (heavily obscured until rain)", "Wildlife displaced"],
        recoveryTime: "1 year",
      },
      major: {
        areaOfEffect: "15-mile radius",
        duration: "2d6 hours",
        damage: "6d6 fire per round",
        saveDC: 17,
        saveType: "DEX",
        saveEffect: "half fire damage",
        aftermathEffects: ["Region stripped of vegetation", "Toxic smoke (1 level exhaustion per hour without mask)", "Settlements burned"],
        recoveryTime: "3 years",
      },
      catastrophic: {
        areaOfEffect: "50-mile radius",
        duration: "1d4 days",
        damage: "8d6 fire per round",
        saveDC: 20,
        saveType: "DEX",
        saveEffect: "half fire damage",
        aftermathEffects: ["Entire biome destroyed", "Ash winter (crops fail for a season)", "Air toxic for weeks"],
        recoveryTime: "10 years",
      },
    },
  },

  volcanicEruption: {
    id: "volcanicEruption",
    label: "Volcanic Eruption",
    description:
      "A volcano expels magma, ash, and pyroclastic flows across the surrounding region.",
    terrain: ["mountains", "island", "fire planes adjacent"],
    severity: {
      minor: {
        areaOfEffect: "2-mile radius",
        duration: "1d4 hours",
        damage: "2d8 fire (falling ash and embers)",
        saveDC: 13,
        saveType: "DEX",
        saveEffect: "half fire damage",
        aftermathEffects: ["Ash fall (difficult terrain)", "Acid rain (1d4 days)", "Minor lava flows"],
        recoveryTime: "2 months",
      },
      moderate: {
        areaOfEffect: "10-mile radius",
        duration: "1d6 hours",
        damage: "4d8 fire + 2d6 poison (toxic gases)",
        saveDC: 15,
        saveType: "CON",
        saveEffect: "not poisoned for 1 hour",
        aftermathEffects: ["Lava fields (impassable terrain)", "Pyroclastic zones", "Ash blizzard blocks sight"],
        recoveryTime: "1 year",
      },
      major: {
        areaOfEffect: "30-mile radius",
        duration: "1d4 days",
        damage: "6d10 fire (pyroclastic flow contact)",
        saveDC: 18,
        saveType: "DEX",
        saveEffect: "half damage, still on fire (1d10/round)",
        aftermathEffects: ["Settlements buried in ash", "Permanent terrain change", "Volcanic winter (global crop penalties)"],
        recoveryTime: "5 years",
      },
      catastrophic: {
        areaOfEffect: "100-mile radius",
        duration: "1d2 weeks",
        damage: "10d10 fire (pyroclastic flow, no save in zone)",
        saveDC: 22,
        saveType: "CON",
        saveEffect: "survive toxic gas cloud (CON save or die)",
        aftermathEffects: ["Region uninhabitable for decades", "Global ash cloud", "Planar thinning near caldera"],
        recoveryTime: "50 years",
      },
    },
  },

  tsunami: {
    id: "tsunami",
    label: "Tsunami",
    description:
      "A massive ocean wave triggered by seismic or magical activity crashes into coastlines with devastating force.",
    terrain: ["coastal", "island", "river delta"],
    severity: {
      minor: {
        areaOfEffect: "1 mile inland",
        duration: "1d4 hours (flooding remains)",
        damage: "4d8 bludgeoning (wave impact)",
        saveDC: 14,
        saveType: "STR",
        saveEffect: "not swept 1d6 × 10 ft",
        aftermathEffects: ["Coastal flooding", "Dock destruction", "Saltwater crop damage"],
        recoveryTime: "3 months",
      },
      moderate: {
        areaOfEffect: "5 miles inland",
        duration: "2d6 hours",
        damage: "6d8 bludgeoning",
        saveDC: 16,
        saveType: "STR",
        saveEffect: "not swept 1d6 × 30 ft",
        aftermathEffects: ["Harbor destroyed", "Fishing industry crippled", "Mass drowning casualties"],
        recoveryTime: "1 year",
      },
      major: {
        areaOfEffect: "20 miles inland",
        duration: "1d4 days",
        damage: "8d10 bludgeoning",
        saveDC: 19,
        saveType: "STR",
        saveEffect: "not drowned immediately (still submerged)",
        aftermathEffects: ["Coastal cities obliterated", "Inland flooding for weeks", "Saltwater aquifer contamination"],
        recoveryTime: "5 years",
      },
      catastrophic: {
        areaOfEffect: "50+ miles inland",
        duration: "Weeks of flooding",
        damage: "10d10 bludgeoning (unsurvivable in epicenter)",
        saveDC: 22,
        saveType: "STR",
        saveEffect: "survive and be swept 300 ft",
        aftermathEffects: ["Entire coastline reshaped", "Nation-level casualties", "Trade network collapse"],
        recoveryTime: "20 years",
      },
    },
  },

  tornado: {
    id: "tornado",
    label: "Tornado",
    description:
      "A violent rotating column of air tears through terrain, hurling debris and destroying everything in its path.",
    terrain: ["plains", "grassland", "hills", "urban"],
    severity: {
      minor: {
        areaOfEffect: "100-ft wide, 1-mile path",
        duration: "1d10 minutes",
        damage: "2d6 bludgeoning (debris)",
        saveDC: 13,
        saveType: "STR",
        saveEffect: "not lifted 20 ft into air",
        aftermathEffects: ["Downed trees (difficult terrain)", "Minor structural damage"],
        recoveryTime: "1 week",
      },
      moderate: {
        areaOfEffect: "300-ft wide, 5-mile path",
        duration: "2d10 minutes",
        damage: "4d6 bludgeoning",
        saveDC: 15,
        saveType: "STR",
        saveEffect: "not lifted 60 ft (fall damage on landing)",
        aftermathEffects: ["Buildings destroyed", "Debris field (difficult terrain, 1 mile)"],
        recoveryTime: "2 months",
      },
      major: {
        areaOfEffect: "Half-mile wide, 20-mile path",
        duration: "1d4 hours",
        damage: "6d8 bludgeoning",
        saveDC: 17,
        saveType: "STR",
        saveEffect: "not lifted 120 ft",
        aftermathEffects: ["Town leveled", "Debris scattered 5-mile radius"],
        recoveryTime: "1 year",
      },
      catastrophic: {
        areaOfEffect: "1-mile wide, 50-mile path",
        duration: "2d4 hours",
        damage: "8d10 bludgeoning",
        saveDC: 20,
        saveType: "STR",
        saveEffect: "not lifted 300 ft (survivable only with magic)",
        aftermathEffects: ["Multiple settlements destroyed", "Terrain permanently altered"],
        recoveryTime: "5 years",
      },
    },
  },

  avalanche: {
    id: "avalanche",
    label: "Avalanche",
    description:
      "A mass of snow, ice, and rock cascades down a mountain slope, burying everything below.",
    terrain: ["mountains", "hills", "arctic"],
    severity: {
      minor: {
        areaOfEffect: "500-ft path",
        duration: "1 minute",
        damage: "4d6 bludgeoning",
        saveDC: 12,
        saveType: "DEX",
        saveEffect: "escape path, half damage",
        aftermathEffects: ["Trail blocked (requires 2d6 hours to clear)", "Possible stranded travelers"],
        recoveryTime: "Until spring thaw",
      },
      moderate: {
        areaOfEffect: "2,000-ft path",
        duration: "1d4 minutes",
        damage: "6d8 bludgeoning + buried (suffocation rules)",
        saveDC: 15,
        saveType: "DEX",
        saveEffect: "dodge to edge, half damage",
        aftermathEffects: ["Mountain pass blocked", "Rescue operations needed", "Structures crushed"],
        recoveryTime: "2 months",
      },
      major: {
        areaOfEffect: "1-mile path",
        duration: "1d6 minutes",
        damage: "8d10 bludgeoning",
        saveDC: 17,
        saveType: "DEX",
        saveEffect: "half damage, still buried",
        aftermathEffects: ["Village buried", "Pass closed for a season", "Survivors trapped underground"],
        recoveryTime: "6 months",
      },
      catastrophic: {
        areaOfEffect: "5-mile path",
        duration: "10 minutes",
        damage: "10d10 bludgeoning (no save for buried)",
        saveDC: 20,
        saveType: "DEX",
        saveEffect: "flee on reaction or be buried",
        aftermathEffects: ["Entire valley buried", "Mountain terrain permanently reshaped"],
        recoveryTime: "Years (excavation)"},
    },
  },

  drought: {
    id: "drought",
    label: "Drought",
    description:
      "An extended period of abnormally low rainfall causes water scarcity, crop failure, and famine.",
    terrain: ["plains", "desert", "savanna", "farmland"],
    severity: {
      minor: {
        areaOfEffect: "50-mile region",
        duration: "1d4 months",
        damage: "1 level of exhaustion per week without extra water rations",
        saveDC: 10,
        saveType: "CON",
        saveEffect: "resist exhaustion from heat and dehydration",
        aftermathEffects: ["Crop yield -25%", "Water prices triple", "Minor civil unrest"],
        recoveryTime: "Next rainy season",
      },
      moderate: {
        areaOfEffect: "200-mile region",
        duration: "1d6 months",
        damage: "1 level exhaustion per 2 days without water",
        saveDC: 13,
        saveType: "CON",
        saveEffect: "resist exhaustion",
        aftermathEffects: ["Crop yield -60%", "Water rationing", "Mass livestock deaths", "Refugees"],
        recoveryTime: "6 months after rain",
      },
      major: {
        areaOfEffect: "500-mile region",
        duration: "1d2 years",
        damage: "Exhaustion levels escalate without magical water sources",
        saveDC: 15,
        saveType: "CON",
        saveEffect: "resist exhaustion",
        aftermathEffects: ["Famine", "Mass migration", "War over water rights", "Desert encroachment"],
        recoveryTime: "2 years",
      },
      catastrophic: {
        areaOfEffect: "Continental",
        duration: "2d4 years",
        damage: "Exhaustion per day without magical hydration",
        saveDC: 18,
        saveType: "CON",
        saveEffect: "resist escalating exhaustion",
        aftermathEffects: ["Civilization collapse possible", "Nation-scale famine", "Permanent desertification"],
        recoveryTime: "Decade or never",
      },
    },
  },

  plague: {
    id: "plague",
    label: "Plague",
    description:
      "A deadly disease spreads rapidly through populations, causing mass illness and death.",
    terrain: ["urban", "rural", "any dense population"],
    severity: {
      minor: {
        areaOfEffect: "Single settlement",
        duration: "2d4 weeks",
        damage: "1d6 CON damage per day (failed CON DC save)",
        saveDC: 12,
        saveType: "CON",
        saveEffect: "not infected that day",
        aftermathEffects: ["10% population sick", "Market closed", "Travel quarantine"],
        recoveryTime: "1 month",
      },
      moderate: {
        areaOfEffect: "50-mile region",
        duration: "2d6 weeks",
        damage: "2d6 CON damage per day",
        saveDC: 15,
        saveType: "CON",
        saveEffect: "not infected (must save each exposure)",
        aftermathEffects: ["30% population affected", "Healer shortages", "Roads closed", "Religious panic"],
        recoveryTime: "6 months",
      },
      major: {
        areaOfEffect: "Nation-wide",
        duration: "2d4 months",
        damage: "3d6 CON damage per day; 0 CON = death",
        saveDC: 17,
        saveType: "CON",
        saveEffect: "not infected that week",
        aftermathEffects: ["50% mortality rate", "Economic collapse", "Undead risk from unburied dead", "Government disruption"],
        recoveryTime: "2 years",
      },
      catastrophic: {
        areaOfEffect: "Continental",
        duration: "1d2 years",
        damage: "4d6 CON damage per day; highly lethal",
        saveDC: 20,
        saveType: "CON",
        saveEffect: "resist for 1 week",
        aftermathEffects: ["Civilization-ending mortality", "Undead epidemic possible", "Permanent demographic change"],
        recoveryTime: "Generation",
      },
    },
  },

  meteorStrike: {
    id: "meteorStrike",
    label: "Meteor Strike",
    description:
      "A rock from space — or the heavens — impacts the surface with devastating explosive force.",
    terrain: ["any"],
    severity: {
      minor: {
        areaOfEffect: "100-ft radius",
        duration: "Instantaneous + 1d4 hours fire",
        damage: "8d6 fire + 4d6 bludgeoning",
        saveDC: 15,
        saveType: "DEX",
        saveEffect: "half damage",
        aftermathEffects: ["Crater (30-ft diameter)", "Surrounding fires", "Valuable ore possible"],
        recoveryTime: "1 month",
      },
      moderate: {
        areaOfEffect: "1-mile radius",
        duration: "Instantaneous + wildfires",
        damage: "10d10 fire + 6d10 bludgeoning",
        saveDC: 18,
        saveType: "DEX",
        saveEffect: "half damage",
        aftermathEffects: ["Settlement leveled", "Fires for miles", "Crater lake possible", "Strange metal fragments"],
        recoveryTime: "1 year",
      },
      major: {
        areaOfEffect: "20-mile blast radius",
        duration: "Instantaneous; fires for weeks",
        damage: "20d10 fire + bludgeoning (unsurvivable at ground zero)",
        saveDC: 22,
        saveType: "DEX",
        saveEffect: "survive if beyond 5-mile radius (half damage)",
        aftermathEffects: ["Region obliterated", "Ash cloud blocks sun", "Shockwave felt 500 miles", "Earthquakes triggered"],
        recoveryTime: "Decades",
      },
      catastrophic: {
        areaOfEffect: "500-mile blast radius",
        duration: "Years of environmental impact",
        damage: "Extinction-level (no save at ground zero)",
        saveDC: 25,
        saveType: "CON",
        saveEffect: "survive fallout if sheltered (1d6 exhaustion per day for weeks)",
        aftermathEffects: ["Impact winter", "Mass extinction event", "Planar disturbance", "Crater becomes sea"],
        recoveryTime: "Century",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// MAGICAL_DISASTERS
// 8 types with cause, effects, containment, duration
// ---------------------------------------------------------------------------

export const MAGICAL_DISASTERS = {
  wildMagicStorm: {
    id: "wildMagicStorm",
    label: "Wild Magic Storm",
    cause:
      "Ley line rupture, failed ritual, or Weave damage from a major magical battle.",
    effects: [
      "All spells trigger a wild magic surge (roll d20; on 1-10, roll Wild Magic Surge table)",
      "Concentration spells break on any damage",
      "Random teleportation (DC 15 Arcana or teleport 1d6 × 10 ft in random direction each round)",
      "Spellcasters take 1d6 psychic damage per spell level cast",
    ],
    containmentMethods: [
      "Suppress ley line with a Dispel Magic (DC 20) at the epicenter",
      "Complete the interrupted ritual with a DC 22 Arcana check",
      "All spellcasters in the area simultaneously cast Calm Emotions (group DC 18)",
    ],
    duration: "1d6 hours; reoccurs until containment",
    areaOfEffect: "5-mile radius per hour until contained",
    severity: "Moderate to catastrophic depending on Weave damage depth",
  },

  planarRift: {
    id: "planarRift",
    label: "Planar Rift",
    cause:
      "Botched planar travel, demon summoning gone wrong, or deliberate tearing of reality.",
    effects: [
      "Creatures from adjacent plane emerge each hour (roll random encounter table for that plane)",
      "Local physics altered (gravity, time, or elemental type may shift in zone)",
      "Madness checks (DC 14 WIS) for creatures within 100 ft of rift",
      "Spells of 6th level or higher have 25% chance to be absorbed into rift",
    ],
    containmentMethods: [
      "Seal with Gate or Plane Shift targeting the rift (DC 20)",
      "Place four Forbiddance spell anchors around the rift perimeter",
      "Destroy the object or creature sustaining the rift",
    ],
    duration: "Permanent until sealed; grows 10 ft per day",
    areaOfEffect: "Starts 10-ft diameter; grows daily",
    severity: "Major to catastrophic",
  },

  manaDrain: {
    id: "manaDrain",
    label: "Mana Drain",
    cause:
      "Overuse of magical resources, anti-magic artifact activation, or deity withdrawing divine favor.",
    effects: [
      "Spellcasters lose one spell slot of their highest available level at dawn",
      "All spell save DCs reduced by 3",
      "Magical items have a 10% chance to be suppressed (non-functional) each day",
      "Healing spells restore half the normal amount",
    ],
    containmentMethods: [
      "Find and destroy the mana siphon artifact (Investigation DC 18, then smash)",
      "Ritually restore balance with a week-long Ceremony spell (requires 5+ spellcasters)",
      "Seek divine intervention from a deity associated with magic",
    ],
    duration: "1d4 weeks per severity level",
    areaOfEffect: "50-mile radius",
    severity: "Moderate — worsens to major if unchecked",
  },

  arcaneExplosion: {
    id: "arcaneExplosion",
    label: "Arcane Explosion",
    cause:
      "Unstable magical construct detonating, Astral Projection gone catastrophically wrong, or spell feedback loop.",
    effects: [
      "Initial blast: 10d10 force damage in 300-ft radius (DEX DC 18 for half)",
      "Aftershock waves every 1d4 rounds for 1 hour: 4d6 force damage (DC 14 DEX, half)",
      "Residual magic: random spells fire from the epicenter each round for 1d10 rounds",
      "Dead magic zone at epicenter (200 ft) for 1d6 weeks",
    ],
    containmentMethods: [
      "Survive the initial explosion; aftershocks diminish naturally",
      "Cast Antimagic Field at epicenter to stabilize residual surges",
      "Dispel Magic (upcasted to 7th level) can end aftershock loop",
    ],
    duration: "Initial: instantaneous. Aftershocks: 1 hour. Dead zone: 1d6 weeks",
    areaOfEffect: "Initial 300-ft; aftershocks 500-ft; dead zone 200-ft epicenter",
    severity: "Major",
  },

  undeadUprising: {
    id: "undeadUprising",
    label: "Undead Uprising",
    cause:
      "Mass burial ground desecrated, necromantic ritual, ley line channeling death energy, or failed divine ward.",
    effects: [
      "All corpses in area animate as zombies or skeletons within 1d4 hours of death",
      "Undead in area gain +2 to attacks and cannot be turned for 1d6 hours after uprising begins",
      "Necrotic damage in area heals undead instead of harming them",
      "Living creatures in area must make DC 13 WIS save each dawn or gain 1 level of exhaustion from dread",
    ],
    containmentMethods: [
      "Consecrate the burial ground with Hallow (4-hour cast, DC 15 Religion to maintain under pressure)",
      "Destroy the necromantic focus driving the uprising",
      "Channel Divinity or class features that repel/destroy undead used at the source",
    ],
    duration: "Until source is removed; new undead rise daily",
    areaOfEffect: "1-mile radius per day if unchecked",
    severity: "Moderate to catastrophic",
  },

  elementalConvergence: {
    id: "elementalConvergence",
    label: "Elemental Convergence",
    cause:
      "Multiple elemental nodes aligning, elemental prince manifesting, or collapsed barrier between Prime and Elemental Planes.",
    effects: [
      "All four elements become chaotically active: random elemental effects per round (roll d4: 1=fire, 2=ice, 3=lightning, 4=earth)",
      "Elementals of all types spawn every 1d4 rounds",
      "Terrain shifts: lava flows, ice walls, lightning storms, and geysers appear unpredictably",
      "Resistance/immunity to one element removed for all creatures; vulnerability to another added (roll for each)",
    ],
    containmentMethods: [
      "Banish or defeat the elemental princes driving the convergence",
      "Seal all four elemental nodes simultaneously (requires four spellcasters, DC 16 each)",
      "Use a Wish spell to directly close the convergence",
    ],
    duration: "2d6 days",
    areaOfEffect: "10-mile radius",
    severity: "Major to catastrophic",
  },

  timeDistortion: {
    id: "timeDistortion",
    label: "Time Distortion",
    cause:
      "Failed time-travel attempt, chronomancer's death mid-ritual, or Mechanus gear slippage.",
    effects: [
      "Initiative rolls reset every round (everyone re-rolls, time feels inconsistent)",
      "Random aging: each creature ages 1d20 years (up or down) on failed DC 15 CON save each day",
      "Echoes of past and future appear as illusions (Investigation DC 16 to distinguish from real threats)",
      "Spells with duration roll 1d6 each round: 1-2 immediately end, 3-4 normal, 5-6 extended by 1 hour",
    ],
    containmentMethods: [
      "Reverse the triggering event via a ritual requiring a Wish or Legend Lore",
      "Attune and destroy a Clockwork Amulet artifact found in the distortion's core",
      "Get a Modron or Inevitables to voluntarily enter the zone and anchor time (Persuasion DC 22)",
    ],
    duration: "1d10 days",
    areaOfEffect: "1-mile radius",
    severity: "Major",
  },

  realityFracture: {
    id: "realityFracture",
    label: "Reality Fracture",
    cause:
      "Overdeity conflict, use of a Sphere of Annihilation in a ley nexus, or existential-level spell misfire.",
    effects: [
      "Rules of reality break: gravity may reverse, fire may freeze, death saves always fail or always succeed each day (roll randomly)",
      "Creatures may split into alternate versions of themselves (DC 20 WIS or act on alternate-reality impulses)",
      "Matter becomes unstable: nonmagical objects have a 5% chance to simply cease to exist each round",
      "Spell effects are unpredictable: all spell outcomes rerolled with a random secondary effect",
      "Divine magic fails entirely within the fracture's core (1,000-ft radius)",
    ],
    containmentMethods: [
      "Intervention of a deity or similarly powerful entity",
      "Simultaneous Wish spells from three separate casters targeting the fracture",
      "Sacrifice a major artifact to serve as a 'patch' for reality (DM discretion on required item)",
    ],
    duration: "Permanent until sealed; fracture grows 500 ft per day",
    areaOfEffect: "Starts 1-mile radius; grows daily",
    severity: "Catastrophic",
  },
};

// ---------------------------------------------------------------------------
// DISASTER_PHASES
// 4 phases: warning signs, onset, peak, aftermath
// ---------------------------------------------------------------------------

export const DISASTER_PHASES = {
  warningSigns: {
    id: "warningSigns",
    label: "Warning Signs",
    description:
      "Subtle environmental, social, or magical cues that a disaster is imminent. Perceptive characters or locals may notice something is wrong.",
    timing: "1d6 days to hours before onset (DM discretion)",
    checkTypes: [
      { skill: "Nature", DC: 13, result: "Identify natural disaster type and rough timeline" },
      { skill: "Arcana", DC: 14, result: "Identify magical disaster type; detect Weave disturbance" },
      { skill: "Survival", DC: 12, result: "Notice animal exodus, weather pattern breaks, strange smells" },
      { skill: "History", DC: 15, result: "Recall prior disasters of this type and likely severity" },
      { skill: "Religion", DC: 13, result: "Divine omen reading; sense deity displeasure or warning" },
    ],
    dmActions: [
      "Drop environmental clues into descriptions (animals fleeing, ground tremors, odd smells)",
      "Have NPCs voice concerns or rumors at a tavern",
      "Allow passive Perception DC 10 to notice obvious signs; active checks for specifics",
      "Telegraph severity through frequency and intensity of signs",
    ],
    playerOpportunities: [
      "Warn the settlement and help with evacuation planning",
      "Investigate the source (especially for magical disasters)",
      "Gather resources and supplies before disaster hits",
      "Attempt to prevent the disaster entirely if a source can be found and stopped",
    ],
  },

  onset: {
    id: "onset",
    label: "Onset",
    description:
      "The disaster begins. Immediate danger manifests but has not yet reached full intensity.",
    timing: "First 1d10 minutes of the event",
    checkTypes: [
      { skill: "Athletics", DC: 13, result: "Move through difficult terrain created by disaster" },
      { skill: "Acrobatics", DC: 12, result: "Avoid initial falling debris or hazards" },
      { skill: "Medicine", DC: 12, result: "Stabilize injured NPCs during early chaos" },
      { skill: "Persuasion", DC: 14, result: "Organize panicking crowd; prevent trampling" },
    ],
    dmActions: [
      "Describe sudden environmental change dramatically",
      "Present immediate choices: flee, shelter, rescue others",
      "Begin tracking time pressure",
      "Introduce the first mechanical hazard (saving throw or skill check)",
    ],
    playerOpportunities: [
      "Rescue specific NPCs before the disaster peaks",
      "Retrieve valuable or important items before loss",
      "Attempt early containment or mitigation (especially magical disasters)",
      "Secure a safe shelter for the party and allies",
    ],
  },

  peak: {
    id: "peak",
    label: "Peak",
    description:
      "Maximum danger. Saves are required, damage is highest, and conditions are most dangerous. Survival is the primary goal.",
    timing: "Core duration of the disaster (see type-specific data)",
    checkTypes: [
      { skill: "Save (type varies)", DC: "See disaster type", result: "Avoid maximum damage" },
      { skill: "CON Save", DC: 14, result: "Resist exhaustion from extreme conditions" },
      { skill: "Athletics", DC: 15, result: "Hold position in wind, water, or debris" },
      { skill: "Arcana", DC: 17, result: "Identify containment opportunity for magical disaster" },
    ],
    dmActions: [
      "Apply full mechanical damage and hazards per disaster type and severity",
      "Force multiple saves per round or per turn as appropriate",
      "Introduce secondary hazards (collapse, flooding, fire spread)",
      "Keep time pressure active; use countdown or visible escalation",
      "Allow heroic actions (spend HD, burn resources) to protect others",
    ],
    playerOpportunities: [
      "Execute containment if magical source has been found",
      "Pull off heroic rescues at great personal risk",
      "Discover disaster-related treasure (rare ore from meteor, artifact in rift)",
      "Earn long-term NPC loyalty through self-sacrifice or bravery",
    ],
  },

  aftermath: {
    id: "aftermath",
    label: "Aftermath",
    description:
      "The disaster has passed. Destruction is surveyed, the injured are treated, and the long road to recovery begins.",
    timing: "Immediately after peak; extends for weeks or months",
    checkTypes: [
      { skill: "Medicine", DC: 12, result: "Stabilize dying NPCs; treat injuries" },
      { skill: "Investigation", DC: 13, result: "Assess structural damage and find survivors" },
      { skill: "Survival", DC: 12, result: "Find clean water and food in disaster zone" },
      { skill: "Persuasion", DC: 14, result: "Restore morale and organize recovery effort" },
      { skill: "Nature/Arcana", DC: 15, result: "Determine if secondary disasters are likely" },
    ],
    dmActions: [
      "Describe the devastation honestly and emotionally",
      "Introduce survivors with specific needs that become quest hooks",
      "Present the scale of rebuilding needed",
      "Roll for secondary disasters (aftershocks, secondary fires, disease) if severity was major+",
      "Award inspiration or story beats for heroic actions during peak",
    ],
    playerOpportunities: [
      "Lead or fund reconstruction for reputation gains",
      "Investigate the root cause of the disaster",
      "Distribute aid; earn faction favor or religious blessing",
      "Discover hidden things revealed by the disaster (buried ruins, exposed ore, new caves)",
      "Prevent opportunistic threats (looters, monsters moving into vacated area)",
    ],
  },
};

// ---------------------------------------------------------------------------
// POPULATION_IMPACT
// How disasters affect settlements by severity
// ---------------------------------------------------------------------------

export const POPULATION_IMPACT = {
  minor: {
    severityLabel: "Minor",
    casualties: { percentage: "1–3%", description: "Few deaths, mostly injuries" },
    displacement: { percentage: "5–10%", description: "Temporary evacuation of the most affected areas" },
    infrastructureDamage: {
      roads: "Cracked/damaged, passable with caution",
      buildings: "5–10% damaged; none destroyed",
      utilities: "Wells, granaries partially affected",
      defenses: "Walls intact",
    },
    economicImpact: {
      tradeDisruption: "1d4 weeks",
      cropLoss: "10–20%",
      goldCostToSettlement: "50–200 gp per 100 residents",
      taxRevenueReduction: "15% for 1 month",
    },
    moraleImpact: {
      initialMorale: -1,
      recoveryRate: "Full recovery in 1 month with no PC help",
      panicLevel: "Low; people scared but functional",
    },
    questHooksGenerated: [
      "Recover a lost family heirloom buried in rubble",
      "Drive off opportunistic bandits who arrived during chaos",
      "Find the cause if the disaster was magical",
      "Help the healer who is overwhelmed with the injured",
    ],
  },

  moderate: {
    severityLabel: "Moderate",
    casualties: { percentage: "5–15%", description: "Significant death toll; mass injuries" },
    displacement: { percentage: "20–40%", description: "Substantial population flees or is forced out" },
    infrastructureDamage: {
      roads: "Major roads blocked or destroyed",
      buildings: "25–40% destroyed; 40% damaged",
      utilities: "Wells contaminated; granary lost",
      defenses: "Walls breached in places",
    },
    economicImpact: {
      tradeDisruption: "1d4 months",
      cropLoss: "40–60%",
      goldCostToSettlement: "500–2,000 gp per 100 residents",
      taxRevenueReduction: "50% for 3 months",
    },
    moraleImpact: {
      initialMorale: -3,
      recoveryRate: "Partial recovery in 3 months; full in 1 year without help",
      panicLevel: "Moderate; some civil unrest, possible looting",
    },
    questHooksGenerated: [
      "Track missing persons in the disaster zone",
      "Retrieve the mayor/lord who is trapped in collapsed building",
      "Prevent a disease outbreak from developing among the displaced",
      "Investigate whether the disaster was deliberately caused",
      "Negotiate emergency supplies from a neighboring settlement",
      "Stop a cult claiming the disaster as divine punishment",
    ],
  },

  major: {
    severityLabel: "Major",
    casualties: { percentage: "20–40%", description: "Mass death; community devastated" },
    displacement: { percentage: "60–80%", description: "Most residents flee; few remain" },
    infrastructureDamage: {
      roads: "Completely destroyed; terrain altered",
      buildings: "60–80% destroyed",
      utilities: "All utilities destroyed",
      defenses: "Walls collapsed; settlement defenseless",
    },
    economicImpact: {
      tradeDisruption: "6–12 months",
      cropLoss: "80–100%",
      goldCostToSettlement: "5,000–20,000 gp per 100 residents",
      taxRevenueReduction: "90% for 1 year",
    },
    moraleImpact: {
      initialMorale: -5,
      recoveryRate: "Requires active PC involvement; 2–5 years otherwise",
      panicLevel: "High; riots, abandonment, desperate measures",
    },
    questHooksGenerated: [
      "Escort survivors to safety across dangerous terrain",
      "Recover the town charter, seal, or treasury from ruins",
      "Unite the scattered population to return and rebuild",
      "Defend the ruins from monsters that have moved in",
      "Arrange for noble or guild funding for reconstruction",
      "Find a new water source after wells are destroyed",
      "Investigate the magical or unnatural cause of the disaster",
      "Prevent a neighboring faction from claiming the abandoned land",
    ],
  },

  catastrophic: {
    severityLabel: "Catastrophic",
    casualties: { percentage: "50–90%", description: "Near-total population loss" },
    displacement: { percentage: "90–100%", description: "Settlement functionally abandoned" },
    infrastructureDamage: {
      roads: "Terrain unrecognizable; new map needed",
      buildings: "Total destruction",
      utilities: "Nothing functional",
      defenses: "Nothing remains",
    },
    economicImpact: {
      tradeDisruption: "Years",
      cropLoss: "100%; land may be unusable",
      goldCostToSettlement: "Essentially unlimited; requires kingdom-level aid",
      taxRevenueReduction: "100% indefinitely",
    },
    moraleImpact: {
      initialMorale: -10,
      recoveryRate: "Generational; requires extraordinary effort to reclaim",
      panicLevel: "Collapse; no functioning society remains",
    },
    questHooksGenerated: [
      "Save any survivors still trapped in the ruins",
      "Prevent the dead from rising as undead (if necrotic energy is present)",
      "Recover legendary artifacts or documents before they are lost forever",
      "Investigate the apocalyptic cause (deity's wrath, villain's scheme)",
      "Forge a new settlement from the survivors elsewhere",
      "Negotiate for kingdom or allied-nation disaster relief on a massive scale",
      "Stop a villain leveraging the power vacuum left by the disaster",
      "Perform a major ritual to begin healing the land itself",
    ],
  },
};

// ---------------------------------------------------------------------------
// RECOVERY_MECHANICS
// Rebuilding costs, timelines, workforce, PC involvement, reputation gains
// ---------------------------------------------------------------------------

export const RECOVERY_MECHANICS = {
  minor: {
    severityLabel: "Minor",
    costInGold: { min: 200, max: 1000, perResident: 2 },
    timeInWeeks: { min: 1, max: 4 },
    workforceNeeded: "Local population sufficient; no outside help required",
    workforceCount: "50% of adult population for 1–4 weeks",
    stages: [
      { stage: "Triage", week: 1, description: "Clear debris, treat injured, restore basic water access" },
      { stage: "Repair", week: 2, description: "Patch buildings, reopen roads, restock markets" },
      { stage: "Stabilize", weeks: "3–4", description: "Restore normal function; morale recovers" },
    ],
    pcInvolvementBonuses: {
      goldDonated: "Each 50 gp donated reduces recovery time by 1 day",
      laborProvided: "Each day of physical labor by PC counts as 5 workers",
      magicApplied: "Mending, Fabricate, Stone Shape spells count as 50 workers per cast",
      organizingRolls: "DC 13 Persuasion/Leadership reduces recovery time by 3 days per success",
    },
    reputationGains: {
      local: "+1 renown with settlement",
      faction: "+1 renown with aligned faction if involved",
      story: "Minor NPCs become friendly; small favor owed",
    },
  },

  moderate: {
    severityLabel: "Moderate",
    costInGold: { min: 2000, max: 10000, perResident: 20 },
    timeInWeeks: { min: 4, max: 16 },
    workforceNeeded: "Outside labor and supplies required",
    workforceCount: "Full local adult population + 100–500 outside workers for 4–16 weeks",
    stages: [
      { stage: "Emergency Relief", weeks: "1–2", description: "Food, water, shelter for displaced; prevent disease" },
      { stage: "Demolition & Salvage", weeks: "3–5", description: "Remove unstable structures; salvage usable materials" },
      { stage: "Foundation Rebuild", weeks: "6–10", description: "Rebuild infrastructure: roads, wells, walls" },
      { stage: "Restoration", weeks: "11–16", description: "Restore homes, shops, civic buildings; return displaced residents" },
    ],
    pcInvolvementBonuses: {
      goldDonated: "Each 200 gp donated reduces recovery time by 3 days",
      laborProvided: "Each day of physical labor counts as 20 workers",
      magicApplied: "Spells providing construction aid count as 200 workers per cast",
      organizingRolls: "DC 14 Persuasion/Leadership reduces recovery time by 1 week per success (max 3)",
      questsCompleted: "Each recovery quest completed reduces time by 1d4 days and adds +50 gp equivalent in goodwill",
    },
    reputationGains: {
      local: "+2 renown with settlement; unlocks special NPC contacts",
      faction: "+2 renown with aligned faction",
      story: "Named NPCs become allies; party known as heroes of the disaster",
    },
  },

  major: {
    severityLabel: "Major",
    costInGold: { min: 20000, max: 100000, perResident: 100 },
    timeInWeeks: { min: 24, max: 52 },
    workforceNeeded: "Kingdom-level resources required; guilds, temples, noble sponsors",
    workforceCount: "500–2,000 workers over 6–12 months; skilled specialists needed",
    stages: [
      { stage: "Survival Phase", weeks: "1–4", description: "Recover survivors, establish refugee camps, prevent plague" },
      { stage: "Clearance Phase", weeks: "5–10", description: "Remove destroyed buildings, assess damage, make site safe" },
      { stage: "Infrastructure First", weeks: "11–22", description: "Rebuild roads, water systems, walls, key civic buildings" },
      { stage: "Residential Rebuild", weeks: "23–40", description: "Homes and shops rebuilt; population invited to return" },
      { stage: "Economic Restoration", weeks: "41–52", description: "Markets reopen, guilds reform, tax base recovers" },
    ],
    pcInvolvementBonuses: {
      goldDonated: "Each 1,000 gp donated reduces recovery time by 1 week",
      laborProvided: "Each day of physical labor counts as 50 workers",
      magicApplied: "Major construction spells (Fabricate, Move Earth) count as 500 workers per cast",
      organizingRolls: "DC 15 Persuasion/Leadership to secure noble or guild sponsorship adds 5,000 gp worth of labor",
      questsCompleted: "Each major recovery quest reduces time by 1d2 weeks and grants +1 renown with a faction",
    },
    reputationGains: {
      local: "+4 renown; title of 'Rebuilder' or equivalent honorific",
      faction: "+3 renown with aligned factions; formal alliance possible",
      nobility: "Noble recognition; possible land grant or reward from ruling faction",
      story: "Permanent story landmark: 'The heroes who saved [settlement name]'",
    },
  },

  catastrophic: {
    severityLabel: "Catastrophic",
    costInGold: { min: 200000, max: 1000000, perResident: 1000 },
    timeInWeeks: { min: 104, max: 520 },
    workforceNeeded: "Multinational effort; divine or magical intervention strongly recommended",
    workforceCount: "Thousands of workers over 2–10 years; entire economic apparatus of a nation",
    stages: [
      { stage: "Disaster Response", months: "1–3", description: "International aid, survivor retrieval, quarantine if needed" },
      { stage: "Site Safety", months: "4–6", description: "Make ruins safe; deal with magical contamination or undead" },
      { stage: "Resettlement Planning", months: "7–12", description: "Survey the land, plan new layout, begin foundation work" },
      { stage: "Long Rebuild", years: "2–5", description: "Sustained national-level rebuilding effort" },
      { stage: "Societal Recovery", years: "5–10", description: "Cultural, economic, and demographic recovery" },
    ],
    pcInvolvementBonuses: {
      goldDonated: "Each 10,000 gp donated reduces recovery time by 1 month",
      magicApplied: "Wish spell used for recovery counts as 1 year of effort",
      organizingRolls: "DC 17 Persuasion to secure international coalition adds 50,000 gp equivalent effort",
      questsCompleted: "Each epic recovery quest reduces time by 1d4 months and grants title-level reward",
      divineIntervention: "Successful Divine Intervention for recovery instantly restores one stage",
    },
    reputationGains: {
      local: "+6 renown; 'Savior of [Region]' — legendary status",
      faction: "+5 renown with all involved factions; oaths of fealty possible",
      nobility: "Ruling-class recognition; potential to be made a lord, granted a domain, or written into law",
      story: "Party becomes part of recorded history; songs, statues, and holy texts reference them",
    },
  },
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Generate a disaster event object for a given type and severity.
 * @param {string} type - Key from NATURAL_DISASTERS or MAGICAL_DISASTERS
 * @param {string} severity - "minor" | "moderate" | "major" | "catastrophic" (natural only)
 * @returns {Object} Disaster event with metadata and mechanical details
 */
export function generateDisaster(type, severity = "moderate") {
  const natural = NATURAL_DISASTERS[type];
  const magical = MAGICAL_DISASTERS[type];

  if (natural) {
    const severityData = natural.severity[severity];
    if (!severityData) {
      return { error: `Severity "${severity}" not found for disaster type "${type}".` };
    }
    return {
      id: natural.id,
      label: natural.label,
      category: "natural",
      severity,
      description: natural.description,
      terrain: natural.terrain,
      ...severityData,
      phases: Object.values(DISASTER_PHASES).map((p) => p.id),
    };
  }

  if (magical) {
    return {
      id: magical.id,
      label: magical.label,
      category: "magical",
      severity: magical.severity,
      cause: magical.cause,
      effects: magical.effects,
      containmentMethods: magical.containmentMethods,
      duration: magical.duration,
      areaOfEffect: magical.areaOfEffect,
      phases: Object.values(DISASTER_PHASES).map((p) => p.id),
    };
  }

  return { error: `Disaster type "${type}" not found.` };
}

/**
 * Get full details for a specific disaster phase.
 * @param {string} phase - "warningSigns" | "onset" | "peak" | "aftermath"
 * @returns {Object} Phase data or error
 */
export function getDisasterPhase(phase) {
  const phaseData = DISASTER_PHASES[phase];
  if (!phaseData) {
    return { error: `Phase "${phase}" not found. Valid phases: ${Object.keys(DISASTER_PHASES).join(", ")}.` };
  }
  return phaseData;
}

/**
 * Calculate the population impact of a disaster on a given settlement.
 * @param {string} disasterType - Key from NATURAL_DISASTERS or MAGICAL_DISASTERS
 * @param {string} severity - "minor" | "moderate" | "major" | "catastrophic"
 * @param {number} populationSize - Number of residents in the settlement
 * @returns {Object} Estimated casualties, displaced, economic cost, and quest hooks
 */
export function calculatePopulationImpact(disasterType, severity, populationSize) {
  const impactTemplate = POPULATION_IMPACT[severity];
  if (!impactTemplate) {
    return { error: `Severity "${severity}" not found in POPULATION_IMPACT.` };
  }

  const casualtyMin = Math.round(populationSize * parseFloat(impactTemplate.casualties.percentage.split("–")[0]) / 100);
  const casualtyMax = Math.round(populationSize * parseFloat(impactTemplate.casualties.percentage.split("–")[1]) / 100);
  const displacedMin = Math.round(populationSize * parseFloat(impactTemplate.displacement.percentage.split("–")[0]) / 100);
  const displacedMax = Math.round(populationSize * parseFloat(impactTemplate.displacement.percentage.split("–")[1]) / 100);
  const economicCostMin = RECOVERY_MECHANICS[severity].costInGold.min;
  const economicCostMax = RECOVERY_MECHANICS[severity].costInGold.max;
  const costByResidentMin = populationSize * RECOVERY_MECHANICS[severity].costInGold.perResident;

  return {
    disasterType,
    severity,
    populationSize,
    casualties: {
      estimated: `${casualtyMin}–${casualtyMax}`,
      description: impactTemplate.casualties.description,
    },
    displaced: {
      estimated: `${displacedMin}–${displacedMax}`,
      description: impactTemplate.displacement.description,
    },
    infrastructureDamage: impactTemplate.infrastructureDamage,
    economicImpact: {
      ...impactTemplate.economicImpact,
      totalCostEstimate: `${economicCostMin.toLocaleString()}–${Math.max(economicCostMax, costByResidentMin).toLocaleString()} gp`,
    },
    moraleImpact: impactTemplate.moraleImpact,
    questHooks: impactTemplate.questHooksGenerated,
  };
}

/**
 * Generate a set of warning signs for a given disaster type.
 * @param {string} disasterType - Key from NATURAL_DISASTERS or MAGICAL_DISASTERS
 * @returns {Object} Warning signs, skills, and DCs
 */
export function generateWarningSign(disasterType) {
  const WARNING_SIGNS = {
    earthquake: [
      "Animals flee the area en masse",
      "Low rumbling felt in the ground but not heard",
      "Loose dust and pebbles vibrate on flat surfaces",
      "Deep wells show unusual water turbidity",
      "Old buildings creak and shift unpredictably",
    ],
    flood: [
      "Upstream river water levels are abnormally high",
      "Smell of mud and rain intensifies without rain falling locally",
      "Wildlife seen moving to higher ground",
      "Wet season arrives two weeks early",
      "Local fishers refuse to go out on the water",
    ],
    wildfire: [
      "Smoke visible on the horizon",
      "Dry, hot wind with no rain for weeks",
      "Animals streaming away from treeline",
      "Ash falling like black snow",
      "Sky turns orange or red at midday",
    ],
    volcanicEruption: [
      "Sulfur smell in the air for days",
      "Ground warm to the touch near the mountain",
      "Small ash puffs from the summit",
      "Hot springs become scalding",
      "Tremors every few hours",
    ],
    tsunami: [
      "Ocean water rapidly recedes, exposing seabed",
      "Deep, distant boom sound from the sea",
      "Coastal wildlife retreats inland",
      "Unusual wave patterns without wind",
      "Earthquake felt shortly before",
    ],
    tornado: [
      "Sky turns sickly green",
      "Funnel-shaped cloud visible in distance",
      "Sudden dead calm before the storm",
      "Roaring sound like distant thunder growing louder",
      "Hail begins falling suddenly",
    ],
    avalanche: [
      "Cracks appear in the snowpack on slopes above",
      "Deep booming sounds from the mountain",
      "Unusual amounts of fallen snow debris below",
      "Temperature spikes cause rapid snow melt",
      "Locals who know the mountain refuse to travel the pass",
    ],
    drought: [
      "River levels falling weekly",
      "Crops wilting despite irrigation",
      "Water prices quietly doubling in markets",
      "Disputes over well access increasing",
      "Livestock being sold off early",
    ],
    plague: [
      "Multiple people coughing or feverish in the market",
      "Healer's shop besieged with patients",
      "Dead rats or animals appearing in the streets",
      "Unusual smell of sickness in the poorer district",
      "Travelers from another city are being turned away",
    ],
    meteorStrike: [
      "A bright light falls across the night sky over days",
      "Seers and astrologers issue dire warnings",
      "Impact predicted by a specific celestial event",
      "Animals stare skyward and howl",
      "Scholars note an unusual object in the night sky growing brighter",
    ],
    wildMagicStorm: [
      "Cantrips misfiring or producing wrong colors",
      "Arcana DC 13: sense Weave turbulence",
      "Compass-like divination spells give contradictory results",
      "Strange lights in the sky at night",
      "Magic items spark or glow unprompted",
    ],
    planarRift: [
      "Reality shimmers like heat haze in an area",
      "Sounds from elsewhere are heard briefly",
      "Creatures from other planes spotted fleetingly",
      "Arcana DC 14: detect planar thinning",
      "Locals report seeing 'ghosts' or 'demons' that vanish",
    ],
    manaDrain: [
      "Spells feel harder to cast; minor failures",
      "Magical lights dim without cause",
      "Arcane items feel 'empty'",
      "The local mage complains of headaches",
      "Arcana DC 12: sense reduced ambient magic",
    ],
    arcaneExplosion: [
      "Magical construct or artifact behaving erratically",
      "Arcana DC 15: detect dangerous magical feedback loop",
      "Crackling sounds from a specific location",
      "Small spontaneous explosions nearby",
      "Animals avoid a specific area entirely",
    ],
    undeadUprising: [
      "Graveyard soil disturbed without cause",
      "Cold spots appear in the area",
      "Religion DC 13: sense necrotic energy building",
      "Animals refuse to enter the cemetery or nearby area",
      "Recently deceased reported moving by hysterical witnesses",
    ],
    elementalConvergence: [
      "Elemental imbalance: fire burns cold, water flows upward briefly",
      "Arcana DC 14: detect multiple elemental nodes aligning",
      "Brief appearances of elementals in unusual places",
      "Extreme localized weather changes without cause",
      "Elemental creatures unusually aggressive",
    ],
    timeDistortion: [
      "Clocks and hourglasses run at different speeds",
      "Brief visions of past or future",
      "Arcana DC 15: detect temporal instability",
      "People experience déjà vu repeatedly",
      "Animals behave as though startled by something not present",
    ],
    realityFracture: [
      "Things flicker or appear slightly wrong",
      "Multiple realities seem to overlap in brief moments",
      "Arcana DC 18: detect Weave tear forming",
      "Divination magic gives impossible or contradictory answers",
      "The area has a sense of profound wrongness that all creatures feel",
    ],
  };

  const signs = WARNING_SIGNS[disasterType];
  if (!signs) {
    return { error: `No warning signs defined for disaster type "${disasterType}".` };
  }

  const phase = DISASTER_PHASES.warningSigns;
  return {
    disasterType,
    warningSigns: signs,
    detectionChecks: phase.checkTypes,
    dmTips: phase.dmActions,
  };
}

/**
 * Calculate recovery details for a disaster based on type, severity, and settlement size.
 * @param {string} disasterType - Key from NATURAL_DISASTERS or MAGICAL_DISASTERS
 * @param {string} severity - "minor" | "moderate" | "major" | "catastrophic"
 * @param {string} settlementSize - "hamlet" | "village" | "town" | "city" | "metropolis"
 * @returns {Object} Full recovery plan including cost, timeline, workforce, and PC bonuses
 */
export function calculateRecovery(disasterType, severity, settlementSize) {
  const SETTLEMENT_POPULATIONS = {
    hamlet: 50,
    village: 500,
    town: 2500,
    city: 10000,
    metropolis: 50000,
  };

  const population = SETTLEMENT_POPULATIONS[settlementSize] || 1000;
  const mechanics = RECOVERY_MECHANICS[severity];
  if (!mechanics) {
    return { error: `Severity "${severity}" not found in RECOVERY_MECHANICS.` };
  }

  const goldCost = Math.max(mechanics.costInGold.min, population * mechanics.costInGold.perResident);

  return {
    disasterType,
    severity,
    settlementSize,
    estimatedPopulation: population,
    costInGold: goldCost,
    timeInWeeks: mechanics.timeInWeeks,
    workforceNeeded: mechanics.workforceNeeded,
    workforceCount: mechanics.workforceCount,
    stages: mechanics.stages,
    pcInvolvementBonuses: mechanics.pcInvolvementBonuses,
    reputationGains: mechanics.reputationGains,
  };
}

/**
 * Roll a random disaster appropriate for a region type.
 * @param {string} region - "coastal" | "mountain" | "plains" | "forest" | "urban" | "arctic" | "magical" | "any"
 * @returns {Object} A randomly selected disaster type with suggested severity
 */
export function rollRandomDisaster(region = "any") {
  const REGION_DISASTER_TABLES = {
    coastal: ["flood", "tsunami", "wildfire", "plague", "meteorStrike", "planarRift"],
    mountain: ["earthquake", "avalanche", "volcanicEruption", "wildMagicStorm", "elementalConvergence"],
    plains: ["tornado", "drought", "wildfire", "plague", "meteorStrike", "wildMagicStorm"],
    forest: ["wildfire", "flood", "plague", "manaDrain", "undeadUprising", "elementalConvergence"],
    urban: ["earthquake", "plague", "flood", "wildfire", "arcaneExplosion", "undeadUprising"],
    arctic: ["avalanche", "blizzard", "drought", "timeDistortion", "planarRift"],
    magical: ["wildMagicStorm", "planarRift", "manaDrain", "arcaneExplosion", "realityFracture", "timeDistortion"],
    any: [
      "earthquake", "flood", "wildfire", "volcanicEruption", "tsunami",
      "tornado", "avalanche", "drought", "plague", "meteorStrike",
      "wildMagicStorm", "planarRift", "manaDrain", "arcaneExplosion",
      "undeadUprising", "elementalConvergence", "timeDistortion", "realityFracture",
    ],
  };

  const SEVERITY_WEIGHTS = [
    { severity: "minor", weight: 40 },
    { severity: "moderate", weight: 35 },
    { severity: "major", weight: 20 },
    { severity: "catastrophic", weight: 5 },
  ];

  const table = REGION_DISASTER_TABLES[region] || REGION_DISASTER_TABLES.any;
  const type = table[Math.floor(Math.random() * table.length)];

  const roll = Math.random() * 100;
  let cumulative = 0;
  let chosenSeverity = "minor";
  for (const entry of SEVERITY_WEIGHTS) {
    cumulative += entry.weight;
    if (roll < cumulative) {
      chosenSeverity = entry.severity;
      break;
    }
  }

  const isNatural = !!NATURAL_DISASTERS[type];
  const isMagical = !!MAGICAL_DISASTERS[type];

  return {
    region,
    type,
    severity: isNatural ? chosenSeverity : null,
    category: isNatural ? "natural" : isMagical ? "magical" : "unknown",
    disaster: generateDisaster(type, chosenSeverity),
    warningSigns: generateWarningSign(type),
    populationImpact: isNatural
      ? `Use calculatePopulationImpact("${type}", "${chosenSeverity}", populationSize)`
      : `Magical disasters scale by containment speed — assess manually`,
  };
}
