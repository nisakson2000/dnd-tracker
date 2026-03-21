/**
 * @file arenaSystem.js
 * @description Arena, tournament, and gladiatorial combat data and helper functions
 *              for The Codex — D&D Companion.
 * @module arenaSystem
 *
 * Covers:
 *  - Arena types and their structural properties
 *  - Match formats and win conditions
 *  - Tournament bracket structures
 *  - Arena hazards with mechanical effects
 *  - Betting system with odds and crowd favor
 *  - Prize tiers by tournament prestige level
 */

// ---------------------------------------------------------------------------
// ARENA TYPES
// ---------------------------------------------------------------------------

/**
 * The five primary arena venue types, each with physical and operational details.
 * @type {Object.<string, Object>}
 */
export const ARENA_TYPES = {
  gladiatorial_pit: {
    id: "gladiatorial_pit",
    name: "Gladiatorial Pit",
    size: "small",
    dimensionsFt: "40 × 40",
    capacity: 200,
    lighting: "torchlit",
    surface: "packed sand and gravel",
    description:
      "A compact fighting pit carved into the earth or stonework, built for intimate combat. Spectators ring the top edge and bellow down at the combatants.",
    rules: [
      "1v1 or small teams only (max 2v2)",
      "No ranged weapons unless declared beforehand",
      "Surrender accepted — yield ends the fight",
      "No outside interference from crowd or handlers",
    ],
    typicalStakes: {
      entryFee: "5–20 gp",
      prizeGold: "50–200 gp",
      sideWagers: true,
      deathRules: "Fights to first blood or yield — death rare but possible",
    },
    atmosphere: "Gritty, personal, smells of blood and sawdust",
    commonIn: ["rough taverns", "thieves guild basements", "frontier towns"],
  },

  grand_colosseum: {
    id: "grand_colosseum",
    name: "Grand Colosseum",
    size: "large",
    dimensionsFt: "200 × 120",
    capacity: 15000,
    lighting: "daylight with magical illumination at night",
    surface: "white sand over stone",
    description:
      "A monumental open-air arena built for spectacle and public entertainment. Tiered seating, royal boxes, and elaborate gate systems for dramatic fighter entrances.",
    rules: [
      "All weapon types permitted",
      "Magic use allowed unless explicitly banned for an event",
      "House healers on standby — execution requires crowd/emperor approval",
      "Combatants may be accompanied by one handler/second",
    ],
    typicalStakes: {
      entryFee: "100–500 gp or sponsor backing",
      prizeGold: "1,000–10,000 gp",
      sideWagers: true,
      deathRules: "Death matches permitted; crowd decides fate on yields",
    },
    atmosphere: "Roaring crowds, pageantry, political theater",
    commonIn: ["imperial capitals", "major city-states", "ancient ruins repurposed"],
  },

  underground_fight_club: {
    id: "underground_fight_club",
    name: "Underground Fight Club",
    size: "small",
    dimensionsFt: "30 × 30",
    capacity: 80,
    lighting: "dim lanterns, often magical smoke",
    surface: "bare stone, bloodstained",
    description:
      "An illegal operation held in warehouses, sewers, or warded basements. No official rules, no city oversight. Everything is permitted and nothing is recorded.",
    rules: [
      "No rules — anything goes",
      "Weapons, magic, poison all permitted",
      "Fight ends when one combatant cannot continue",
      "Cheating encouraged; getting caught is the only foul",
      "Identities often hidden (masks, aliases)",
    ],
    typicalStakes: {
      entryFee: "10 gp entry + cut of winnings to the house",
      prizeGold: "200–2,000 gp (untaxed, unmarked)",
      sideWagers: true,
      deathRules: "Death matches common; bodies quietly disposed of",
    },
    atmosphere: "Smoky, dangerous, morally bankrupt, thrilling",
    commonIn: ["thieves guild territory", "port city underbellies", "corrupt noble estates"],
    illegal: true,
    legalRisk: "Arrest, fine, or execution if city watch intervenes",
  },

  magical_arena: {
    id: "magical_arena",
    name: "Magical Arena",
    size: "medium",
    dimensionsFt: "100 × 100 (shifts during combat)",
    capacity: 3000,
    lighting: "conjured radiance, color-coded by team",
    surface: "enchanted terrain — changes each match",
    description:
      "A purpose-built arena woven with persistent enchantments. The terrain morphs between fights or even during them. Gravity, fire, water, and arcane hazards are part of the experience.",
    rules: [
      "All combat styles permitted",
      "Arena hazards are part of the fight — no complaints",
      "Dispel Magic does not deactivate arena enchantments",
      "Referees are magically shielded and neutral",
      "Death by arena hazard does not count as opponent's kill",
    ],
    typicalStakes: {
      entryFee: "250 gp",
      prizeGold: "2,000–8,000 gp",
      sideWagers: true,
      deathRules: "Stasis fields capture downed fighters before death — usually",
    },
    atmosphere: "Spectacular, unpredictable, beloved by mage colleges",
    commonIn: ["arcane academies", "wizard city-states", "planar crossroads"],
    specialFeature: "Terrain changes via Terrain Draw each round (roll d10 on ARENA_HAZARDS)",
  },

  tournament_grounds: {
    id: "tournament_grounds",
    name: "Tournament Grounds",
    size: "large",
    dimensionsFt: "Multiple fields: jousting 300 × 40, melee 80 × 80",
    capacity: 8000,
    lighting: "full daylight, formal banners",
    surface: "well-maintained grass and packed earth lanes",
    description:
      "A formal multi-field event space used for official tournaments. Includes separate lanes for jousting, an open field for melee, and pavilions for archery. Governed by strict chivalric or civic codes.",
    rules: [
      "No lethal intent — combat ends at first yield or unhorsing",
      "Registered participants only — no anonymity without noble dispensation",
      "Magic use restricted unless it is an arcane tournament",
      "Heralds announce each bout; rules violations result in disqualification",
      "Honor code enforced — dirty tactics forfeit the match",
    ],
    typicalStakes: {
      entryFee: "50–200 gp or noble sponsorship",
      prizeGold: "500–5,000 gp plus titles and land grants",
      sideWagers: true,
      deathRules: "Deaths rare and scandalous — major political incident if it occurs",
    },
    atmosphere: "Pageantry, honor, noble politics, festivity",
    commonIn: ["kingdoms", "duchies", "harvest festivals", "royal celebrations"],
    events: ["jousting", "mounted melee", "foot melee", "archery", "magical duel exhibition"],
  },
};

