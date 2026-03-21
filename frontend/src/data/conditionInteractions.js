/**
 * Condition Interactions — D&D 5e condition relationships, immunities, removal methods,
 * save-retry rules, and stacking mechanics.
 *
 * Covers how conditions imply or conflict with one another, what creature types or
 * features grant immunity, how each condition ends, which conditions allow repeat saves,
 * and how duplicate instances of the same condition are handled.
 *
 * No React. Pure data and helper functions.
 */

// ---------------------------------------------------------------------------
// CONDITION_INTERACTIONS
// Describes which conditions imply others, which conflict, and any special
// combat mechanic interactions between paired conditions.
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} ConditionInteraction
 * @property {string[]} [implies]       - Conditions automatically applied alongside this one.
 * @property {string[]} [conflicts]     - Conditions that cannot coexist (applying one removes the other).
 * @property {Object[]} [combinedRules] - Extra mechanical rules when paired with another condition.
 */

/** @type {Object.<string, ConditionInteraction>} */
export const CONDITION_INTERACTIONS = {
  Petrified: {
    implies: ['Incapacitated'],
    conflicts: [],
    notes: [
      'Creature is unaware of its surroundings (unconscious-like state) while petrified.',
      'Weight increases tenfold and creature ceases aging.',
      'Resistance to all damage; immune to poison and disease (existing ones are suspended).',
    ],
    combinedRules: [],
  },

  Unconscious: {
    implies: ['Incapacitated', 'Prone'],
    conflicts: [],
    notes: [
      'Creature drops whatever it is holding and falls prone.',
      'Creature is unaware of its surroundings.',
      'Auto-fails STR and DEX saving throws.',
      'Attack rolls against the creature have advantage.',
      'Melee hits from within 5 ft are critical hits.',
    ],
    combinedRules: [],
  },

  Paralyzed: {
    implies: ['Incapacitated'],
    conflicts: [],
    notes: [
      'Creature auto-fails STR and DEX saving throws.',
      'Attack rolls against the creature have advantage.',
      'Melee hits from within 5 ft are critical hits.',
    ],
    combinedRules: [],
  },

  Stunned: {
    implies: ['Incapacitated'],
    conflicts: [],
    notes: [
      'Creature can\'t move and can speak only falteringly.',
      'Creature auto-fails STR and DEX saving throws.',
      'Attack rolls against the creature have advantage.',
    ],
    combinedRules: [],
  },

  Incapacitated: {
    implies: [],
    conflicts: [],
    notes: [
      'Can\'t take actions or reactions.',
      'Automatically applied by Petrified, Unconscious, Paralyzed, and Stunned — do not double-list.',
    ],
    combinedRules: [],
  },

  Frightened: {
    implies: [],
    conflicts: [],
    notes: [
      'Disadvantage on ability checks and attack rolls while the source of fear is within line of sight.',
      'Can\'t willingly move closer to the source of its fear.',
    ],
    combinedRules: [],
  },

  Prone: {
    implies: [],
    conflicts: [],
    notes: [
      'Disadvantage on attack rolls.',
      'Melee attacks against the creature have advantage; ranged attacks have disadvantage.',
      'Must spend half movement to stand up.',
    ],
    combinedRules: [
      {
        pairedWith: 'Unconscious',
        rule: 'Auto-fail STR and DEX saving throws (Unconscious already causes this; Prone reinforces the prone state).',
      },
    ],
  },

  Restrained: {
    implies: [],
    conflicts: [],
    notes: [
      'Movement speed becomes 0 and can\'t benefit from bonuses to speed.',
      'Attack rolls against the creature have advantage.',
      'The creature\'s attack rolls have disadvantage.',
      'Disadvantage on DEX saving throws.',
    ],
    combinedRules: [
      {
        pairedWith: 'Grappled',
        rule: 'Movement is 0 from both sources — stacks conceptually but is still simply 0 total. Track both conditions separately since they have different removal conditions.',
      },
    ],
  },

  Grappled: {
    implies: [],
    conflicts: [],
    notes: [
      'Movement speed becomes 0 and can\'t benefit from bonuses to speed.',
      'Condition ends if grappler is incapacitated or creature is moved out of reach.',
    ],
    combinedRules: [
      {
        pairedWith: 'Restrained',
        rule: 'Movement is 0 from both sources — stacks conceptually but is still simply 0 total. Track both conditions separately since they have different removal conditions.',
      },
    ],
  },

  Blinded: {
    implies: [],
    conflicts: [],
    notes: [
      'Auto-fail ability checks requiring sight.',
      'Attack rolls against the creature have advantage.',
      'The creature\'s attack rolls have disadvantage.',
    ],
    combinedRules: [],
  },

  Charmed: {
    implies: [],
    conflicts: [],
    notes: [
      'Can\'t attack the charmer or target the charmer with harmful abilities or magical effects.',
      'Charmer has advantage on social ability checks against the creature.',
    ],
    combinedRules: [],
  },

  Deafened: {
    implies: [],
    conflicts: [],
    notes: [
      'Auto-fail ability checks requiring hearing.',
    ],
    combinedRules: [],
  },

  Exhaustion: {
    implies: [],
    conflicts: [],
    notes: [
      'Stacks in levels 1–6; each level adds cumulative penalties.',
      'Level 1: Disadvantage on ability checks.',
      'Level 2: Speed halved.',
      'Level 3: Disadvantage on attack rolls and saving throws.',
      'Level 4: HP maximum halved.',
      'Level 5: Speed reduced to 0.',
      'Level 6: Death.',
    ],
    combinedRules: [],
  },

  Invisible: {
    implies: [],
    conflicts: [],
    notes: [
      'Impossible to see without special senses.',
      'Treated as heavily obscured for hiding.',
      'Attack rolls against the creature have disadvantage.',
      'The creature\'s attack rolls have advantage.',
    ],
    combinedRules: [],
  },

  Poisoned: {
    implies: [],
    conflicts: [],
    notes: [
      'Disadvantage on attack rolls and ability checks.',
    ],
    combinedRules: [],
  },
};

