/**
 * @file spellDuelSystem.js
 * @description Magical counterspell and spell duel mechanics for The Codex — D&D Companion.
 * Covers counterspell rules, dispel magic, antimagic zones, spell interactions,
 * magic item interactions, and optional spell duel variant rules.
 * @module spellDuelSystem
 * @version 1.0.0
 */

// ---------------------------------------------------------------------------
// COUNTERSPELL RULES
// ---------------------------------------------------------------------------

/**
 * Rules governing the Counterspell reaction (PHB p.228).
 * Automatic success when the counterspell slot level >= the target spell level.
 * Otherwise requires an ability check: DC = 10 + target spell level.
 */
export const COUNTERSPELL_RULES = {
  name: "Counterspell",
  spellLevel: 3,
  castingTime: "1 reaction, taken when a creature within 60 ft casts a spell",
  range: 60, // feet
  requiresSight: true, // must see the caster
  usesReaction: true,
  description:
    "Attempt to interrupt a creature in the process of casting a spell.",
  automaticSuccess: {
    condition: "Counterspell slot level >= target spell level",
    result: "The spell fails and has no effect.",
  },
  checkRequired: {
    condition: "Counterspell slot level < target spell level",
    dc: "10 + target spell level",
    abilityCheck: "Spellcasting ability check",
    onSuccess: "The spell fails and has no effect.",
    onFailure: "The spell proceeds normally.",
  },
  upcasting: {
    description:
      "Cast at a higher level to auto-counter spells of that level or lower.",
    example:
      "Casting Counterspell at 5th level automatically counters any spell of 5th level or lower.",
  },
  limitations: [
    "Cannot counter a spell if you cannot see the caster.",
    "Uses your reaction — only one per round.",
    "The target must be within 60 feet.",
    "Does not prevent the spell slot from being expended by the target.",
    "Cannot counter a feature that mimics a spell but is not actually a spell.",
  ],
  rulings: {
    multipleCounterspells:
      "Multiple creatures can attempt to counter the same spell. If one succeeds, the spell is negated.",
    counteringCounterspell:
      "Counterspell can itself be counterspelled, since it is a spell.",
    twinned:
      "A twinned Counterspell can target two separate spellcasters on the same turn.",
  },
};

// ---------------------------------------------------------------------------
// DISPEL MAGIC RULES
// ---------------------------------------------------------------------------

/**
 * Rules governing Dispel Magic (PHB p.234).
 * Automatically ends spells of 3rd level or lower on target.
 * Spells of 4th level or higher require an ability check: DC = 10 + spell level.
 */
export const DISPEL_MAGIC_RULES = {
  name: "Dispel Magic",
  spellLevel: 3,
  castingTime: "1 action",
  range: 120, // feet
  target:
    "One creature, object, or magical effect within range",
  description:
    "Choose any creature, object, or magical effect within range. Any spell of 3rd level or lower on the target ends.",
  automaticDispel: {
    condition: "Target spell level <= 3",
    result: "The spell ends automatically.",
  },
  checkRequired: {
    condition: "Target spell level >= 4",
    dc: "10 + target spell level",
    abilityCheck: "Spellcasting ability check",
    onSuccess: "The spell ends.",
    onFailure: "The spell remains active.",
  },
  upcasting: {
    description:
      "Cast at a higher level to automatically dispel spells up to that level.",
    example:
      "Casting Dispel Magic at 5th level automatically ends any spell of 5th level or lower.",
  },
  targetTypes: [
    {
      type: "Creature",
      effect: "Ends all qualifying spells currently affecting that creature.",
    },
    {
      type: "Object",
      effect: "Ends all qualifying spells affecting or imbued in that object.",
    },
    {
      type: "Magical Effect",
      effect: "Ends a specific magical zone or persistent spell effect.",
    },
  ],
  limitations: [
    "Does not dispel effects from artifacts or deities.",
    "Does not remove curses — use Remove Curse for that.",
    "Cannot dispel class features or innate abilities that mimic spells.",
    "The caster chooses the target, not individual effects; all qualifying spells on target end.",
  ],
  rulings: {
    concentrationSpells:
      "Dispelling a concentration spell immediately ends it without requiring the caster to make a concentration check.",
    permanentSpells:
      "Permanent magical effects (e.g., a permanent Enlarge) are ended but not destroyed — the caster may recast.",
    unknownLevel:
      "If the level of a spell is unknown, the DM may call for the check or rule automatically.",
  },
};