// ---------------------------------------------------------------------------
// MATCH FORMATS
// ---------------------------------------------------------------------------

/**
 * Six match formats defining rules, win conditions, and round structure.
 * @type {Object.<string, Object>}
 */
export const MATCH_FORMATS = {
  duel: {
    id: "duel",
    name: "1v1 Duel",
    participants: { min: 2, max: 2 },
    teamSize: 1,
    description:
      "Two combatants face each other in single combat. The purest test of individual skill.",
    rules: [
      "No outside assistance",
      "Win by reducing opponent to 0 HP, forcing a yield, or knocking unconscious",
      "Both combatants must start from opposing ends",
      "No pre-placed equipment unless both agree",
    ],
    winConditions: [
      "Opponent reaches 0 HP",
      "Opponent yields (speaks yield word or drops weapon)",
      "Opponent is knocked unconscious",
      "Opponent leaves the arena boundary",
    ],
    typicalRounds: 1,
    duration: "5–15 minutes",
    tiebreaker: "Sudden death overtime — first hit wins",
    popularIn: ["gladiatorial pits", "tournament grounds", "magical arenas"],
  },

  team_battle: {
    id: "team_battle",
    name: "Team Battle",
    participants: { min: 6, max: 10 },
    teamSize: "3v3 or 5v5",
    description:
      "Two teams clash until all members of one side are eliminated or yield. Tests coordination and tactics as much as individual prowess.",
    rules: [
      "Teams must be equal size",
      "Friendly fire counts",
      "Players may revive downed teammates with a Medicine check (DC 15) during combat",
      "No substitutions mid-match",
    ],
    winConditions: [
      "All opposing team members reach 0 HP or yield",
      "Team captain yields on behalf of the team",
      "Time limit reached — team with most members standing wins",
    ],
    typicalRounds: 1,
    duration: "15–40 minutes",
    tiebreaker: "Surviving HP totals compared; highest total wins",
    popularIn: ["grand colosseum", "magical arenas", "tournament grounds"],
  },

  battle_royale: {
    id: "battle_royale",
    name: "Battle Royale",
    participants: { min: 4, max: 20 },
    teamSize: 1,
    description:
      "Every combatant for themselves. A chaotic free-for-all where alliances form and shatter until only one fighter remains.",
    rules: [
      "No permanent alliances (temporary truces allowed)",
      "No targeting a single combatant while others are still active without tactical reason",
      "Arena shrinks by 10 ft every 3 rounds to force engagement",
      "Last combatant standing wins",
    ],
    winConditions: [
      "Last combatant conscious and within bounds",
      "All others eliminated, yielded, or fled",
    ],
    typicalRounds: "Varies — usually 8–15 rounds",
    duration: "30–60 minutes",
    tiebreaker: "If arena fully collapses, fighter with highest remaining HP wins",
    popularIn: ["grand colosseum", "underground fight clubs", "magical arenas"],
  },

  gauntlet: {
    id: "gauntlet",
    name: "Gauntlet",
    participants: { min: 1, max: 1 },
    teamSize: 1,
    description:
      "A single fighter or team faces consecutive opponents with no rest between bouts. Tests endurance, resource management, and sheer will to survive.",
    rules: [
      "Fighter carries over all HP, spell slots, and conditions between fights",
      "Fighter may use items carried in — no resupply between rounds",
      "Crowd may throw rations or potions (house rule, not guaranteed)",
      "Number of fights determined in advance (typically 3–7)",
    ],
    winConditions: [
      "Defeat all waves without dying",
      "Surviving any set number of waves earns partial prize",
    ],
    typicalRounds: "3–7 consecutive fights",
    duration: "45–90 minutes total",
    tiebreaker: "N/A — last wave determines outcome",
    popularIn: ["underground fight clubs", "magical arenas", "gladiatorial pits"],
    resourceDrain: true,
    restBetweenFights: false,
  },

  king_of_the_hill: {
    id: "king_of_the_hill",
    name: "King of the Hill",
    participants: { min: 2, max: 8 },
    teamSize: "1 or teams",
    description:
      "A marked zone in the center of the arena must be controlled. Points accumulate while a combatant or team holds the zone.",
    rules: [
      "Central zone is 15 × 15 ft marked with glowing lines",
      "Zone is held when only one combatant (or one team) occupies it",
      "Points accrue each round at end of round (1 point per round held)",
      "Downed fighters count as vacating the zone",
    ],
    winConditions: [
      "First to 10 points wins",
      "OR hold zone for 3 consecutive rounds",
      "OR all other combatants are eliminated",
    ],
    typicalRounds: "10–15 rounds",
    duration: "20–40 minutes",
    tiebreaker: "Sudden death — next point wins",
    popularIn: ["magical arenas", "grand colosseum", "tournament grounds"],
  },

  capture_the_flag: {
    id: "capture_the_flag",
    name: "Capture the Flag",
    participants: { min: 4, max: 10 },
    teamSize: "2v2 to 5v5",
    description:
      "Each team defends a flag (or artifact, banner, etc.) at their base while trying to seize the opposing team's flag and return it to their own base.",
    rules: [
      "Flags must be physically carried — no teleportation of flag",
      "Flag carrier's movement speed is halved",
      "If flag carrier is downed, flag drops in place",
      "Dropped flag can be returned to base by own team member (no combat required)",
      "Flag cannot be hidden or concealed",
    ],
    winConditions: [
      "Capture opponent's flag and return it to home base while own flag is present",
      "Alternatively, eliminate all opponents",
    ],
    typicalRounds: "Best of 3 captures",
    duration: "30–50 minutes",
    tiebreaker: "Elimination match if tied after 3 rounds",
    popularIn: ["tournament grounds", "magical arenas"],
    objectiveFocused: true,
  },
};