// ---------------------------------------------------------------------------
// CONDITION_IMMUNITY_SOURCES
// What creature types, spells, or class features grant immunity to specific conditions.
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} ImmunitySource
 * @property {string}   source      - The creature type, spell, or feature name.
 * @property {string}   type        - 'creatureType' | 'spell' | 'classFeature' | 'item' | 'trait'
 * @property {string[]} conditions  - Conditions this source grants immunity to.
 * @property {string}   [notes]     - Additional context or limitations.
 */

/** @type {ImmunitySource[]} */
export const CONDITION_IMMUNITY_SOURCES = [
  {
    source: 'Undead',
    type: 'creatureType',
    conditions: ['Charmed', 'Exhaustion', 'Frightened', 'Paralyzed', 'Poisoned'],
    notes: 'Core undead trait. Specific undead statblocks may vary — always check the individual creature.',
  },
  {
    source: 'Construct',
    type: 'creatureType',
    conditions: ['Charmed', 'Exhaustion', 'Frightened', 'Paralyzed', 'Poisoned'],
    notes: 'Core construct trait. Specific construct statblocks may vary — always check the individual creature.',
  },
  {
    source: 'Elemental',
    type: 'creatureType',
    conditions: ['Paralyzed', 'Poisoned', 'Unconscious'],
    notes: 'Most elementals; specific statblocks may vary.',
  },
  {
    source: 'Plant (some)',
    type: 'creatureType',
    conditions: ['Blinded', 'Deafened', 'Frightened'],
    notes: 'Applies to plants without sensory organs. Check individual statblock.',
  },
  {
    source: 'Ooze',
    type: 'creatureType',
    conditions: ['Blinded', 'Charmed', 'Deafened', 'Exhaustion', 'Frightened', 'Prone'],
    notes: 'Most oozes; check individual statblock.',
  },
  {
    source: 'Freedom of Movement (spell)',
    type: 'spell',
    conditions: ['Grappled', 'Restrained', 'Paralyzed'],
    notes: 'Removes and grants immunity for the duration. Paralyzed immunity only applies to magical paralysis.',
  },
  {
    source: 'Aura of Courage (Paladin, level 10)',
    type: 'classFeature',
    conditions: ['Frightened'],
    notes: 'Paladin and all friendly creatures within 10 ft are immune while the paladin is conscious.',
  },
  {
    source: 'Aura of Devotion (Paladin — Oath of Devotion, level 7)',
    type: 'classFeature',
    conditions: ['Charmed'],
    notes: 'Paladin and friendly creatures within 10 ft immune while paladin is conscious.',
  },
  {
    source: 'Berserker Rage (Barbarian — Berserker path)',
    type: 'classFeature',
    conditions: ['Charmed', 'Frightened'],
    notes: 'While raging. Berserker subclass specifically.',
  },
  {
    source: 'Rage (Barbarian, base)',
    type: 'classFeature',
    conditions: ['Frightened'],
    notes: 'While raging. Only Frightened in base Rage; full immunity requires Berserker subclass.',
  },
  {
    source: 'Diamond Soul (Monk, level 14)',
    type: 'classFeature',
    conditions: [],
    notes: 'Not immunity, but proficiency in all saving throws including those that impose conditions.',
  },
  {
    source: 'Mindless Rage (Barbarian — Berserker, level 6)',
    type: 'classFeature',
    conditions: ['Charmed', 'Frightened'],
    notes: 'While raging, immune to Charmed and Frightened and any such effect is suspended.',
  },
  {
    source: 'Stoneskin (spell)',
    type: 'spell',
    conditions: [],
    notes: 'Resistance to nonmagical bludgeoning/piercing/slashing — not condition immunity directly.',
  },
  {
    source: 'Magic Resistance (trait)',
    type: 'trait',
    conditions: [],
    notes: 'Advantage on saving throws against spells — reduces chance of being afflicted, not full immunity.',
  },
  {
    source: 'Legendary Resistance (trait)',
    type: 'trait',
    conditions: [],
    notes: 'Auto-succeed on failed saves (limited uses) — effectively sidesteps condition application.',
  },
];