// ---------------------------------------------------------------------------
// ANTI-MAGIC ZONES
// ---------------------------------------------------------------------------

/**
 * Rules governing the Antimagic Field spell (PHB p.213) and similar antimagic effects.
 * A 10-foot-radius sphere that suppresses magic within and passing through it.
 */
export const ANTI_MAGIC_ZONES = {
  name: "Antimagic Field",
  spellLevel: 8,
  shape: "10-foot-radius sphere",
  origin: "Centered on the caster",
  duration: "1 hour (concentration)",
  description:
    "A 10-foot-radius invisible sphere of antimagic surrounds the caster, moving with them.",
  effects: {
    spellCasting: {
      description:
        "Spells cannot be cast, spell slots cannot be expended, and spell effects are suppressed inside the field.",
      note: "A creature in the field is treated as having no spell slots available.",
    },
    existingSpells: {
      description:
        "Active spells and magical effects are suppressed while inside the field, not dispelled.",
      resumesOnExit: true,
    },
    magicItems: {
      description:
        "Magic items become mundane within the field. Properties and powers are suppressed, not destroyed.",
      attunement:
        "Attuned items remain attuned but their magical benefits cease while in the field.",
      resumesOnExit: true,
    },
    summonedCreatures: {
      description:
        "Summoned and conjured creatures wink out of existence while in the field, returning when it ends or they leave it.",
    },
    portalsAndTeleportation: {
      description:
        "Portals are temporarily closed, and teleportation spells fail inside the field.",
    },
    planarTravel: {
      description:
        "Spells and effects that allow planar travel are suppressed within the field.",
    },
  },
  immunities: {
    artifacts: {
      immune: true,
      description:
        "Artifacts are not suppressed by Antimagic Field — their effects continue normally.",
    },
    deities: {
      immune: true,
      description:
        "Powers granted by deities or divine entities are not affected by antimagic.",
    },
    artifacts_note:
      "Whether a specific artifact is immune is at the DM's discretion per campaign context.",
  },
  interactions: {
    antimagicOnAntimagic:
      "Two overlapping Antimagic Fields suppress each other in the area of overlap.",
    wildMagic:
      "Wild Magic Surges that have already occurred are not retroactively suppressed.",
    trueSight:
      "Truesight and similar non-magical senses function normally inside the field.",
    physicalObjects:
      "Non-magical physical objects and attacks are unaffected.",
  },
  similarEffects: [
    {
      name: "Dead Magic Zone",
      source: "Setting-specific",
      description: "A permanent area where magic does not function at all.",
    },
    {
      name: "Globe of Invulnerability",
      source: "PHB",
      description:
        "Blocks spells of 5th level or lower from passing into the globe.",
    },
    {
      name: "Mordenkainen's Disjunction",
      source: "Legacy/Optional",
      description:
        "Destroys (not suppresses) magic items and dispels all magic in area.",
    },
  ],
};

// ---------------------------------------------------------------------------
// SPELL INTERACTIONS
// ---------------------------------------------------------------------------

/**
 * Common spell interaction rules covering how spells behave when overlapping,
 * combining, or interfering with one another.
 * Each entry includes an id for programmatic lookup via getSpellInteraction().
 */