// ---------------------------------------------------------------------------
// TOURNAMENT BRACKETS
// ---------------------------------------------------------------------------

/**
 * Tournament bracket structures with match counts and fairness ratings.
 * @type {Object.<string, Object>}
 */
export const TOURNAMENT_BRACKETS = {
  single_elimination: {
    id: "single_elimination",
    name: "Single Elimination",
    description:
      "Lose once and you're out. Fastest format, high stakes every match. Seeding matters enormously.",
    supportedEntrantCounts: [8, 16, 32],
    structure: {
      8: { rounds: 3, totalMatches: 7, description: "Quarterfinals → Semifinals → Final" },
      16: { rounds: 4, totalMatches: 15, description: "Round of 16 → Quarters → Semis → Final" },
      32: { rounds: 5, totalMatches: 31, description: "Round of 32 → 16 → 8 → 4 → Final" },
    },
    byeRules: "Top seeds receive byes if entrant count is not a power of 2",
    fairnessRating: 3,
    fairnessNote: "Low — a skilled fighter eliminated by one unlucky match",
    tension: "Extreme — every fight is elimination",
    timeToComplete: "Short (all rounds played consecutively or over 1–2 days)",
    bestFor: ["spectacle events", "time-limited tournaments", "gladiatorial pits"],
  },

  double_elimination: {
    id: "double_elimination",
    name: "Double Elimination",
    description:
      "Two losses required for elimination. A loser's bracket runs parallel to the winner's bracket, and the winner of each bracket meets in the grand final.",
    supportedEntrantCounts: [8, 16],
    structure: {
      8: {
        rounds: "Up to 6 rounds",
        totalMatches: 14,
        description: "Winner's Bracket + Loser's Bracket + Grand Final (possible reset match)",
      },
      16: {
        rounds: "Up to 8 rounds",
        totalMatches: 30,
        description: "Winner's Bracket + Loser's Bracket + Grand Final",
      },
    },
    byeRules: "Byes assigned in winner's bracket first round if needed",
    fairnessRating: 4,
    fairnessNote: "Good — one bad performance does not end a run",
    tension: "High in loser's bracket; moderate in winner's bracket",
    timeToComplete: "Moderate (50% more matches than single elimination)",
    bestFor: ["serious competitions", "determining true rankings", "magical arenas"],
  },

  round_robin: {
    id: "round_robin",
    name: "Round Robin",
    description:
      "Every participant fights every other participant once. Winner determined by total wins. Most thorough format.",
    supportedEntrantCounts: [4, 6, 8],
    structure: {
      4: { rounds: 3, totalMatches: 6, description: "Each fighter plays 3 matches" },
      6: { rounds: 5, totalMatches: 15, description: "Each fighter plays 5 matches" },
      8: { rounds: 7, totalMatches: 28, description: "Each fighter plays 7 matches" },
    },
    byeRules: "If odd number of entrants, one fighter gets a bye each round",
    scoringSystem: "Win = 1 pt, Draw = 0.5 pt, Loss = 0 pt",
    tiebreaker: "Head-to-head record, then total damage dealt (tracked by referee)",
    fairnessRating: 5,
    fairnessNote: "Highest fairness — full sample of performance",
    tension: "Lower early on; decisive in final rounds",
    timeToComplete: "Long — best for multi-day festivals",
    bestFor: ["tournament grounds", "determining league champions", "small group events"],
  },

  swiss_system: {
    id: "swiss_system",
    name: "Swiss System",
    description:
      "Fighters are paired against opponents with similar records each round. No elimination — everyone completes all rounds. Final standings by record.",
    supportedEntrantCounts: "Any (best with 8–32)",
    structure: {
      rounds: "Log₂(entrants) rounded up — typically 4–5 rounds for 16–32 entrants",
      totalMatches: "Entrants × Rounds ÷ 2",
      description:
        "Round 1 is random; subsequent rounds pair fighters with same win-loss record",
    },
    byeRules: "Lowest-ranked fighter with no previous bye receives a bye worth 1 win",
    scoringSystem: "Win = 1 pt, Loss = 0 pt; tiebreakers use opponent win percentage",
    fairnessRating: 5,
    fairnessNote:
      "Excellent — no elimination, all fighters get meaningful matches throughout",
    tension: "Builds steadily — top-table matches in final rounds are intense",
    timeToComplete: "Moderate — fewer rounds than round robin for same entrant count",
    bestFor: ["large open tournaments", "when full elimination is impractical", "arcane academies"],
  },
};