// ---------------------------------------------------------------------------
// CONDITION_REMOVAL
// How each condition is removed, categorized by method.
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} ConditionRemoval
 * @property {string[]} spells        - Spells that remove the condition.
 * @property {string[]} actions       - In-combat actions or events that end it.
 * @property {string[]} automatic     - Conditions with automatic end triggers.
 * @property {string}   notes         - General removal notes.
 */

/** @type {Object.<string, ConditionRemoval>} */
export const CONDITION_REMOVAL = {
  Blinded: {
    spells: ['Lesser Restoration', 'Heal', 'Greater Restoration'],
    actions: [],
    automatic: ['Duration expires (if from a spell or ability with a time limit)'],
    notes: 'From mundane sources (sand in eyes, darkness) ends when the source is removed. Magical blindness typically requires a spell.',
  },

  Charmed: {
    spells: ['Greater Restoration', 'Calm Emotions (suppresses)', 'Dispel Magic (if magical charm)'],
    actions: [
      'The charmer or its allies harm the charmed creature',
      'The charmer dies or is incapacitated (some sources)',
      'Creature succeeds on a repeat save at the end of its turn (source-dependent)',
    ],
    automatic: ['Spell or ability duration expires'],
    notes: 'Taking damage from the charmer or its allies typically ends charm from most spells (e.g., Charm Person). Check the specific spell or ability.',
  },

  Deafened: {
    spells: ['Lesser Restoration', 'Heal', 'Greater Restoration'],
    actions: [],
    automatic: ['Duration expires'],
    notes: 'Mundane deafness (loud explosion) may be temporary and end after a short or long rest. Magical deafness requires a spell.',
  },

  Frightened: {
    spells: ['Greater Restoration', 'Calm Emotions (suppresses)'],
    actions: [
      'The source of fear is no longer in line of sight',
      'Creature succeeds on a Wisdom save at end of its turn (source-dependent)',
    ],
    automatic: ['Duration expires', 'Source of fear dies or disappears'],
    notes: 'Some sources (Frightful Presence) require a successful save to overcome. Others end automatically when the source is gone.',
  },

  Grappled: {
    spells: ['Freedom of Movement'],
    actions: [
      'Grappler is incapacitated',
      'Creature uses its action to escape (Athletics or Acrobatics vs. grappler\'s Athletics)',
      'Creature is moved beyond grappler\'s reach by an external force',
    ],
    automatic: ['Grappler drops to 0 HP', 'Effect that moved creature out of range'],
    notes: 'Escaping requires an action and a contested check. A second creature can also attempt to break the grapple.',
  },

  Incapacitated: {
    spells: [],
    actions: [],
    automatic: ['The condition causing Incapacitated (Petrified, Paralyzed, Stunned, Unconscious) is removed'],
    notes: 'Incapacitated is never applied directly — it is always a consequence of another condition. Remove the source condition.',
  },

  Invisible: {
    spells: ['See Invisibility (reveals but doesn\'t remove)', 'Faerie Fire (reveals location)', 'Dispel Magic (if magical)'],
    actions: ['Casting a spell or attacking (some sources end the effect)', 'Using a bonus action or reaction (source-dependent)'],
    automatic: ['Duration expires', 'Concentration breaks (if concentration spell)'],
    notes: 'Spells like Invisibility end on attacking or casting. Greater Invisibility does not.',
  },

  Paralyzed: {
    spells: ['Lesser Restoration', 'Greater Restoration', 'Heal'],
    actions: [
      'Creature succeeds on a Constitution save at end of its turn (source-dependent)',
    ],
    automatic: ['Duration expires', 'Concentration breaks (if concentration spell)'],
    notes: 'Hold Person and Hold Monster allow a repeat CON save each turn. Other sources may not.',
  },

  Petrified: {
    spells: ['Greater Restoration', 'Stone to Flesh'],
    actions: [],
    automatic: ['Duration expires (rare — most petrification is permanent until dispelled)'],
    notes: 'Petrification is among the hardest conditions to remove. Stone to Flesh specifically reverses it; Greater Restoration also works.',
  },

  Poisoned: {
    spells: ['Lesser Restoration', 'Heal', 'Greater Restoration', 'Protection from Poison (removes one)'],
    actions: ['Creature succeeds on a Constitution save (source-dependent)'],
    automatic: ['Duration expires', 'Poison runs its course (varies by poison type)'],
    notes: 'Mundane antitoxin gives advantage on saves but doesn\'t remove the condition. Neutralize Poison (spell) works similarly to Lesser Restoration for poisons specifically.',
  },

  Prone: {
    spells: [],
    actions: ['Spend half movement speed to stand up'],
    automatic: [],
    notes: 'Standing up costs half your movement. If speed is 0, you cannot stand. A creature with a fly speed that goes prone falls unless it can hover.',
  },

  Restrained: {
    spells: ['Freedom of Movement', 'Dispel Magic (if magical)'],
    actions: [
      'Source of restraint is destroyed or removed (e.g., Web spell burned)',
      'Creature or ally uses action/strength to break free (source-dependent)',
    ],
    automatic: ['Duration expires', 'Concentration breaks (if concentration spell)'],
    notes: 'Web, Entangle, and similar spells have specific escape DCs. Check the source spell or ability.',
  },

  Stunned: {
    spells: [],
    actions: ['Creature succeeds on a Constitution save at end of its turn (source-dependent, e.g., Monk Stunning Strike)'],
    automatic: ['Duration expires'],
    notes: 'Most stunning effects last until the end of the next turn or until a save is made. Stunning Strike specifically allows a CON save at the end of each of the creature\'s turns.',
  },

  Unconscious: {
    spells: ['Healing Word', 'Cure Wounds', 'Heal', 'any healing spell or ability that restores HP'],
    actions: [
      'Creature regains any HP (stabilized or healed)',
      'DC 10 Medicine check to stabilize (creature remains unconscious but stops making death saves)',
    ],
    automatic: [
      'Creature makes 3 successful death saving throws (becomes stable at 0 HP)',
      '1d4 hours after stabilization creature regains 1 HP and consciousness',
    ],
    notes: 'Stabilized creatures are still unconscious and still at 0 HP — they just stop making death saves. Regaining HP (any amount) restores consciousness.',
  },

  Exhaustion: {
    spells: ['Greater Restoration (removes one level)', 'Wish'],
    actions: [],
    automatic: ['Finish a long rest removes one level (requires food and water)'],
    notes: 'Only one level is removed per long rest. Multiple levels of exhaustion require multiple long rests to fully remove.',
  },

  Deafened_MagicCure: {
    spells: ['Lesser Restoration'],
    actions: [],
    automatic: [],
    notes: 'Alias note — see Deafened entry.',
  },
};