export const SPELL_INTERACTIONS = [
  {
    id: "overlapping_aoe_harmful",
    name: "Overlapping Harmful AoE Spells",
    description:
      "When two or more harmful area-of-effect spells overlap (e.g., two Fireball blasts), creatures in the overlap take damage from both. Effects do not merge — each is resolved independently.",
    rule: "Use the worst outcome for the target: both effects apply fully.",
    example:
      "A creature in the intersection of two Firewall spells takes damage from both on its turn.",
    tags: ["aoe", "overlap", "damage", "harmful"],
  },
  {
    id: "overlapping_aoe_beneficial",
    name: "Overlapping Beneficial AoE Spells",
    description:
      "When two beneficial area-of-effect spells overlap (e.g., two Bless spells), creatures in the overlap gain the best applicable effect, but do not double-stack identical bonuses.",
    rule: "Use the best outcome for the target: duplicate bonuses do not stack.",
    example:
      "Two Bless spells overlapping grant only one 1d4 bonus, not 2d4.",
    tags: ["aoe", "overlap", "buff", "beneficial"],
  },
  {
    id: "same_spell_twice",
    name: "Same Spell Cast Twice on One Target",
    description:
      "Casting the same spell on a target that is already affected does not stack the effects. The higher-level casting (or more recent if equal) takes precedence.",
    rule: "Duplicate spell effects do not stack. Use the higher slot level or most recent cast.",
    example:
      "Two Haste spells on the same target: only the higher-level one applies; the lower ends harmlessly.",
    tags: ["stacking", "duplicate", "single target"],
  },
  {
    id: "concentration_swap",
    name: "Concentration Swap",
    description:
      "A spellcaster can only maintain one concentration spell at a time. Beginning a new concentration spell immediately and automatically ends the previous one — no action or check required.",
    rule: "New concentration spell always supersedes the old one. The old spell ends instantly.",
    example:
      "A wizard concentrating on Fly casts Fly again: the first Fly ends and the new one begins.",
    tags: ["concentration", "swap", "limitation"],
  },
  {
    id: "readied_spell",
    name: "Readied Spell Rules",
    description:
      "When a spell is readied using the Ready action, the caster holds the spell using concentration. If the trigger does not occur before the caster's next turn, the spell slot is expended but the spell has no effect.",
    rule: "Readied spells use concentration. Slot is consumed when readied, not when triggered. If trigger is never met, slot is lost.",
    example:
      "A cleric readies Sacred Flame to trigger if an enemy moves. The enemy doesn't move — the slot is expended with no effect.",
    tags: ["ready", "action", "concentration", "slot"],
  },
  {
    id: "combined_fire_ice",
    name: "Combined Fire and Cold Effects",
    description:
      "There is no default rule for fire and cold canceling each other. Unless a specific spell states otherwise, both apply independently.",
    rule: "Fire and cold damage do not cancel out by default. Apply each independently.",
    example:
      "A creature hit by both Wall of Fire and Cone of Cold takes damage from both.",
    tags: ["elemental", "fire", "cold", "interaction"],
  },
  {
    id: "combined_lightning_water",
    name: "Lightning in Water",
    description:
      "Creatures fully submerged in water take vulnerability to lightning damage (DM ruling, as this is not explicitly stated in core rules). Many DMs apply this as a common-sense environmental interaction.",
    rule: "DM discretion: creatures in water may have vulnerability to lightning damage or the effect may spread to adjacent creatures.",
    example:
      "Casting Call Lightning over a lake may hit all creatures in the water.",
    tags: ["elemental", "lightning", "water", "environmental"],
  },
  {
    id: "darkness_and_darkvision",
    name: "Darkness Spell vs. Darkvision",
    description:
      "The Darkness spell creates magical darkness that darkvision cannot pierce. Creatures with darkvision are still blinded inside Darkness unless they have truesight or the Devil's Sight invocation.",
    rule: "Magical darkness from the Darkness spell blocks darkvision. Only Devil's Sight or truesight can see through it.",
    example:
      "A dwarf with darkvision inside a Darkness spell is still effectively blinded.",
    tags: ["darkness", "vision", "darkvision", "interaction"],
  },
  {
    id: "silence_and_verbal_components",
    name: "Silence and Verbal Components",
    description:
      "Spells with verbal components cannot be cast inside a Silence spell's area. Spells without verbal components are unaffected.",
    rule: "No verbal component spells can be cast inside Silence. Somatic and material only spells are unaffected.",
    example:
      "A sorcerer inside Silence cannot cast Fireball (V,S,M) but can cast spells with only somatic or material components.",
    tags: ["silence", "verbal", "component", "restriction"],
  },
  {
    id: "polymorph_and_concentration",
    name: "Polymorph and Pre-existing Concentration",
    description:
      "When a caster is polymorphed, they lose access to their spellcasting ability. Any concentration spells they were maintaining immediately end, as they can no longer concentrate as a spellcaster.",
    rule: "Polymorphed creatures cannot maintain concentration spells. All concentration spells end when Polymorph takes effect.",
    example:
      "A wizard concentrating on Wall of Force is polymorphed into a sheep — Wall of Force immediately collapses.",
    tags: ["polymorph", "concentration", "interaction", "transformation"],
  },
];