// ---------------------------------------------------------------------------
// ARENA HAZARDS
// ---------------------------------------------------------------------------

/**
 * Ten arena hazards with damage, saving throws, and activation triggers.
 * @type {Array.<Object>}
 */
export const ARENA_HAZARDS = [
  {
    id: "spike_traps",
    index: 0,
    name: "Spike Traps",
    description:
      "Iron spikes spring up from hidden floor panels. Triggered by pressure plates or a hidden lever operated by the arena master.",
    damage: "2d6 piercing",
    saveDC: 14,
    saveType: "DEX",
    saveEffect: "Half damage on success",
    activation: "triggered",
    activationNote: "Arena master pulls lever, or pressure plate (DC 13 Perception to spot)",
    areaOfEffect: "5 × 5 ft square",
    reset: "Retract after 1 round; reset every 3 rounds",
    visible: false,
    recurring: true,
  },
  {
    id: "flame_jets",
    index: 1,
    name: "Flame Jets",
    description:
      "Pipes in the floor or walls erupt with blasts of alchemical fire on a fixed timer.",
    damage: "3d6 fire",
    saveDC: 15,
    saveType: "DEX",
    saveEffect: "Half damage on success",
    activation: "timed",
    activationNote: "Fire every 2 rounds; herald announces first activation",
    areaOfEffect: "15 ft line, 5 ft wide",
    reset: "Automatic — fires again next cycle",
    visible: true,
    recurring: true,
    warningRound: true,
  },
  {
    id: "rising_water",
    index: 2,
    name: "Rising Water",
    description:
      "Drains close and water floods the arena floor. Combatants must fight in increasingly deep water.",
    damage: "Ongoing — difficult terrain; drowning risk at 5 ft depth",
    saveDC: 13,
    saveType: "STR",
    saveEffect: "Avoid being knocked prone by current on success",
    activation: "timed",
    activationNote: "Begins round 3; rises 1 ft per round",
    areaOfEffect: "Entire arena floor",
    reset: "Drains after combat ends",
    visible: true,
    recurring: false,
    special:
      "At 3 ft: difficult terrain. At 5 ft: must swim (Athletics DC 12 each round). At 7 ft: drowning rules apply.",
  },
  {
    id: "collapsing_floor",
    index: 3,
    name: "Collapsing Floor",
    description:
      "Sections of the arena floor give way, dropping combatants into pits below.",
    damage: "2d6 bludgeoning (fall) + possible monster encounter below",
    saveDC: 15,
    saveType: "DEX",
    saveEffect: "Catch edge — no fall on success (requires action to climb out)",
    activation: "random",
    activationNote: "Roll d6 at start of each round on a 1 a random 10 × 10 section collapses",
    areaOfEffect: "10 × 10 ft section",
    reset: "Permanent for combat duration — pit remains",
    visible: false,
    recurring: false,
    special: "Pit is 20 ft deep; climbing out requires DC 13 Athletics",
  },
  {
    id: "monster_release",
    index: 4,
    name: "Monster Release",
    description:
      "A gate in the arena wall swings open and a beast or monster is released into the combat.",
    damage: "Varies by creature (arena master's choice)",
    saveDC: null,
    saveType: null,
    saveEffect: null,
    activation: "triggered",
    activationNote: "Arena master activates at dramatically appropriate moment",
    areaOfEffect: "N/A — creature acts on its own initiative",
    reset: "One creature per gate; multiple gates possible",
    visible: true,
    recurring: false,
    typicalCreatures: [
      "dire wolf (CR 1)",
      "owlbear (CR 3)",
      "wyvern (CR 6)",
      "troll (CR 5)",
      "giant crocodile (CR 5)",
    ],
    special: "Creature is hostile to all combatants unless trained otherwise",
  },
  {
    id: "magical_darkness",
    index: 5,
    name: "Magical Darkness Zones",
    description:
      "Patches of impenetrable magical darkness descend over sections of the arena, blocking all light including darkvision.",
    damage: "None — tactical hazard",
    saveDC: null,
    saveType: null,
    saveEffect: null,
    activation: "timed",
    activationNote: "Activates round 2; new zone appears each round in random location",
    areaOfEffect: "20 ft radius sphere",
    reset: "Each zone lasts 3 rounds then fades",
    visible: false,
    recurring: true,
    special:
      "Cannot be dispelled by fighters. Attacks into or out of darkness are made with disadvantage unless possessing truesight.",
  },
  {
    id: "gravity_reversal",
    index: 6,
    name: "Gravity Reversal",
    description:
      "A section of the arena experiences sudden gravity reversal. Unprepared combatants are flung toward the ceiling.",
    damage: "2d6 bludgeoning (ceiling impact) + 1d6 per 10 ft falling back down",
    saveDC: 16,
    saveType: "STR",
    saveEffect: "Brace against floor — immune to initial fling on success",
    activation: "random",
    activationNote: "Roll d8 at start of round; on a 1 triggers in a random 30 × 30 zone",
    areaOfEffect: "30 × 30 ft zone",
    reset: "Reverses back to normal after 1 round",
    visible: false,
    recurring: true,
    special: "Flying or hovering creatures unaffected. Ceiling height assumed 30 ft.",
  },
  {
    id: "acid_pools",
    index: 7,
    name: "Acid Pools",
    description:
      "Sections of the arena floor open to reveal pools of caustic acid bubbling just below.",
    damage: "3d6 acid on contact; 1d6 acid at start of each turn while submerged",
    saveDC: 13,
    saveType: "DEX",
    saveEffect: "Avoid falling in on success when floor opens",
    activation: "timed",
    activationNote: "Floor panels open round 4; location announced round 3",
    areaOfEffect: "10 ft radius pool",
    reset: "Pools remain for duration of combat",
    visible: true,
    recurring: false,
    special: "Acid dissolves non-magical equipment on a failed DC 15 DEX save after 2 rounds.",
  },
  {
    id: "lightning_pillars",
    index: 8,
    name: "Lightning Pillars",
    description:
      "Obelisks around the arena perimeter charge and discharge arcs of lightning across the arena floor in sweeping patterns.",
    damage: "4d6 lightning",
    saveDC: 15,
    saveType: "DEX",
    saveEffect: "Half damage on success",
    activation: "timed",
    activationNote: "Pillars charge visibly for 1 round (blue glow) then discharge",
    areaOfEffect: "30 ft line connecting two opposing pillars",
    reset: "Recharge takes 2 rounds; fires again each cycle",
    visible: true,
    recurring: true,
    warningRound: true,
    special: "Metal armor wearers have disadvantage on the save.",
  },
  {
    id: "shifting_walls",
    index: 9,
    name: "Shifting Walls",
    description:
      "Heavy stone walls slide and rotate through the arena, changing the layout and potentially separating combatants or crushing those who don't move.",
    damage: "4d10 bludgeoning if caught by moving wall",
    saveDC: 14,
    saveType: "STR",
    saveEffect: "Push out of path — no damage on success",
    activation: "timed",
    activationNote: "Walls begin moving round 2; direction changes every 3 rounds",
    areaOfEffect: "Wall is 5 ft wide, 10 ft tall, 20 ft long",
    reset: "Walls cycle continuously",
    visible: true,
    recurring: true,
    special:
      "Combatants separated by a wall must spend movement to navigate around it. Wall movement counts as forced movement.",
  },
];