// ---------------------------------------------------------------------------
// SAVE_RETRY_CONDITIONS
// Conditions where the afflicted creature may attempt a new saving throw,
// organized by source (spell, ability, or generic).
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} SaveRetryRule
 * @property {string}  condition  - The condition name.
 * @property {string}  source     - The spell, ability, or generic source.
 * @property {string}  save       - Saving throw type (e.g., 'Wisdom', 'Constitution').
 * @property {string}  timing     - When the retry occurs.
 * @property {string}  dc         - How the DC is determined.
 * @property {string}  [notes]    - Additional context.
 */

/** @type {SaveRetryRule[]} */
export const SAVE_RETRY_CONDITIONS = [
  // Frightened
  {
    condition: 'Frightened',
    source: 'Frightful Presence (generic dragon/creature trait)',
    save: 'Wisdom',
    timing: 'End of each of the creature\'s turns',
    dc: 'Set by the source creature\'s save DC (usually 8 + prof + CHA mod)',
    notes: 'On success, the creature is immune to that source\'s Frightful Presence for 24 hours.',
  },
  {
    condition: 'Frightened',
    source: 'Cause Fear (spell, 1st level)',
    save: 'Wisdom',
    timing: 'End of each of the creature\'s turns',
    dc: 'Caster\'s spell save DC',
    notes: 'Concentration spell. Fear ends if concentration breaks.',
  },
  {
    condition: 'Frightened',
    source: 'Fear (spell, 3rd level)',
    save: 'Wisdom',
    timing: 'End of each of the creature\'s turns',
    dc: 'Caster\'s spell save DC',
    notes: 'On success, creature is immune to this casting of Fear for 24 hours.',
  },
  {
    condition: 'Frightened',
    source: 'Phantasmal Killer (spell, 4th level)',
    save: 'Wisdom',
    timing: 'End of each of the target\'s turns',
    dc: 'Caster\'s spell save DC',
    notes: 'On a failed save, target also takes 4d10 psychic damage.',
  },

  // Charmed
  {
    condition: 'Charmed',
    source: 'Charm Person (spell, 1st level)',
    save: 'Wisdom',
    timing: 'Each time the target takes damage',
    dc: 'Caster\'s spell save DC',
    notes: 'Taking damage gives the charmed creature a new save to shake off the effect.',
  },
  {
    condition: 'Charmed',
    source: 'Dominate Person / Dominate Monster (spell)',
    save: 'Wisdom',
    timing: 'Each time the target takes damage',
    dc: 'Caster\'s spell save DC',
    notes: 'Unlike Charm Person, the dominated creature acts under the caster\'s control. New save on each instance of damage.',
  },
  {
    condition: 'Charmed',
    source: 'Otto\'s Irresistible Dance (spell, 6th level)',
    save: 'Wisdom',
    timing: 'End of each of the target\'s turns',
    dc: 'Caster\'s spell save DC',
    notes: 'On success, the spell ends.',
  },

  // Stunned
  {
    condition: 'Stunned',
    source: 'Stunning Strike (Monk class feature)',
    save: 'Constitution',
    timing: 'End of each of the target\'s turns',
    dc: '8 + proficiency bonus + Wisdom modifier',
    notes: 'Most reliable source of Stunned in combat. Save ends the condition.',
  },
  {
    condition: 'Stunned',
    source: 'Psychic Lance (Psionic spells, source-dependent)',
    save: 'Intelligence',
    timing: 'End of each of the target\'s turns',
    dc: 'Caster\'s spell save DC',
    notes: 'Source-dependent; verify with specific psionic feature or spell.',
  },
  {
    condition: 'Stunned',
    source: 'Compelled Duel / similar (some sources end in stun)',
    save: 'Varies',
    timing: 'End of each of the target\'s turns',
    dc: 'Varies by source',
    notes: 'Not all Stunned sources allow saves — check each individually.',
  },

  // Paralyzed
  {
    condition: 'Paralyzed',
    source: 'Hold Person (spell, 2nd level)',
    save: 'Wisdom',
    timing: 'End of each of the target\'s turns',
    dc: 'Caster\'s spell save DC',
    notes: 'Concentration. On success, spell ends for that target. Can target multiple with higher slots.',
  },
  {
    condition: 'Paralyzed',
    source: 'Hold Monster (spell, 5th level)',
    save: 'Wisdom',
    timing: 'End of each of the target\'s turns',
    dc: 'Caster\'s spell save DC',
    notes: 'Works on any creature, not just humanoids.',
  },
  {
    condition: 'Paralyzed',
    source: 'Ghoul Claws (creature ability)',
    save: 'Constitution',
    timing: 'End of each of the target\'s turns',
    dc: 'Set by creature\'s stat block (typically DC 10)',
    notes: 'Does not affect elves. Paralysis lasts 1 minute or until save.',
  },

  // Poisoned
  {
    condition: 'Poisoned',
    source: 'Generic poison (injury, ingested, inhaled)',
    save: 'Constitution',
    timing: 'End of each of the target\'s turns (or per poison description)',
    dc: 'Set by specific poison (typically DC 10–16)',
    notes: 'Each poison has its own frequency of saves. Some require only one save; others require saves each turn for a duration.',
  },
  {
    condition: 'Poisoned',
    source: 'Poisoned condition from class features or spells (Poison Spray, etc.)',
    save: 'Constitution',
    timing: 'End of each of the target\'s turns',
    dc: 'Caster\'s spell save DC or ability DC',
    notes: 'Varies by source; most spell-induced poisoned conditions allow a save each turn.',
  },
];