// ---------------------------------------------------------------------------
// MAGIC ITEM INTERACTIONS
// ---------------------------------------------------------------------------

/**
 * Rules for how magic items interact with antimagic effects, suppression vs. destruction,
 * and special rules for artifacts.
 */
export const MAGIC_ITEM_INTERACTIONS = {
  attunementInAntimagic: {
    title: "Attunement in an Antimagic Field",
    description:
      "An attuned creature retains their attunement status even while inside an Antimagic Field. The bond is not severed — only suppressed.",
    rule: "Attunement persists through antimagic suppression. The item's benefits simply do not function while suppressed.",
    example:
      "A paladin attuned to a Holy Avenger inside an Antimagic Field loses its bonuses but remains attuned. Bonuses return when they leave the field.",
  },
  suppressedVsDestroyed: {
    title: "Suppressed vs. Destroyed Magic Items",
    description:
      "Antimagic effects suppress magic items — they do not destroy them. The item retains all of its properties and returns to normal when the antimagic ends.",
    suppressed: {
      description: "Item's magical properties cease to function temporarily.",
      causedBy: [
        "Antimagic Field",
        "Dead Magic Zone (temporary)",
        "Globe of Invulnerability (limited)",
      ],
      recovers: true,
    },
    destroyed: {
      description:
        "Item loses its magical properties permanently or is physically destroyed.",
      causedBy: [
        "Disenchant (variant rule)",
        "Specific spell effects",
        "Mordenkainen's Disjunction (legacy)",
        "Physical destruction of a non-artifact",
      ],
      recovers: false,
    },
    rule: "Standard antimagic suppresses, not destroys. Only specific effects or physical destruction remove a magic item's power permanently.",
  },
  artifactImmunity: {
    title: "Artifact Immunity to Antimagic",
    description:
      "Artifacts are objects of such immense magical power that standard antimagic effects cannot suppress them. An artifact continues to function normally even inside an Antimagic Field.",
    rule: "Artifacts are immune to suppression from Antimagic Field and similar effects.",
    examples: [
      "The Hand of Vecna continues to function inside an Antimagic Field.",
      "A Sphere of Annihilation is not suppressed by Antimagic Field.",
    ],
    dmNote:
      "The DM determines what counts as an artifact. Named legendary items created by gods or ancient powers typically qualify.",
  },
  cursedItems: {
    title: "Cursed Items and Antimagic",
    description:
      "Cursed items are suppressed in antimagic just like regular magic items. However, the curse's attunement bond is not broken — it resumes once the antimagic ends. Only Remove Curse can sever a curse bond.",
    rule: "Antimagic suppresses cursed item effects but does not remove the curse or break attunement.",
  },
  sentientItems: {
    title: "Sentient Magic Items and Antimagic",
    description:
      "A sentient magic item's personality and awareness are suppressed inside an Antimagic Field. It cannot communicate with its wielder, use its powers, or attempt to exert influence.",
    rule: "Sentient items are fully suppressed in antimagic zones. Influence checks cannot occur while suppressed.",
  },
};