// ---------------------------------------------------------------------------
// BETTING SYSTEM
// ---------------------------------------------------------------------------

/**
 * Betting system rules including odds calculation, payout structure, and crowd favor mechanics.
 * @type {Object}
 */
export const BETTING_SYSTEM = {
  oddsCalculation: {
    description:
      "Odds are set based on the CR differential between fighters, modified by crowd sentiment and fighter reputation.",
    baseDifferential: {
      rule: "For every 2 CR difference, the lower-CR fighter's odds increase by 1 step on the odds scale",
      oddsScale: [
        { label: "Even", ratio: "1:1", crDifference: 0 },
        { label: "Slight Underdog", ratio: "3:2", crDifference: 1 },
        { label: "Underdog", ratio: "2:1", crDifference: 2 },
        { label: "Heavy Underdog", ratio: "4:1", crDifference: 4 },
        { label: "Massive Underdog", ratio: "8:1", crDifference: 6 },
        { label: "Hopeless Underdog", ratio: "15:1", crDifference: 8 },
      ],
    },
    reputationModifier: {
      rule: "Fighter reputation (fame score) shifts odds by up to 1 step in either direction",
      fameEffect:
        "Fame > 75: odds shift 1 step toward favorite. Fame < 25: odds shift 1 step toward underdog.",
    },
    houseEdge: "House takes 10% of all winning payouts",
  },

  payoutStructure: {
    description: "Payouts are calculated from the odds at time of bet placement, not at fight time",
    minimumBet: "1 gp",
    maximumBet: "500 gp (standard), unlimited for private tables",
    payoutFormula: "Payout = (bet amount × odds numerator / odds denominator) - house cut",
    example: {
      bet: "10 gp on 4:1 underdog",
      grossPayout: "40 gp",
      houseCut: "4 gp",
      netPayout: "36 gp profit + original 10 gp stake returned",
    },
    lateOdds:
      "Odds may shift 1 step if large amounts are placed on one side before the fight begins",
  },

  crowdFavor: {
    description:
      "When a fighter earns the crowd's approval through heroic or entertaining actions, they receive mechanical benefits.",
    favorThreshold: {
      low: { label: "Ignored", crowdScore: "0–25", effect: "No benefit" },
      moderate: { label: "Noticed", crowdScore: "26–50", effect: "No mechanical benefit yet" },
      high: {
        label: "Cheered",
        crowdScore: "51–75",
        effect: "Advantage on Intimidation and Performance checks in arena",
      },
      veryHigh: {
        label: "Beloved",
        crowdScore: "76–90",
        effect:
          "Advantage on Intimidation and Performance; once per fight, regain 1d6 HP from crowd energy",
      },
      legendary: {
        label: "Idol",
        crowdScore: "91–100",
        effect:
          "All above + once per fight gain Inspiration; DM may rule the crowd throws a healing potion",
      },
    },
    gainFavorActions: [
      { action: "Defeat opponent dramatically (finishing blow with flair)", crowdGain: "+15" },
      { action: "Spare a yielding opponent despite having the advantage", crowdGain: "+20" },
      { action: "Withstand a powerful hit and keep fighting", crowdGain: "+10" },
      { action: "Use an unusual or creative tactic", crowdGain: "+8" },
      { action: "Taunt the opponent (successful Intimidation check)", crowdGain: "+5" },
      { action: "Win against a heavy underdog (you are the underdog)", crowdGain: "+25" },
    ],
    loseFavorActions: [
      { action: "Attack a yielded opponent", crowdLoss: "-30" },
      { action: "Flee or cower for a full round", crowdLoss: "-20" },
      { action: "Use obviously dishonorable tactics (poison, invisible allies)", crowdLoss: "-25" },
      { action: "Bore the crowd (no movement or attack for 2 rounds)", crowdLoss: "-10" },
    ],
    crowdScoreStart: 50,
  },
};