// ---------------------------------------------------------------------------
// STACKING_RULES
// How conditions interact with themselves when applied from multiple sources.
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} StackingRule
 * @property {string}  condition     - The condition name.
 * @property {boolean} stacks        - Whether multiple applications stack in severity.
 * @property {string}  multiSourceBehavior - What happens when the same condition is applied again.
 * @property {string}  durationRule  - How duration is handled on re-application.
 * @property {string}  [notes]       - Additional edge case notes.
 */

/** @type {Object.<string, StackingRule>} */
export const STACKING_RULES = {
  Exhaustion: {
    stacks: true,
    multiSourceBehavior:
      'Each application increases the exhaustion level by 1, up to a maximum of 6. Each level adds cumulative penalties. Level 6 = death.',
    durationRule:
      'Each level is tracked independently. One level is removed per long rest (with food and water).',
    notes:
      'Exhaustion is the only core condition that stacks in severity. All other conditions are binary (present or absent).',
  },

  Blinded: {
    stacks: false,
    multiSourceBehavior:
      'Applying Blinded while already Blinded has no additional mechanical effect. Track each source separately so the condition persists until all sources are removed.',
    durationRule:
      'Duration does not stack — the condition is present until all sources expire. The longer-duration source sets the effective duration.',
    notes: 'Example: both a spell and a trap blind a creature. The creature remains blinded until both expire.',
  },

  Charmed: {
    stacks: false,
    multiSourceBehavior:
      'A creature can be Charmed by multiple sources simultaneously. Each source is tracked separately. Effects from different charmers do not combine, but the creature is bound by restrictions from each.',
    durationRule:
      'Each charm instance has its own duration. Removing one source does not clear charms from other sources.',
    notes:
      'A creature charmed by two different sources must obey the restriction "can\'t attack either charmer" for both simultaneously.',
  },

  Frightened: {
    stacks: false,
    multiSourceBehavior:
      'A creature can be Frightened of multiple sources. Each fear instance is tracked separately with its own source, save DC, and duration.',
    durationRule:
      'Each instance has its own duration and save. Overcoming one source does not remove fear from another.',
    notes:
      'Movement restriction ("can\'t move closer") applies to all sources simultaneously — the most restrictive combination governs.',
  },

  Grappled: {
    stacks: false,
    multiSourceBehavior:
      'A creature can be grappled by multiple grappling creatures at the same time. Speed is still 0 regardless of the number of grapplers. Each grapple is tracked separately.',
    durationRule: 'Each grapple ends independently when its own conditions are met.',
    notes:
      'Being grappled by two creatures means escaping one still leaves the creature grappled (and at speed 0) from the other.',
  },

  Restrained: {
    stacks: false,
    multiSourceBehavior:
      'Multiple Restrained sources do not stack mechanically (speed is already 0, disadvantage is already applied). Track each source so the condition persists until all are removed.',
    durationRule: 'Longest remaining source duration governs.',
    notes: 'A creature both Grappled and Restrained is still just speed 0; no additional penalty beyond that.',
  },

  Paralyzed: {
    stacks: false,
    multiSourceBehavior:
      'Applying Paralyzed again while already Paralyzed has no additional effect. Track each source independently.',
    durationRule:
      'The condition persists until all sources expire or are removed.',
    notes: null,
  },

  Poisoned: {
    stacks: false,
    multiSourceBehavior:
      'The Poisoned condition does not stack (disadvantage cannot be doubled). However, individual poisons can stack their damage or other secondary effects independently.',
    durationRule: 'Track each poison source separately; the condition flag remains until all active poisons are resolved.',
    notes:
      'Poison damage from multiple sources is additive. The condition (disadvantage on attacks/checks) is applied once regardless of how many poisons are active.',
  },

  Prone: {
    stacks: false,
    multiSourceBehavior: 'A creature is either prone or not. Applying Prone to an already prone creature has no effect.',
    durationRule: 'Ends when the creature spends half its movement to stand. No duration tracking needed.',
    notes: null,
  },

  Stunned: {
    stacks: false,
    multiSourceBehavior:
      'Applying Stunned to an already stunned creature has no additional effect. Track each source so the condition persists until all sources expire.',
    durationRule: 'Longest remaining source duration governs.',
    notes: null,
  },

  Unconscious: {
    stacks: false,
    multiSourceBehavior: 'A creature is either unconscious or not. Regaining any HP ends the condition regardless of other sources.',
    durationRule: 'Ends when HP is restored or the creature stabilizes and eventually regains HP.',
    notes: null,
  },

  Invisible: {
    stacks: false,
    multiSourceBehavior:
      'A creature is invisible or it is not. Multiple sources of invisibility do not stack. Track each source so the condition persists until all are removed.',
    durationRule: 'The condition persists until all sources expire or end.',
    notes:
      'If one source of invisibility ends (e.g., Greater Invisibility drops) but another still applies (e.g., a potion), the creature remains invisible.',
  },

  Deafened: {
    stacks: false,
    multiSourceBehavior: 'Binary condition. Track each source independently.',
    durationRule: 'Condition persists until all sources expire.',
    notes: null,
  },

  Petrified: {
    stacks: false,
    multiSourceBehavior: 'A creature is either petrified or not. Re-applying has no effect.',
    durationRule: 'Usually indefinite until magically reversed.',
    notes: null,
  },
};

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Returns interaction data for a given condition, including implied conditions,
 * conflicts, and combined-pair rules.
 *
 * @param {string} conditionName - The condition to look up (case-sensitive, e.g. "Paralyzed").
 * @returns {ConditionInteraction|null} Interaction data or null if not found.
 */