// ---------------------------------------------------------------------------
// SPELL DUEL VARIANT
// ---------------------------------------------------------------------------

/**
 * Optional homebrew rules for dramatic spellcaster duels.
 * Designed for climactic magical confrontations where two spellcasters
 * directly contest magical supremacy. Not part of core 5e rules.
 */
export const SPELL_DUEL_VARIANT = {
  name: "Spell Duel (Variant Rule)",
  type: "Homebrew / Optional",
  description:
    "An optional system for resolving dramatic magical confrontations between two spellcasters. Replaces normal combat resolution for dueling arcane rivals.",
  overview:
    "When two spellcasters decide to duel directly, they engage in a series of contested spellcasting checks representing the back-and-forth of magical thrust and counter-thrust.",
  initiating: {
    description:
      "A duel begins when both parties agree to it, or when one caster explicitly attempts to overpower another's active spell with their own.",
    requirements: [
      "Both participants must be able to cast spells.",
      "Both must be within long range of each other (typically 120 feet).",
      "Both must be aware of each other.",
    ],
  },
  contestedSpellcastingCheck: {
    description:
      "Each round of the duel, both casters make a spellcasting ability check. The loser suffers the effects described in the escalation table.",
    check: "d20 + spellcasting ability modifier",
    tiebreaker: "The defender wins ties.",
    spendingSlots: {
      description:
        "A caster may expend a spell slot before rolling to add a bonus to their check.",
      bonus: "+2 per spell slot level expended (e.g., 3rd level slot = +6)",
      declaration: "Slot expenditure must be declared before rolling.",
    },
  },
  escalationMechanics: {
    description:
      "The duel escalates over rounds as both casters pour more power into the contest. Track the duel round number.",
    rounds: [
      {
        round: 1,
        loserEffect: "The loser is pushed back 10 feet and loses their reaction.",
        winnerEffect: "The winner's next spell has advantage on attack rolls or imposes disadvantage on target saves (choose one).",
      },
      {
        round: 2,
        loserEffect:
          "The loser takes 2d6 force damage and must make a DC 12 Constitution saving throw or lose concentration on any active spell.",
        winnerEffect:
          "The winner regains a 1st level spell slot as residual magical energy coalesces.",
      },
      {
        round: 3,
        loserEffect:
          "The loser takes 4d6 force damage, is stunned until the end of their next turn, and their highest remaining spell slot is expended.",
        winnerEffect:
          "The winner may immediately cast a spell of 3rd level or lower as a bonus action.",
      },
      {
        round: 4,
        loserEffect:
          "The loser takes 6d6 force damage, is knocked prone, and is incapacitated until the start of their next turn.",
        winnerEffect:
          "The winner may end one condition on themselves or an ally within 60 feet.",
      },
      {
        round: 5,
        name: "Duel's End",
        loserEffect:
          "The loser takes 8d8 force damage and is suppressed: unable to cast spells or use magical abilities for 1 minute (Constitution saving throw DC 15 each turn to end early).",
        winnerEffect:
          "The winner gains a Duel Victory: advantage on all spell attack rolls and saving throw DCs for 10 minutes.",
      },
    ],
  },
  backlashOnFailure: {
    description:
      "If a caster expends high-level spell slots and still loses the round, a Backlash occurs. Backlash represents raw magical energy rebounding on the caster.",
    trigger:
      "Lose a contested check after expending a spell slot of 5th level or higher.",
    effect:
      "The caster takes 1d6 force damage per level of the expended slot and must succeed on a DC 10 + slot level Constitution saving throw or briefly lose control of their magic (DM determines effect: misfire, surge, or knockback).",
    wildMagicSorcerer:
      "Wild Magic Sorcerers automatically trigger a Wild Magic Surge on any Backlash event.",
  },
  endingTheDuel: {
    conditions: [
      "One caster is reduced to 0 hit points.",
      "One caster surrenders (forfeits the current round without rolling).",
      "One caster is unable to cast spells (unconscious, silenced, suppressed, etc.).",
      "A duel reaches Round 5 — the decisive final exchange.",
    ],
    surrender: {
      description:
        "Surrendering ends the duel immediately. The winner may dictate one condition (e.g., leave this place, answer one question, relinquish an item).",
    },
  },
  optionalRules: {
    audienceBonus:
      "If an audience of 5+ witnesses the duel, both casters gain advantage on round 1 (nerves and showmanship).",
    environmentalHazards:
      "The DM may introduce environmental hazards if the duel drags on (crumbling floor, storm surge, collapsing ceiling).",
    duelOfWills:
      "For non-combat narrative duels, replace spell checks with Charisma (Persuasion) vs. Wisdom (Insight) and apply narrative stakes.",
  },
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Resolves a Counterspell attempt.
 *
 * @param {number} counterspellLevel - The spell slot level used for Counterspell (minimum 3).
 * @param {number} targetSpellLevel  - The level of the spell being countered.
 * @param {number} abilityMod        - The caster's spellcasting ability modifier.
 * @returns {{ automatic: boolean, dc: number|null, roll: number|null, success: boolean, description: string }}
 */
export function resolveCounterspell(counterspellLevel, targetSpellLevel, abilityMod) {
  if (counterspellLevel < 3) {
    return {
      automatic: false,
      dc: null,
      roll: null,
      success: false,
      description: "Counterspell must be cast at 3rd level or higher.",
    };
  }

  if (counterspellLevel >= targetSpellLevel) {
    return {
      automatic: true,
      dc: null,
      roll: null,
      success: true,
      description: `Automatic success: Counterspell at level ${counterspellLevel} automatically counters a level ${targetSpellLevel} spell.`,
    };
  }

  const dc = 10 + targetSpellLevel;
  const diceRoll = Math.floor(Math.random() * 20) + 1;
  const total = diceRoll + abilityMod;
  const success = total >= dc;

  return {
    automatic: false,
    dc,
    diceRoll,
    total,
    abilityMod,
    success,
    description: success
      ? `Success (rolled ${diceRoll} + ${abilityMod} = ${total} vs DC ${dc}): The level ${targetSpellLevel} spell is countered.`
      : `Failure (rolled ${diceRoll} + ${abilityMod} = ${total} vs DC ${dc}): The level ${targetSpellLevel} spell proceeds normally.`,
  };
}

/**
 * Resolves a Dispel Magic attempt.
 *
 * @param {number} castLevel       - The spell slot level used for Dispel Magic (minimum 3).
 * @param {number} targetSpellLevel - The level of the spell being dispelled.
 * @param {number} abilityMod       - The caster's spellcasting ability modifier.
 * @returns {{ automatic: boolean, dc: number|null, roll: number|null, success: boolean, description: string }}
 */
export function resolveDispelMagic(castLevel, targetSpellLevel, abilityMod) {
  if (castLevel < 3) {
    return {
      automatic: false,
      dc: null,
      roll: null,
      success: false,
      description: "Dispel Magic must be cast at 3rd level or higher.",
    };
  }

  if (castLevel >= targetSpellLevel) {
    return {
      automatic: true,
      dc: null,
      roll: null,
      success: true,
      description: `Automatic dispel: Dispel Magic at level ${castLevel} automatically ends a level ${targetSpellLevel} spell.`,
    };
  }

  const dc = 10 + targetSpellLevel;
  const diceRoll = Math.floor(Math.random() * 20) + 1;
  const total = diceRoll + abilityMod;
  const success = total >= dc;

  return {
    automatic: false,
    dc,
    diceRoll,
    total,
    abilityMod,
    success,
    description: success
      ? `Success (rolled ${diceRoll} + ${abilityMod} = ${total} vs DC ${dc}): The level ${targetSpellLevel} spell is dispelled.`
      : `Failure (rolled ${diceRoll} + ${abilityMod} = ${total} vs DC ${dc}): The level ${targetSpellLevel} spell remains active.`,
  };
}

/**
 * Checks how a given type of magical effect interacts with an Antimagic Field.
 *
 * @param {"spell"|"magicItem"|"artifact"|"summon"|"attunement"|"concentration"|"sentient"|"cursed"} effectType
 * @returns {{ suppressed: boolean, destroyed: boolean, immune: boolean, resumes: boolean, description: string }}
 */
export function checkAntiMagicInteraction(effectType) {
  const interactions = {
    spell: {
      suppressed: true,
      destroyed: false,
      immune: false,
      resumes: true,
      description:
        "Active spells are suppressed inside an Antimagic Field. They resume when the target leaves or the field ends.",
    },
    magicItem: {
      suppressed: true,
      destroyed: false,
      immune: false,
      resumes: true,
      description:
        "Magic items become mundane inside an Antimagic Field. Properties resume when the item exits the field.",
    },
    artifact: {
      suppressed: false,
      destroyed: false,
      immune: true,
      resumes: true,
      description:
        "Artifacts are immune to Antimagic Field effects. They continue to function normally.",
    },
    summon: {
      suppressed: true,
      destroyed: false,
      immune: false,
      resumes: true,
      description:
        "Summoned and conjured creatures wink out inside an Antimagic Field, returning when it ends or they exit.",
    },
    attunement: {
      suppressed: true,
      destroyed: false,
      immune: false,
      resumes: true,
      description:
        "Attunement bond persists but is suppressed inside an Antimagic Field. Benefits resume on exit.",
    },
    concentration: {
      suppressed: true,
      destroyed: false,
      immune: false,
      resumes: false,
      description:
        "Concentration spells are suppressed. If the caster remains inside long enough, concentration may lapse at DM discretion.",
    },
    sentient: {
      suppressed: true,
      destroyed: false,
      immune: false,
      resumes: true,
      description:
        "Sentient item consciousness and powers are suppressed. Communication and influence checks are impossible while suppressed.",
    },
    cursed: {
      suppressed: true,
      destroyed: false,
      immune: false,
      resumes: true,
      description:
        "Cursed item effects are suppressed but the curse bond remains. Effects resume on exit. Only Remove Curse can break the bond.",
    },
  };

  const result = interactions[effectType];
  if (!result) {
    return {
      suppressed: false,
      destroyed: false,
      immune: false,
      resumes: false,
      description: `Unknown effect type "${effectType}". Valid types: spell, magicItem, artifact, summon, attunement, concentration, sentient, cursed.`,
    };
  }

  return result;
}

/**
 * Retrieves the interaction rule between two named spells or spell effect tags.
 * Looks up by exact interaction id, then falls back to tag matching.
 *
 * @param {string} spell1 - Name, id, or tag of the first spell/effect.
 * @param {string} spell2 - Name, id, or tag of the second spell/effect.
 * @returns {Object|null} The matching SPELL_INTERACTIONS entry, or null if none found.
 */
export function getSpellInteraction(spell1, spell2) {
  const s1 = spell1.toLowerCase().replace(/\s+/g, "_");
  const s2 = spell2.toLowerCase().replace(/\s+/g, "_");

  // Check direct id match
  const directMatch = SPELL_INTERACTIONS.find(
    (i) => i.id === s1 || i.id === s2
  );
  if (directMatch) return directMatch;

  // Tag-based fuzzy match: find interactions whose tags contain both spell terms
  const tagMatch = SPELL_INTERACTIONS.find((interaction) => {
    const tags = interaction.tags.map((t) => t.toLowerCase());
    const terms1 = s1.split("_");
    const terms2 = s2.split("_");
    const matches1 = terms1.some((t) => tags.includes(t));
    const matches2 = terms2.some((t) => tags.includes(t));
    return matches1 && matches2;
  });

  if (tagMatch) return tagMatch;

  // Fallback: single tag match for either spell
  const partialMatch = SPELL_INTERACTIONS.find((interaction) => {
    const tags = interaction.tags.map((t) => t.toLowerCase());
    const terms = [...s1.split("_"), ...s2.split("_")];
    return terms.some((t) => tags.includes(t));
  });

  return partialMatch || null;
}

/**
 * Simulates a round of a Spell Duel between two casters.
 * Both casters roll d20 + their spellcasting modifier.
 * Returns the result including winner, rolls, and applicable escalation effect.
 *
 * @param {number} caster1Level - Caster 1's overall character level (used for escalation context).
 * @param {number} caster2Level - Caster 2's overall character level (used for escalation context).
 * @param {number} caster1Mod   - Caster 1's spellcasting ability modifier.
 * @param {number} caster2Mod   - Caster 2's spellcasting ability modifier.
 * @param {number} [duelRound=1] - The current round of the duel (1–5), affects escalation severity.
 * @returns {{
 *   caster1Roll: number, caster1Total: number,
 *   caster2Roll: number, caster2Total: number,
 *   winner: 1|2|"tie",
 *   loser: 1|2|"tie",
 *   escalation: Object|null,
 *   backlash: boolean,
 *   description: string
 * }}
 */
export function rollSpellDuel(caster1Level, caster2Level, caster1Mod, caster2Mod, duelRound = 1) {
  const clampedRound = Math.min(Math.max(duelRound, 1), 5);

  const c1Roll = Math.floor(Math.random() * 20) + 1;
  const c2Roll = Math.floor(Math.random() * 20) + 1;
  const c1Total = c1Roll + caster1Mod;
  const c2Total = c2Roll + caster2Mod;

  // Defender wins ties (caster2 as defender by convention when totals are equal)
  let winner, loser;
  if (c1Total > c2Total) {
    winner = 1;
    loser = 2;
  } else {
    winner = 2;
    loser = 1;
  }

  const isTie = c1Total === c2Total;

  const escalation =
    SPELL_DUEL_VARIANT.escalationMechanics.rounds[clampedRound - 1] || null;

  const backlash = false; // Backlash requires slot expenditure tracking; flagged false here as base roll

  const tieDescription = isTie
    ? " (Tie: defender wins by convention.)"
    : "";

  const description = isTie
    ? `Round ${clampedRound} — Tie! Caster 1: ${c1Roll}+${caster1Mod}=${c1Total}, Caster 2: ${c2Roll}+${caster2Mod}=${c2Total}. ${tieDescription} Caster 2 wins as defender. ${escalation ? `Loser effect: ${escalation.loserEffect}` : ""}`
    : `Round ${clampedRound} — Caster ${winner} wins! Caster 1: ${c1Roll}+${caster1Mod}=${c1Total}, Caster 2: ${c2Roll}+${caster2Mod}=${c2Total}. ${escalation ? `Loser effect: ${escalation.loserEffect}` : ""}`;

  return {
    caster1Roll: c1Roll,
    caster1Total: c1Total,
    caster2Roll: c2Roll,
    caster2Total: c2Total,
    winner: isTie ? 2 : winner,
    loser: isTie ? 1 : loser,
    isTie,
    duelRound: clampedRound,
    escalation,
    backlash,
    description,
  };
}