// ---------------------------------------------------------------------------
// PRIZE TIERS
// ---------------------------------------------------------------------------

/**
 * Five prize tiers spanning amateur to legendary tournament prestige.
 * @type {Array.<Object>}
 */
export const PRIZE_TIERS = [
  {
    tier: 1,
    label: "Amateur",
    tournamentLevel: "Local pit fights, tavern brawls, village festivals",
    goldReward: { min: 50, max: 200, typical: 100 },
    itemRewards: [
      "Common magic item (potion of healing, +1 mundane weapon equivalent)",
      "Trophy (carved bone, iron belt buckle)",
    ],
    titleEarned: "Pit Fighter",
    fameGain: 5,
    fameNote: "Known locally; people in the district recognize the name",
    additionalBenefits: [
      "Free drinks at the hosting tavern for a week",
      "Invitation to next local circuit event",
    ],
  },
  {
    tier: 2,
    label: "Journeyman",
    tournamentLevel: "Regional arena circuits, city-sanctioned fights",
    goldReward: { min: 300, max: 1000, typical: 600 },
    itemRewards: [
      "Uncommon magic item (Cloak of Protection, +1 weapon)",
      "Engraved medal or bracer",
    ],
    titleEarned: "Arena Challenger",
    fameGain: 15,
    fameNote: "Known across the region; merchants recognize the face",
    additionalBenefits: [
      "Sponsorship offer from minor merchant guild (covers travel costs)",
      "Access to training at the regional arena",
      "Discounted lodging at any inn that hosts fights",
    ],
  },
  {
    tier: 3,
    label: "Veteran",
    tournamentLevel: "Major city championship, inter-city invitational",
    goldReward: { min: 1500, max: 4000, typical: 2500 },
    itemRewards: [
      "Rare magic item (Flame Tongue, Ring of Protection)",
      "Custom engraved armor piece or weapon",
      "Portrait painted and hung in arena hall of fame",
    ],
    titleEarned: "Champion of [City Name]",
    fameGain: 30,
    fameNote: "Known nationally; nobles and guild masters seek audience",
    additionalBenefits: [
      "Noble patronage offer (monthly stipend in exchange for service/appearances)",
      "Guild membership offer (Fighter's Guild, Mercenary Company)",
      "Right to display the arena's sigil on personal heraldry",
    ],
  },
  {
    tier: 4,
    label: "Elite",
    tournamentLevel: "Grand Colosseum invitational, Kingdom championship",
    goldReward: { min: 6000, max: 15000, typical: 10000 },
    itemRewards: [
      "Very Rare magic item (Vorpal Sword, Mantle of Spell Resistance)",
      "Commissioned masterwork armor (nonmagical but legendary craftsmanship)",
      "Land grant or estate deed",
    ],
    titleEarned: "Grand Champion / Blade of the Realm",
    fameGain: 55,
    fameNote: "Known internationally; royalty knows the name and face",
    additionalBenefits: [
      "Royal audience with the reigning monarch",
      "Named in bardic songs and plays performed across the kingdom",
      "Statue erected in the colosseum's champion gallery",
      "Offer of command rank in the royal military (if desired)",
    ],
  },
  {
    tier: 5,
    label: "Legendary",
    tournamentLevel: "The Grand Rite, Planar Championship, once-in-a-generation spectacle",
    goldReward: { min: 25000, max: 100000, typical: 50000 },
    itemRewards: [
      "Legendary magic item (Deck of Many Things, Sword of Answering, Holy Avenger)",
      "A boon from a deity or planar patron",
      "Permanent naming right for the arena or a new arena district",
    ],
    titleEarned: "The Undying / The Eternal Champion / Worldslayer",
    fameGain: 100,
    fameNote: "Legendary across planes; spoken of in divine halls",
    additionalBenefits: [
      "Ascension to minor nobility (baronetcy or equivalent)",
      "Invitation to an extraplanar patron's court",
      "Historical record — name inscribed in permanent magical monument",
      "Future entries to any arena are free for life",
      "DC 20 History check by any NPC recognizes them on sight, anywhere in the known world",
    ],
  },
];

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Retrieve a single arena type by its string ID.
 * @param {string} typeId - The key of the arena type (e.g. "grand_colosseum").
 * @returns {Object|null} The arena type object, or null if not found.
 */