export function getConditionInteractions(conditionName) {
  return CONDITION_INTERACTIONS[conditionName] ?? null;
}

/**
 * Returns all condition immunities that apply to a given creature type.
 * Falls back to partial string matching (case-insensitive) for flexibility.
 *
 * @param {string} creatureType - The creature type (e.g., "Undead", "Construct").
 * @returns {ImmunitySource[]} Array of matching immunity sources for that creature type.
 */
export function getConditionImmunities(creatureType) {
  if (!creatureType) return [];
  const normalized = creatureType.toLowerCase();
  return CONDITION_IMMUNITY_SOURCES.filter(
    (entry) =>
      entry.type === 'creatureType' &&
      entry.source.toLowerCase().includes(normalized)
  );
}

/**
 * Returns removal information for a given condition.
 *
 * @param {string} conditionName - The condition to look up.
 * @returns {ConditionRemoval|null} Removal data or null if not found.
 */
export function getConditionRemoval(conditionName) {
  return CONDITION_REMOVAL[conditionName] ?? null;
}

/**
 * Given a list of currently active condition names, returns any additional
 * conditions that are implied but may not yet be tracked.
 *
 * @param {string[]} activeConditions - Array of currently active condition names.
 * @returns {{ condition: string, impliedBy: string }[]} List of implied conditions not already in the active list.
 */
export function checkImpliedConditions(activeConditions) {
  if (!Array.isArray(activeConditions)) return [];
  const activeSet = new Set(activeConditions);
  const missing = [];

  for (const condName of activeConditions) {
    const interaction = CONDITION_INTERACTIONS[condName];
    if (!interaction || !interaction.implies) continue;
    for (const implied of interaction.implies) {
      if (!activeSet.has(implied)) {
        missing.push({ condition: implied, impliedBy: condName });
      }
    }
  }

  return missing;
}

/**
 * Returns the stacking rules for a given condition.
 *
 * @param {string} conditionName - The condition to look up.
 * @returns {StackingRule|null} Stacking rule data or null if not found.
 */
export function getStackingRules(conditionName) {
  return STACKING_RULES[conditionName] ?? null;
}