export function getArenaType(typeId) {
  if (!typeId || typeof typeId !== "string") return null;
  return ARENA_TYPES[typeId] ?? null;
}

/**
 * Retrieve a single match format by its string ID.
 * @param {string} formatId - The key of the match format (e.g. "battle_royale").
 * @returns {Object|null} The match format object, or null if not found.
 */
export function getMatchFormat(formatId) {
  if (!formatId || typeof formatId !== "string") return null;
  return MATCH_FORMATS[formatId] ?? null;
}

/**
 * Generate a bracket structure for a given entrant count and bracket type.
 * Returns the bracket metadata along with a generated list of round pairings
 * using placeholder entrant slots.
 *
 * @param {number} entrantCount - Number of participants entering the tournament.
 * @param {string} bracketType - The bracket type ID (e.g. "single_elimination").
 * @returns {Object|null} Bracket details and generated round pairings, or null on invalid input.
 */
export function generateBracket(entrantCount, bracketType) {
  if (!entrantCount || typeof entrantCount !== "number" || entrantCount < 2) return null;
  if (!bracketType || typeof bracketType !== "string") return null;

  const template = TOURNAMENT_BRACKETS[bracketType];
  if (!template) return null;

  // Determine structure entry — for Swiss/round_robin with flexible entrants, compute dynamically
  let structure = null;
  let rounds = 0;
  let totalMatches = 0;

  if (bracketType === "swiss_system") {
    rounds = Math.ceil(Math.log2(entrantCount));
    totalMatches = Math.floor((entrantCount * rounds) / 2);
    structure = {
      rounds,
      totalMatches,
      description: `${rounds} rounds of Swiss pairings for ${entrantCount} entrants`,
    };
  } else if (bracketType === "round_robin") {
    rounds = entrantCount - 1;
    totalMatches = (entrantCount * (entrantCount - 1)) / 2;
    structure = {
      rounds,
      totalMatches,
      description: `Each of ${entrantCount} fighters plays ${entrantCount - 1} matches`,
    };
  } else {
    // Single or double elimination — use closest supported size
    const supported = template.supportedEntrantCounts;
    const closest = supported.reduce((prev, curr) =>
      Math.abs(curr - entrantCount) < Math.abs(prev - entrantCount) ? curr : prev
    );
    structure = template.structure[closest];
    rounds = structure.rounds;
    totalMatches = structure.totalMatches;
  }

  // Build placeholder entrant slots
  const entrants = Array.from({ length: entrantCount }, (_, i) => `Entrant ${i + 1}`);

  // Build round-by-round pairings (round 1 only for elimination types)
  const round1Pairings = [];
  const shuffled = [...entrants].sort(() => Math.random() - 0.5);
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    round1Pairings.push({ match: round1Pairings.length + 1, fighter1: shuffled[i], fighter2: shuffled[i + 1] });
  }
  if (shuffled.length % 2 !== 0) {
    round1Pairings.push({ match: round1Pairings.length + 1, fighter1: shuffled[shuffled.length - 1], fighter2: "BYE" });
  }

  return {
    bracketType,
    bracketName: template.name,
    entrantCount,
    rounds,
    totalMatches,
    structure,
    fairnessRating: template.fairnessRating,
    round1Pairings,
    note: "Subsequent round pairings are determined by match outcomes.",
  };
}

/**
 * Roll a random arena hazard from ARENA_HAZARDS using a d10.
 * @returns {Object} A randomly selected hazard object.
 */
export function rollArenaHazard() {
  const roll = Math.floor(Math.random() * ARENA_HAZARDS.length);
  return ARENA_HAZARDS[roll];
}

/**
 * Calculate betting odds for a fight based on the two fighters' Challenge Ratings.
 * Returns the odds entry from the BETTING_SYSTEM odds scale for each fighter.
 *
 * @param {number} fighter1CR - Challenge Rating of fighter 1.
 * @param {number} fighter2CR - Challenge Rating of fighter 2.
 * @returns {Object} Odds object with fighter1 and fighter2 entries and differential info.
 */
export function calculateBettingOdds(fighter1CR, fighter2CR) {
  if (typeof fighter1CR !== "number" || typeof fighter2CR !== "number") {
    return null;
  }

  const scale = BETTING_SYSTEM.oddsCalculation.baseDifferential.oddsScale;
  const crDiff = Math.abs(fighter1CR - fighter2CR);

  // Find the best matching odds step
  const getOddsEntry = (diff) => {
    let best = scale[0];
    for (const entry of scale) {
      if (diff >= entry.crDifference) best = entry;
    }
    return best;
  };

  const oddsEntry = getOddsEntry(crDiff);
  const favorite = fighter1CR >= fighter2CR ? "fighter1" : "fighter2";
  const underdog = favorite === "fighter1" ? "fighter2" : "fighter1";

  return {
    crDifferential: crDiff,
    favorite: {
      role: favorite,
      cr: favorite === "fighter1" ? fighter1CR : fighter2CR,
      odds: "1:1 base (favorite — bet less to win proportionally)",
      label: "Even or Favorite",
    },
    underdog: {
      role: underdog,
      cr: underdog === "fighter1" ? fighter1CR : fighter2CR,
      odds: oddsEntry.ratio,
      label: oddsEntry.label,
    },
    houseEdge: BETTING_SYSTEM.payoutStructure.payoutFormula,
    houseEdgePct: "10%",
    note: "Reputation and fame scores may shift odds by 1 step. See BETTING_SYSTEM.oddsCalculation.reputationModifier.",
  };
}

/**
 * Retrieve a prize tier by tournament prestige level (1–5).
 * @param {number} tournamentLevel - A number from 1 (amateur) to 5 (legendary).
 * @returns {Object|null} The prize tier object, or null if out of range.
 */
export function getPrizeTier(tournamentLevel) {
  if (typeof tournamentLevel !== "number") return null;
  const tier = PRIZE_TIERS.find((t) => t.tier === tournamentLevel);
  return tier ?? null;
}
